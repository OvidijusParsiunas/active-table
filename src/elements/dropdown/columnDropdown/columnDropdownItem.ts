import {DisplayedCellTypeName} from '../../../utils/cellType/displayedCellTypeName';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnDropdownItemEvents} from './columnDropdownItemEvents';
import {USER_SET_COLUMN_TYPE} from '../../../enums/columnType';
import {ColumnDetailsT} from '../../../types/columnDetails';
import {DropdownItem} from '../dropdownItem';

export class ColumnDropdownItem {
  public static readonly SORT_ITEM_CLASS = 'dropdown-sort-item';
  private static readonly COLUMN_TYPE_ITEM_CLASS = 'dropdown-column-type-item';
  private static readonly ACTIVE_ITEM_CLASS = 'active-dropdown-item';

  // prettier-ignore
  public static addColumnTypeNestedDropdownItem(sRoot: ShadowRoot | null, dropdownElement: HTMLElement) {
    const itemsText = Object.keys(USER_SET_COLUMN_TYPE).map((key) => DisplayedCellTypeName.get(key));
    return DropdownItem.addNestedDropdownItem(
      sRoot, dropdownElement, '', itemsText, ColumnDropdownItem.COLUMN_TYPE_ITEM_CLASS);
  }

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

  public static unsetActiveUserChosenColumnType(dropdownElement: HTMLElement) {
    const activeElements = dropdownElement.getElementsByClassName(ColumnDropdownItem.ACTIVE_ITEM_CLASS);
    if (activeElements[0]) activeElements[0].classList.remove(ColumnDropdownItem.ACTIVE_ITEM_CLASS);
  }

  private static setActiveNestedDropdownItem(nestedDropdownChildren: HTMLElement[], targetItemText: string) {
    nestedDropdownChildren.forEach((item) => {
      if (item.textContent === targetItemText) {
        // WORK - perhaps instead of highlighting - use a tick mark
        // WORK - this does not work for things like dates
        item.classList.add(ColumnDropdownItem.ACTIVE_ITEM_CLASS);
      }
    });
  }

  private static setActiveUserChosenColumnType(nestedDropdownChildren: HTMLElement[], columnDetails: ColumnDetailsT) {
    const userChosenColumnTypeString = USER_SET_COLUMN_TYPE[columnDetails.userSetColumnType];
    ColumnDropdownItem.setActiveNestedDropdownItem(nestedDropdownChildren, userChosenColumnTypeString);
  }

  private static setUpColumnTypeDropdown(etc: EditableTableComponent, dropdownElement: HTMLElement, columnIndex: number) {
    const nestedDropdownChilrenArr = Array.from(dropdownElement.children) as HTMLElement[];
    ColumnDropdownItemEvents.setColumnTypeDropdownItemEvents(etc, nestedDropdownChilrenArr, columnIndex);
    setTimeout(() => {
      ColumnDropdownItem.setActiveUserChosenColumnType(nestedDropdownChilrenArr, etc.columnsDetails[columnIndex]);
    });
  }

  private static setUpColumnType(etc: EditableTableComponent, dropdownElement: HTMLElement, columnIndex: number) {
    const columnTypeItem = dropdownElement.getElementsByClassName(ColumnDropdownItem.COLUMN_TYPE_ITEM_CLASS)[0];
    const textElement = columnTypeItem.children[0];
    textElement.textContent = DisplayedCellTypeName.get(etc.columnsDetails[columnIndex].activeColumnType);
    ColumnDropdownItem.setUpColumnTypeDropdown(etc, textElement.nextSibling as HTMLElement, columnIndex);
  }

  // prettier-ignore
  public static setUpContent(etc: EditableTableComponent,
      dropdownElement: HTMLElement, columnIndex: number, cellElement: HTMLElement) {
    ColumnDropdownItem.setUpColumnType(etc, dropdownElement, columnIndex);
    const dropdownInputElement = dropdownElement.getElementsByClassName(
      DropdownItem.DROPDOWN_INPUT_CLASS)[0] as HTMLInputElement;
    if (dropdownInputElement) {
      ColumnDropdownItem.setUpInputElement(etc, columnIndex, cellElement, dropdownInputElement, dropdownElement);
    }
  }
}
