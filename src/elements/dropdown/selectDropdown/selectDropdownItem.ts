import {LabelCellTextElement} from '../../cell/cellsWithTextDiv/selectCell/label/labelCellTextElement';
import {ActiveSelectItems, SelectDropdownT} from '../../../types/columnDetails';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellText, TableContents} from '../../../types/tableContents';
import {SelectDropdownItemEvents} from './selectDropdownItemEvents';
import {SelectDeleteButton} from './buttons/selectDeleteButton';
import {SelectColorButton} from './buttons/selectColorButton';
import {LabelOptions} from '../../../types/selectProperties';
import {CellDetails} from '../../../types/focusedCell';
import {CellElement} from '../../cell/cellElement';
import {EMPTY_STRING} from '../../../consts/text';
import {CellEvents} from '../../cell/cellEvents';
import {Color} from '../../../utils/color/color';
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
      textElement.style.backgroundColor = etc.columnsDetails[columnIndex].selectDropdown.selectItem[newText]?.color;
    }
  }

  // prettier-ignore
  public static addNewSelectItem(etc: EditableTableComponent, textElement: HTMLElement, dropdown: SelectDropdownT,
      color: string) {
    const newItemName = CellElement.getText(textElement);
    if (newItemName === EMPTY_STRING) return;
    let newColor = '';
    if (dropdown.newItemColors) {
      newColor = color || dropdown.newItemColors[dropdown.newItemColors.length - 1] || Color.getLatestPasteleColor();
      textElement.style.backgroundColor = newColor;
      dropdown.newItemColors?.pop() || Color.setNewLatestPasteleColor();
    } else {
      newColor = SelectDropdownItem.SELECT_ACTIVE_ITEM_BACKGROUND_COLOR;
    }
    SelectDropdownItem.addItem(etc, newItemName, newColor, dropdown);
  }

  // prettier-ignore
  private static updateCellTextBgColor(itemElement: HTMLElement | undefined, textElement: HTMLElement,
      dropdown: SelectDropdownT, defaultText: CellText) {
    const cellText = CellElement.getText(textElement);
    if (itemElement) {
      textElement.style.backgroundColor = dropdown.selectItem[cellText].color;
    } else if (!dropdown.canAddMoreOptions || cellText === EMPTY_STRING || cellText === defaultText) {
      textElement.style.backgroundColor = '';
    } else {
      textElement.style.backgroundColor = dropdown.newItemColors?.[dropdown.newItemColors.length - 1]
        || Color.getLatestPasteleColor();
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
    const {activeItems, selectItem} = dropdown;
    const targetText = CellElement.getText(textElement);
    const itemElement = matchingCellElement || selectItem[targetText]?.element;
    if (!itemElement || activeItems.matchingWithCellText !== itemElement) {
      // this is used to preserve the ability for the user to still allow the use of arrow keys to traverse the dropdown
      SelectDropdownItem.hideHoveredItemHighlight(activeItems);
      SelectDropdownItemEvents.blurItem(dropdown, 'matchingWithCellText');
    }
    SelectDropdownItem.updateItemColor(itemElement, activeItems);
    if (updateCellText && dropdown.newItemColors) {
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

  // prettier-ignore
  private static addItemElement(etc: EditableTableComponent,
      text: string, color: string, dropdown: SelectDropdownT, atStart = false) {
    const itemElement = DropdownItem.addPlaneButtonItem(dropdown.element, text, atStart ? 0 : undefined);
    if (dropdown.customItemStyle) itemElement.style.color = dropdown.customItemStyle.textColor;
    if (dropdown.canAddMoreOptions) {
      const colorInputElement = SelectColorButton.create(etc, dropdown);
      itemElement.appendChild(colorInputElement);
      const deleteButtonElement = SelectDeleteButton.create(etc, dropdown);
      itemElement.appendChild(deleteButtonElement);
    }
    SelectDropdownItemEvents.set(etc.shadowRoot as unknown as Document, itemElement, color, dropdown);
    return itemElement;
  }

  private static addItem(etc: EditableTableComponent, itemName: string, color: string, dropdown: SelectDropdownT) {
    dropdown.selectItem[itemName] = {
      color,
      element: SelectDropdownItem.addItemElement(etc, itemName, color, dropdown),
    };
  }

  private static addItems(etc: EditableTableComponent, itemToColor: ItemToColor, dropdown: SelectDropdownT) {
    dropdown.element.replaceChildren();
    dropdown.selectItem = {};
    Object.keys(itemToColor).forEach((itemName) => {
      SelectDropdownItem.addItem(etc, itemName, itemToColor[itemName], dropdown);
    });
  }

  private static postProcessItemToColor(isDefaultTextRemovable: boolean, itemToColor: ItemToColor, defaultText: CellText) {
    if (isDefaultTextRemovable) delete itemToColor[defaultText];
  }

  private static changeUserOptionsToItemToColor(userOptions: LabelOptions, newItemColors?: string[]): ItemToColor {
    return userOptions.reduce<ItemToColor>((itemToColor, option) => {
      if (newItemColors) {
        itemToColor[option.name] = option.backgroundColor || newItemColors.pop() || Color.getLatestPasteleColorAndSetNew();
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
          itemToColor[cellText] = newItemColors.pop() || Color.getLatestPasteleColorAndSetNew();
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
    const {selectDropdown, settings: {defaultText, isDefaultTextRemovable}, activeType} = columnsDetails[columnIndex];
    if (!activeType.selectProps) return;
    const {newItemColors} = selectDropdown;
    let itemToColor: ItemToColor = {}
    if (activeType.selectProps.options) {
      itemToColor = SelectDropdownItem.changeUserOptionsToItemToColor(activeType.selectProps.options, newItemColors)
    }
    if (activeType.selectProps.canAddMoreOptions) {
      SelectDropdownItem.aggregateItemToColor(contents, columnIndex, itemToColor, newItemColors);
    }
    SelectDropdownItem.postProcessItemToColor(isDefaultTextRemovable, itemToColor, defaultText);
    SelectDropdownItem.addItems(etc, itemToColor, selectDropdown);
  }
}
