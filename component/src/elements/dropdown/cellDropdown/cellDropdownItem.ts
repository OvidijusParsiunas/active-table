import {LabelCellTextElement} from '../../cell/cellsWithTextDiv/selectCell/label/labelCellTextElement';
import {CellDropdownI, ActiveCellDropdownItems} from '../../../types/cellDropdownInternal';
import {ColumnDetailsUtils} from '../../../utils/columnDetails/columnDetailsUtils';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {LabelColorUtils} from '../../../utils/color/labelColorUtils';
import {CellText, TableContent} from '../../../types/tableContent';
import {CellDropdownItemEvents} from './cellDropdownItemEvents';
import {OptionDeleteButton} from './buttons/optionDeleteButton';
import {OptionColorButton} from './buttons/optionColorButton';
import {ColumnDetailsT} from '../../../types/columnDetails';
import {LabelOptions} from '../../../types/cellDropdown';
import {CellDetails} from '../../../types/focusedCell';
import {Browser} from '../../../utils/browser/browser';
import {CellElement} from '../../cell/cellElement';
import {EMPTY_STRING} from '../../../consts/text';
import {ActiveTable} from '../../../activeTable';
import {CellEvents} from '../../cell/cellEvents';
import {DropdownItem} from '../dropdownItem';

interface ItemToColor {
  [cellText: CellText]: string;
}

export class CellDropdownItem {
  private static readonly ACTIVE_ITEM_BACKGROUND_COLOR = '#4a69d4';

  // prettier-ignore
  private static updateCellElementIfNotUpdated(at: ActiveTable,
      newText: string, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    if ((at.content[rowIndex][columnIndex]) !== newText) {
      CellEvents.updateCell(at, newText, rowIndex, columnIndex, {processText: false, element: textElement});
    }
  }

  // prettier-ignore
  public static selectExistingItem(at: ActiveTable,
      activeItemElement: HTMLElement, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const newText = CellElement.getText(activeItemElement.children[0] as HTMLElement);
    CellDropdownItem.updateCellElementIfNotUpdated(at, newText, rowIndex, columnIndex, textElement);
    if (LabelCellTextElement.isLabelText(textElement)) {
      textElement.style.backgroundColor = at.columnsDetails[columnIndex]
        .cellDropdown.itemsDetails[newText]?.backgroundColor;
    }
  }

  // prettier-ignore
  public static addNewItem(at: ActiveTable, textElement: HTMLElement, columnDetails: ColumnDetailsT, color: string) {
    const {cellDropdown: {labelDetails}} = columnDetails;
    const newItemText = CellElement.getText(textElement);
    if (newItemText === EMPTY_STRING) return;
    let newColor = '';
    if (labelDetails?.newItemColors) {
      newColor = color || labelDetails.newItemColors[labelDetails.newItemColors.length - 1]
        || LabelColorUtils.getLatestPasteleColor();
      textElement.style.backgroundColor = newColor;
      labelDetails.newItemColors?.pop() || LabelColorUtils.setNewLatestPasteleColor();
    } else {
      newColor = CellDropdownItem.ACTIVE_ITEM_BACKGROUND_COLOR;
    }
    CellDropdownItem.addItem(at, newItemText, newColor, columnDetails);
    setTimeout(() => ColumnDetailsUtils.fireUpdateEvent(columnDetails));
  }

  // prettier-ignore
  private static updateCellTextBgColor(itemElement: HTMLElement | undefined, textElement: HTMLElement,
      dropdown: CellDropdownI, defaultText: CellText) {
    const cellText = CellElement.getText(textElement);
    if (itemElement) {
      textElement.style.backgroundColor = dropdown.itemsDetails[cellText].backgroundColor;
    } else if (!dropdown.canAddMoreOptions || cellText === EMPTY_STRING || cellText === defaultText) {
      textElement.style.backgroundColor = '';
    } else {
      const newItemColors = dropdown.labelDetails?.newItemColors; 
      textElement.style.backgroundColor = newItemColors?.[newItemColors.length - 1]
        || LabelColorUtils.getLatestPasteleColor();
    }
  }

