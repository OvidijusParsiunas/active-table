import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';
import {DropdownItemEvents} from '../dropdownItemEvents';
import {DropdownItem} from '../dropdownItem';

export class ColumnTypeDropdown {
  // this item is used to denote the item used to open up type dropdown
  private static readonly COLUMN_TYPE_ITEM_CLASS = 'dropdown-column-type-item';

  public static getColumnTypeItemText(dropdownElement: HTMLElement): HTMLElement {
    const buttonElement = dropdownElement.getElementsByClassName(ColumnTypeDropdown.COLUMN_TYPE_ITEM_CLASS)[0];
    return buttonElement.children[0] as HTMLElement;
  }

  public static setUp(etc: EditableTableComponent, dropdownElement: HTMLElement, columnIndex: number) {
    const {activeType, types} = etc.columnsDetails[columnIndex];
    const textElement = ColumnTypeDropdown.getColumnTypeItemText(dropdownElement);
    textElement.innerText = activeType.name;
    setTimeout(() => {
      const {columnTypeDropdown} = etc.activeOverlayElements;
      const itemNames = types.map((type) => type.name);
      ColumnTypeDropdownItem.setUp(etc, columnTypeDropdown as HTMLElement, columnIndex, itemNames);
    });
  }

  // prettier-ignore
  public static createColumnDropdown(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    const buttonElement = DropdownItem.addButtonItem(
      etc, dropdownElement, '', DropdownItem.DROPDOWN_NESTED_DROPDOWN_ITEM, ColumnTypeDropdown.COLUMN_TYPE_ITEM_CLASS);
    DropdownItemEvents.addNestedItemEvents(buttonElement);
    const nestedDropdown = DropdownItem.createNestedDropdown(etc, []); // items readded during every setUp execution
    buttonElement.appendChild(nestedDropdown);
    etc.activeOverlayElements.columnTypeDropdown = nestedDropdown;
  }
}
