import {LabelCellTextElement} from '../../cell/cellsWithTextDiv/selectCell/label/labelCellTextElement';
import {ActiveSelectItems, ColumnDetailsT, SelectDropdownT} from '../../../types/columnDetails';
import {ColumnDetailsUtils} from '../../../utils/columnDetails/columnDetailsUtils';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {LabelColorUtils} from '../../../utils/color/labelColorUtils';
import {SelectDropdownItemEvents} from './selectDropdownItemEvents';
import {CellText, TableContent} from '../../../types/tableContent';
import {SelectDeleteButton} from './buttons/selectDeleteButton';
import {SelectColorButton} from './buttons/selectColorButton';
import {LabelOptions} from '../../../types/selectProperties';
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

export class SelectDropdownItem {
  private static readonly SELECT_ACTIVE_ITEM_BACKGROUND_COLOR = '#4a69d4';

  // prettier-ignore
  private static updateCellElementIfNotUpdated(at: ActiveTable,
      newText: string, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    if ((at.content[rowIndex][columnIndex]) !== newText) {
      CellEvents.updateCell(at, newText, rowIndex, columnIndex, {processText: false, element: textElement});
    }
  }

  // prettier-ignore
  public static selectExistingSelectItem(at: ActiveTable,
      activeItemElement: HTMLElement, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const newText = CellElement.getText(activeItemElement.children[0] as HTMLElement);
    SelectDropdownItem.updateCellElementIfNotUpdated(at, newText, rowIndex, columnIndex, textElement);
    if (LabelCellTextElement.isLabelText(textElement)) {
      textElement.style.backgroundColor = at.columnsDetails[columnIndex].selectDropdown.selectItems[newText]?.color;
    }
  }

  // prettier-ignore
  public static addNewSelectItem(at: ActiveTable, textElement: HTMLElement, columnDetails: ColumnDetailsT, color: string) {
    const {selectDropdown: {labelDetails}} = columnDetails;
    const newItemName = CellElement.getText(textElement);
    if (newItemName === EMPTY_STRING) return;
    let newColor = '';
    if (labelDetails?.newItemColors) {
      newColor = color || labelDetails.newItemColors[labelDetails.newItemColors.length - 1]
        || LabelColorUtils.getLatestPasteleColor();
      textElement.style.backgroundColor = newColor;
      labelDetails.newItemColors?.pop() || LabelColorUtils.setNewLatestPasteleColor();
    } else {
      newColor = SelectDropdownItem.SELECT_ACTIVE_ITEM_BACKGROUND_COLOR;
    }
    SelectDropdownItem.addItem(at, newItemName, newColor, columnDetails);
    setTimeout(() => ColumnDetailsUtils.fireUpdateEvent(columnDetails));
  }

  // prettier-ignore
  private static updateCellTextBgColor(itemElement: HTMLElement | undefined, textElement: HTMLElement,
      dropdown: SelectDropdownT, defaultText: CellText) {
    const cellText = CellElement.getText(textElement);
    if (itemElement) {
      textElement.style.backgroundColor = dropdown.selectItems[cellText].color;
    } else if (!dropdown.canAddMoreOptions || cellText === EMPTY_STRING || cellText === defaultText) {
      textElement.style.backgroundColor = '';
    } else {
      const newItemColors = dropdown.labelDetails?.newItemColors; 
      textElement.style.backgroundColor = newItemColors?.[newItemColors.length - 1]
        || LabelColorUtils.getLatestPasteleColor();
    }
  }

  private static updateItemColor(itemElement: HTMLElement | undefined, activeItems: ActiveSelectItems) {
    if (itemElement) {
      activeItems.matchingWithCellText = itemElement;
      itemElement.dispatchEvent(new MouseEvent('mouseenter'));
    }
  }

  private static hideHoveredItemHighlight(activeItems: ActiveSelectItems) {
    const {hovered, matchingWithCellText} = activeItems;
    if (hovered) {
      hovered.style.backgroundColor = '';
    } else {
      activeItems.hovered = matchingWithCellText;
    }
  }

  // prettier-ignore
  public static attemptHighlightMatchingItemWithCell(textElement: HTMLElement, dropdown: SelectDropdownT,
      defaultText: CellText, updateCellText: boolean, matchingCellElement?: HTMLElement) {
    const {activeItems, selectItems} = dropdown;
    const targetText = CellElement.getText(textElement);
    const itemElement = matchingCellElement || selectItems[targetText]?.element;
    if (!itemElement || activeItems.matchingWithCellText !== itemElement) {
      // this is used to preserve the ability for the user to still allow the use of arrow keys to traverse the dropdown
      SelectDropdownItem.hideHoveredItemHighlight(activeItems);
      SelectDropdownItemEvents.blurItem(dropdown, 'matchingWithCellText');
    }
    SelectDropdownItem.updateItemColor(itemElement, activeItems);
    if (updateCellText && dropdown.labelDetails?.newItemColors) {
      SelectDropdownItem.updateCellTextBgColor(itemElement, textElement, dropdown, defaultText);
    }
  }

  // prettier-ignore
  private static setItemOnCell(at: ActiveTable, item: HTMLElement) {
    const {element, rowIndex, columnIndex} = at.focusedElements.cell as CellDetails;
    const {selectDropdown, settings: {defaultText}} = at.columnsDetails[columnIndex];
    const textElement = element.children[0] as HTMLElement;
    const itemText = CellElement.getText(item.children[0] as HTMLElement);
    SelectDropdownItem.updateCellElementIfNotUpdated(at, itemText, rowIndex, columnIndex, textElement);
    SelectDropdownItem.attemptHighlightMatchingItemWithCell(textElement, selectDropdown, defaultText, true, item);
    CaretPosition.setToEndOfText(at, textElement);
  }