  private static updateItemColor(itemElement: HTMLElement | undefined, activeItems: ActiveCellDropdownItems) {
    if (itemElement) {
      activeItems.matchingWithCellText = itemElement;
      itemElement.dispatchEvent(new MouseEvent('mouseenter'));
    }
  }

  private static hideHoveredItemHighlight(activeItems: ActiveCellDropdownItems) {
    const {hovered, matchingWithCellText} = activeItems;
    if (hovered) {
      hovered.style.backgroundColor = '';
    } else {
      activeItems.hovered = matchingWithCellText;
    }
  }

  // prettier-ignore
  public static attemptHighlightMatchingItemWithCell(textElement: HTMLElement, dropdown: CellDropdownI,
      defaultText: CellText, updateCellText: boolean, matchingCellElement?: HTMLElement) {
    const {activeItems, itemsDetails} = dropdown;
    const targetText = CellElement.getText(textElement);
    const itemElement = matchingCellElement || itemsDetails[targetText]?.element;
    if (!itemElement || activeItems.matchingWithCellText !== itemElement) {
      // this is used to preserve the ability for the user to still allow the use of arrow keys to traverse the dropdown
      CellDropdownItem.hideHoveredItemHighlight(activeItems);
      CellDropdownItemEvents.blurItem(dropdown, 'matchingWithCellText');
    }
    CellDropdownItem.updateItemColor(itemElement, activeItems);
    if (updateCellText && dropdown.labelDetails?.newItemColors) {
      CellDropdownItem.updateCellTextBgColor(itemElement, textElement, dropdown, defaultText);
    }
  }

  // prettier-ignore
  private static setItemOnCell(at: ActiveTable, item: HTMLElement) {
    const {element, rowIndex, columnIndex} = at.focusedElements.cell as CellDetails;
    const {cellDropdown, settings: {defaultText}} = at.columnsDetails[columnIndex];
    const textElement = element.children[0] as HTMLElement;
    const itemText = CellElement.getText(item.children[0] as HTMLElement);
    CellDropdownItem.updateCellElementIfNotUpdated(at, itemText, rowIndex, columnIndex, textElement);
    CellDropdownItem.attemptHighlightMatchingItemWithCell(textElement, cellDropdown, defaultText, true, item);
    CaretPosition.setToEndOfText(at, textElement);
  }

  // prettier-ignore
  public static setSiblingItemOnCell(at: ActiveTable,
      activeItems: ActiveCellDropdownItems, sibling: 'previousSibling' | 'nextSibling') {
    const {hovered, matchingWithCellText} = activeItems;
    const currentlyHighlightedItem = hovered || matchingWithCellText as HTMLElement;
    const siblingItem = currentlyHighlightedItem?.[sibling] as HTMLElement;
    if (siblingItem) {
      CellDropdownItem.setItemOnCell(at, siblingItem);
    } else {
      const {columnIndex} = at.focusedElements.cell as CellDetails;
      const dropdownElement = at.columnsDetails[columnIndex].cellDropdown.element as HTMLElement;
      if (sibling === 'nextSibling') {
        const firstItem = dropdownElement.children[0] as HTMLElement;
        if (firstItem) CellDropdownItem.setItemOnCell(at, firstItem);
      } else {
        const lastItem = dropdownElement.children[dropdownElement.children.length - 1] as HTMLElement;
        if (lastItem) CellDropdownItem.setItemOnCell(at, lastItem);
      }
    }
  }

