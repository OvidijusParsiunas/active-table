import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnSettingsInternal} from '../../../types/columnsSettings';
import {ColumnDropdownItemEvents} from './columnDropdownItemEvents';
import {ObjectUtils} from '../../../utils/object/objectUtils';
import {ColumnTypeDropdown} from './columnTypeDropdown';
import {DropdownItem} from '../dropdownItem';

export class ColumnDropdownItem {
  public static readonly SORT_ITEM_CLASS = 'dropdown-sort-item';

  public static resetItems(dropdownElement: HTMLElement) {
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    items.forEach((item) => DropdownItem.toggleItem(item, true));
  }

  // this is used as an ancher to identify the location of below buttons
  public static addSortButton(etc: EditableTableComponent, dropdownElement: HTMLElement, text: string) {
    DropdownItem.addButtonItem(etc, dropdownElement, text, ColumnDropdownItem.SORT_ITEM_CLASS);
  }

  private static setUpItems(settings: ColumnSettingsInternal, items: HTMLElement[]) {
    const {isSortAvailable, isDeleteAvailable, isInsertLeftAvailable, isInsertRightAvailable, isMoveAvailable} = settings;
    if (!isSortAvailable) {
      DropdownItem.toggleItem(items[3], false);
      DropdownItem.toggleItem(items[4], false);
    }
    if (!isInsertRightAvailable) DropdownItem.toggleItem(items[5], false);
    if (!isInsertLeftAvailable) DropdownItem.toggleItem(items[6], false);
    if (!isMoveAvailable) {
      DropdownItem.toggleItem(items[7], false);
      DropdownItem.toggleItem(items[8], false);
    }
    if (!isDeleteAvailable) DropdownItem.toggleItem(items[9], false);
  }

  // prettier-ignore
  private static setUpInputElement(etc: EditableTableComponent,
      columnIndex: number, cellElement: HTMLElement, inputItem: HTMLElement, dropdownElement: HTMLElement) {
    const {isCellTextEditable, isHeaderTextEditable} = etc.columnsDetails[columnIndex].settings;
    const display = ObjectUtils.areValuesFullyDefined(isHeaderTextEditable) ? isHeaderTextEditable : isCellTextEditable;
    if (!display) {
      DropdownItem.toggleItem(inputItem, false);
    } else {
      const inputElement = inputItem.children[0] as HTMLInputElement;
      inputElement.value = etc.contents[0][columnIndex] as string;
      ColumnDropdownItemEvents.setInputItemEvent(etc, columnIndex, cellElement, inputElement, dropdownElement);
    }
  }

  // prettier-ignore
  public static setUp(etc: EditableTableComponent,
      dropdownElement: HTMLElement, columnIndex: number, cellElement: HTMLElement) {
    ColumnTypeDropdown.setUp(etc, dropdownElement, columnIndex);
    const items = Array.from(dropdownElement.children) as HTMLElement[];
    ColumnDropdownItem.setUpInputElement(etc, columnIndex, cellElement, items[0], dropdownElement);
    ColumnDropdownItem.setUpItems(etc.columnsDetails[columnIndex].settings, items);
  }
}