  // prettier-ignore
  public static setSiblingItemOnCell(at: ActiveTable,
      activeItems: ActiveSelectItems, sibling: 'previousSibling' | 'nextSibling') {
    const {hovered, matchingWithCellText} = activeItems;
    const currentlyHighlightedItem = hovered || matchingWithCellText as HTMLElement;
    const siblingItem = currentlyHighlightedItem?.[sibling] as HTMLElement;
    if (siblingItem) {
      SelectDropdownItem.setItemOnCell(at, siblingItem);
    } else {
      const {columnIndex} = at.focusedElements.cell as CellDetails;
      const dropdownElement = at.columnsDetails[columnIndex].selectDropdown.element as HTMLElement;
      if (sibling === 'nextSibling') {
        const firstItem = dropdownElement.children[0] as HTMLElement;
        if (firstItem) SelectDropdownItem.setItemOnCell(at, firstItem);
      } else {
        const lastItem = dropdownElement.children[dropdownElement.children.length - 1] as HTMLElement;
        if (lastItem) SelectDropdownItem.setItemOnCell(at, lastItem);
      }
    }
  }

  private static addItemElement(at: ActiveTable, text: string, columnDetails: ColumnDetailsT, atStart = false) {
    const {selectDropdown} = columnDetails;
    const itemElement = DropdownItem.addPlaneButtonItem(selectDropdown.element, text, atStart ? 0 : undefined);
    if (selectDropdown.customItemStyle) itemElement.style.color = selectDropdown.customItemStyle.textColor;
    if (selectDropdown.canAddMoreOptions) {
      const deleteButtonElement = SelectDeleteButton.create(at, columnDetails);
      itemElement.appendChild(deleteButtonElement);
      if (Browser.IS_COLOR_PICKER_SUPPORTED && selectDropdown.labelDetails?.newItemColors) {
        const colorInputElement = SelectColorButton.create(columnDetails);
        itemElement.appendChild(colorInputElement);
      }
    }
    SelectDropdownItemEvents.set(at.shadowRoot as unknown as Document, itemElement, selectDropdown);
    return itemElement;
  }

  private static addItem(at: ActiveTable, itemName: string, color: string, columnDetails: ColumnDetailsT) {
    columnDetails.selectDropdown.selectItems[itemName] = {
      color,
      element: SelectDropdownItem.addItemElement(at, itemName, columnDetails),
    };
  }

  private static addItems(at: ActiveTable, itemToColor: ItemToColor, columnDetails: ColumnDetailsT) {
    columnDetails.selectDropdown.element.replaceChildren();
    columnDetails.selectDropdown.selectItems = {};
    Object.keys(itemToColor).forEach((itemName) => {
      SelectDropdownItem.addItem(at, itemName, itemToColor[itemName], columnDetails);
    });
  }

  private static postProcessItemToColor(isDefaultTextRemovable: boolean, itemToColor: ItemToColor, defaultText: CellText) {
    if (isDefaultTextRemovable) delete itemToColor[defaultText];
  }

  private static changeUserOptionsToItemToColor(userOptions: LabelOptions, newItemColors?: string[]): ItemToColor {
    return userOptions.reduce<ItemToColor>((itemToColor, option) => {
      if (newItemColors) {
        itemToColor[option.name] =
          option.backgroundColor || newItemColors.pop() || LabelColorUtils.getLatestPasteleColorAndSetNew();
      } else {
        itemToColor[option.name] = SelectDropdownItem.SELECT_ACTIVE_ITEM_BACKGROUND_COLOR;
      }
      return itemToColor;
    }, {});
  }

  // prettier-ignore
  private static aggregateItemToColor(content: TableContent, columnIndex: number, itemToColor: ItemToColor,
      newItemColors?: string[]) {
    return content.slice(1).reduce<ItemToColor>((itemToColor, row) => {
      const cellText = row[columnIndex];
      if (cellText !== EMPTY_STRING && !itemToColor[cellText]) {
        if (newItemColors) {
          itemToColor[cellText] = newItemColors.pop() || LabelColorUtils.getLatestPasteleColorAndSetNew();
        } else {
          itemToColor[cellText] = SelectDropdownItem.SELECT_ACTIVE_ITEM_BACKGROUND_COLOR;
        }
      }
      return itemToColor;
    }, itemToColor);
  }

  // prettier-ignore
  public static populateItems(at: ActiveTable, columnIndex: number) {
    const {content, columnsDetails} = at;
    const columnDetails = columnsDetails[columnIndex];
    const {selectDropdown: {labelDetails}, settings: {defaultText, isDefaultTextRemovable}, activeType: {selectProps}
      } = columnDetails;
    if (!selectProps) return;
    let itemToColor: ItemToColor = {}
    if (selectProps.options) {
      itemToColor = SelectDropdownItem.changeUserOptionsToItemToColor(selectProps.options, labelDetails?.newItemColors)
    }
    if (selectProps.canAddMoreOptions) {
      SelectDropdownItem.aggregateItemToColor(content, columnIndex, itemToColor, labelDetails?.newItemColors);
    }
    SelectDropdownItem.postProcessItemToColor(isDefaultTextRemovable, itemToColor, defaultText);
    SelectDropdownItem.addItems(at, itemToColor, columnDetails);
  }
}