  private static addItemElement(at: ActiveTable, text: string, columnDetails: ColumnDetailsT, atStart = false) {
    const {cellDropdown} = columnDetails;
    const itemElement = DropdownItem.addPlaneButtonItem(cellDropdown.element, text, atStart ? 0 : undefined);
    if (cellDropdown.customItemStyle) itemElement.style.color = cellDropdown.customItemStyle.textColor;
    if (cellDropdown.canAddMoreOptions) {
      const deleteButtonElement = OptionDeleteButton.create(at, columnDetails);
      itemElement.appendChild(deleteButtonElement);
      if (Browser.IS_COLOR_PICKER_SUPPORTED && cellDropdown.labelDetails?.newItemColors) {
        const colorInputElement = OptionColorButton.create(columnDetails);
        itemElement.appendChild(colorInputElement);
      }
    }
    CellDropdownItemEvents.set(at.shadowRoot as unknown as Document, itemElement, cellDropdown);
    return itemElement;
  }

  private static addItem(at: ActiveTable, itemText: string, color: string, columnDetails: ColumnDetailsT) {
    columnDetails.cellDropdown.itemsDetails[itemText] = {
      backgroundColor: color,
      element: CellDropdownItem.addItemElement(at, itemText, columnDetails),
    };
  }

  private static addItems(at: ActiveTable, itemToColor: ItemToColor, columnDetails: ColumnDetailsT) {
    columnDetails.cellDropdown.element.replaceChildren();
    columnDetails.cellDropdown.itemsDetails = {};
    Object.keys(itemToColor).forEach((itemText) => {
      CellDropdownItem.addItem(at, itemText, itemToColor[itemText], columnDetails);
    });
  }

  private static postProcessItemToColor(isDefaultTextRemovable: boolean, itemToColor: ItemToColor, defaultText: CellText) {
    if (isDefaultTextRemovable) delete itemToColor[defaultText];
  }

  private static changeUserOptionsToItemToColor(userOptions: LabelOptions, newItemColors?: string[]): ItemToColor {
    return userOptions.reduce<ItemToColor>((itemToColor, option) => {
      if (newItemColors) {
        itemToColor[option.text] =
          option.backgroundColor || newItemColors.pop() || LabelColorUtils.getLatestPasteleColorAndSetNew();
      } else {
        itemToColor[option.text] = CellDropdownItem.ACTIVE_ITEM_BACKGROUND_COLOR;
      }
      return itemToColor;
    }, {});
  }

  // WORK - need a more global object to keep colors consistent between columns
  // prettier-ignore
  private static aggregateItemToColor(content: TableContent, columnIndex: number, itemToColor: ItemToColor,
      newItemColors?: string[]) {
    return content.slice(1).reduce<ItemToColor>((itemToColor, row) => {
      const cellText = row[columnIndex];
      if (cellText !== EMPTY_STRING && !itemToColor[cellText]) {
        if (newItemColors) {
          itemToColor[cellText] = newItemColors.pop() || LabelColorUtils.getLatestPasteleColorAndSetNew();
        } else {
          itemToColor[cellText] = CellDropdownItem.ACTIVE_ITEM_BACKGROUND_COLOR;
        }
      }
      return itemToColor;
    }, itemToColor);
  }

  // prettier-ignore
  public static populateItems(at: ActiveTable, columnIndex: number) {
    const {content, columnsDetails} = at;
    const columnDetails = columnsDetails[columnIndex];
    const {cellDropdown: {labelDetails}, settings: {defaultText, isDefaultTextRemovable}, activeType: {cellDropdownProps}
      } = columnDetails;
    if (!cellDropdownProps) return;
    let itemToColor: ItemToColor = {}
    if (cellDropdownProps.options) {
      itemToColor = CellDropdownItem.changeUserOptionsToItemToColor(cellDropdownProps.options, labelDetails?.newItemColors)
    }
    if (cellDropdownProps.canAddMoreOptions) {
      CellDropdownItem.aggregateItemToColor(content, columnIndex, itemToColor, labelDetails?.newItemColors);
    }
    CellDropdownItem.postProcessItemToColor(isDefaultTextRemovable, itemToColor, defaultText);
    CellDropdownItem.addItems(at, itemToColor, columnDetails);
  }
}
