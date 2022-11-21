import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnDropdownItemEvents} from './columnDropdownItemEvents';
import {ColumnTypeDropdown} from './columnTypeDropdown';
import {DropdownItem} from '../dropdownItem';

export class ColumnDropdownItem {
  public static readonly SORT_ITEM_CLASS = 'dropdown-sort-item';

  // this is used as an ancher to identify the location of below buttons
  public static addSortButton(sRoot: ShadowRoot | null, dropdownElement: HTMLElement, text: string) {
    DropdownItem.addButtonItem(sRoot, dropdownElement, text, ColumnDropdownItem.SORT_ITEM_CLASS);
  }

  // prettier-ignore
  private static setUpInputElement(etc: EditableTableComponent,
      columnIndex: number, cellElement: HTMLElement, dropdownInutElement: HTMLInputElement, dropdownElement: HTMLElement) {
    dropdownInutElement.value = etc.contents[0][columnIndex] as string;
    ColumnDropdownItemEvents.setInputItemEvent(etc, columnIndex, cellElement, dropdownInutElement, dropdownElement);
  }

  // prettier-ignore
  public static setUp(etc: EditableTableComponent,
      dropdownElement: HTMLElement, columnIndex: number, cellElement: HTMLElement) {
    ColumnTypeDropdown.setUp(etc, dropdownElement, columnIndex);
    const dropdownInputElement = dropdownElement.getElementsByClassName(
      DropdownItem.DROPDOWN_INPUT_CLASS)[0] as HTMLInputElement;
    if (dropdownInputElement) {
      ColumnDropdownItem.setUpInputElement(etc, columnIndex, cellElement, dropdownInputElement, dropdownElement);
    }
  }
}
