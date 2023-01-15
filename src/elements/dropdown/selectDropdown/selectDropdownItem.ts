import {LabelCellTextElement} from '../../cell/cellsWithTextDiv/selectCell/label/labelCellTextElement';
import {ActiveSelectItems, ColumnDetailsT, SelectDropdownT} from '../../../types/columnDetails';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellText, TableContents} from '../../../types/tableContents';
import {LabelColorUtils} from '../../../utils/color/labelColorUtils';
import {SelectDropdownItemEvents} from './selectDropdownItemEvents';
import {SelectDeleteButton} from './buttons/selectDeleteButton';
import {SelectColorButton} from './buttons/selectColorButton';
import {LabelOptions} from '../../../types/selectProperties';
import {CellDetails} from '../../../types/focusedCell';
import {Browser} from '../../../utils/browser/browser';
import {CellElement} from '../../cell/cellElement';
import {EMPTY_STRING} from '../../../consts/text';
import {CellEvents} from '../../cell/cellEvents';
import {DropdownItem} from '../dropdownItem';

interface ItemToColor {
  [cellText: CellText]: string;
}

export class SelectDropdownItem {
  private static readonly SELECT_ACTIVE_ITEM_BACKGROUND_COLOR = '#4a69d4';

  // prettier-ignore
  private static updateCellElementIfNotUpdated(etc: EditableTableComponent,
      newText: string, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    if ((etc.contents[rowIndex][columnIndex]) !== newText) {
      CellEvents.updateCell(etc, newText, rowIndex, columnIndex, {processText: false, element: textElement});
    }
  }

  // prettier-ignore
  public static selectExistingSelectItem(etc: EditableTableComponent,
      activeItemElement: HTMLElement, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const newText = CellElement.getText(activeItemElement.children[0] as HTMLElement);
    SelectDropdownItem.updateCellElementIfNotUpdated(etc, newText, rowIndex, columnIndex, textElement);
    if (LabelCellTextElement.isLabelText(textElement)) {
      textElement.style.backgroundColor = etc.columnsDetails[columnIndex].selectDropdown.selectItems[newText]?.color;
    }
  }

  // prettier-ignore
  public static addNewSelectItem(etc: EditableTableComponent, textElement: HTMLElement, columnDetails: ColumnDetailsT,
      color: string) {
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
    SelectDropdownItem.addItem(etc, newItemName, newColor, columnDetails);
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
  private static setItemOnCell(etc: EditableTableComponent, item: HTMLElement) {
    const {element, rowIndex, columnIndex} = etc.focusedElements.cell as CellDetails;
    const {selectDropdown, settings: {defaultText}} = etc.columnsDetails[columnIndex];
    const textElement = element.children[0] as HTMLElement;
    const itemText = CellElement.getText(item.children[0] as HTMLElement);
    SelectDropdownItem.updateCellElementIfNotUpdated(etc, itemText, rowIndex, columnIndex, textElement);
    SelectDropdownItem.attemptHighlightMatchingItemWithCell(textElement, selectDropdown, defaultText, true, item);
    CaretPosition.setToEndOfText(etc, textElement);
  }

  // prettier-ignore
  public static setSiblingItemOnCell(etc: EditableTableComponent,
      activeItems: ActiveSelectItems, sibling: 'previousSibling' | 'nextSibling') {
    const {hovered, matchingWithCellText} = activeItems;
    const currentlyHighlightedItem = hovered || matchingWithCellText as HTMLElement;
    const siblingItem = currentlyHighlightedItem?.[sibling] as HTMLElement;
    if (siblingItem) {
      SelectDropdownItem.setItemOnCell(etc, siblingItem);
    } else {
      const {columnIndex} = etc.focusedElements.cell as CellDetails;
      const dropdownElement = etc.columnsDetails[columnIndex].selectDropdown.element as HTMLElement;
      if (sibling === 'nextSibling') {
        const firstItem = dropdownElement.children[0] as HTMLElement;
        if (firstItem) SelectDropdownItem.setItemOnCell(etc, firstItem);
      } else {
        const lastItem = dropdownElement.children[dropdownElement.children.length - 1] as HTMLElement;
        if (lastItem) SelectDropdownItem.setItemOnCell(etc, lastItem);
      }
    }
  }

  private static addItemElement(etc: EditableTableComponent, text: string, columnDetail: ColumnDetailsT, atStart = false) {
    const {selectDropdown} = columnDetail;
    const itemElement = DropdownItem.addPlaneButtonItem(selectDropdown.element, text, atStart ? 0 : undefined);
    if (selectDropdown.customItemStyle) itemElement.style.color = selectDropdown.customItemStyle.textColor;
    if (selectDropdown.canAddMoreOptions) {
      const deleteButtonElement = SelectDeleteButton.create(etc, selectDropdown);
      itemElement.appendChild(deleteButtonElement);
      if (Browser.IS_COLOR_PICKER_SUPPORTED && selectDropdown.labelDetails?.newItemColors) {
        const colorInputElement = SelectColorButton.create(columnDetail);
        itemElement.appendChild(colorInputElement);
      }
    }
    SelectDropdownItemEvents.set(etc.shadowRoot as unknown as Document, itemElement, selectDropdown);
    return itemElement;
  }

  private static addItem(etc: EditableTableComponent, itemName: string, color: string, columnDetails: ColumnDetailsT) {
    columnDetails.selectDropdown.selectItems[itemName] = {
      color,
      element: SelectDropdownItem.addItemElement(etc, itemName, columnDetails),
    };
  }

  private static addItems(etc: EditableTableComponent, itemToColor: ItemToColor, columnDetails: ColumnDetailsT) {
    columnDetails.selectDropdown.element.replaceChildren();
    columnDetails.selectDropdown.selectItems = {};
    Object.keys(itemToColor).forEach((itemName) => {
      SelectDropdownItem.addItem(etc, itemName, itemToColor[itemName], columnDetails);
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
  private static aggregateItemToColor(contents: TableContents, columnIndex: number, itemToColor: ItemToColor,
      newItemColors?: string[]) {
    return contents.slice(1).reduce<ItemToColor>((itemToColor, row) => {
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
  public static populateItems(etc: EditableTableComponent, columnIndex: number) {
    const {contents, columnsDetails} = etc;
    const columnDetails = columnsDetails[columnIndex];
    const {selectDropdown: {labelDetails}, settings: {defaultText, isDefaultTextRemovable}, activeType: {selectProps}
      } = columnDetails;
    if (!selectProps) return;
    let itemToColor: ItemToColor = {}
    if (selectProps.options) {
      itemToColor = SelectDropdownItem.changeUserOptionsToItemToColor(selectProps.options, labelDetails?.newItemColors)
    }
    if (selectProps.canAddMoreOptions) {
      SelectDropdownItem.aggregateItemToColor(contents, columnIndex, itemToColor, labelDetails?.newItemColors);
    }
    SelectDropdownItem.postProcessItemToColor(isDefaultTextRemovable, itemToColor, defaultText);
    SelectDropdownItem.addItems(etc, itemToColor, columnDetails);
  }
}
