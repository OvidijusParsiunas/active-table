import {EditableTableComponent} from '../../../editable-table-component';
import {DropdownButtonItemConf} from '../dropdownButtonItemConf';
import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';
import {DropdownItemEvents} from '../dropdownItemEvents';
import {DropdownItem} from '../dropdownItem';

export class ColumnTypeDropdown {
  // this item is used to denote the item used to open up type dropdown
  private static readonly COLUMN_TYPE_ITEM_CLASS = 'dropdown-column-type-item';

  public static setUp(etc: EditableTableComponent, dropdownEl: HTMLElement, columnIndex: number): string | void {
    const {activeType, types} = etc.columnsDetails[columnIndex];
    const itemElement = dropdownEl.getElementsByClassName(ColumnTypeDropdown.COLUMN_TYPE_ITEM_CLASS)[0] as HTMLElement;
    const textElement = itemElement.children[1] as HTMLElement;
    textElement.innerText = activeType.name;
    if (types.length < 2) return (itemElement.style.pointerEvents = 'none');
    itemElement.style.pointerEvents = '';
    setTimeout(() => ColumnTypeDropdownItem.setUp(etc, columnIndex));
  }

  // prettier-ignore
  public static create(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    const buttonElement = DropdownItem.addButtonItem(etc, dropdownElement, DropdownButtonItemConf.DEFAULT_ITEM,
      DropdownItem.DROPDOWN_NESTED_DROPDOWN_ITEM, ColumnTypeDropdown.COLUMN_TYPE_ITEM_CLASS);
    DropdownItemEvents.addNestedItemEvents(buttonElement);
    const nestedDropdown = DropdownItem.createNestedDropdown(); // items added every time column dropdown is opened (setUp)
    buttonElement.appendChild(nestedDropdown);
    etc.activeOverlayElements.columnTypeDropdown = nestedDropdown;
  }
}
