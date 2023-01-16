import {NestedDropdownItemEvents} from '../nestedDropdown/nestedDropdownItemEvents';
import {EditableTableComponent} from '../../../editable-table-component';
import {NestedDropdownItem} from '../nestedDropdown/nestedDropdownItem';
import {ColumnTypeInternal} from '../../../types/columnTypeInternal';
import {DropdownButtonItemConf} from '../dropdownButtonItemConf';
import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';
import {NestedDropdown} from '../nestedDropdown/nestedDropdown';
import {DropdownItem} from '../dropdownItem';

export class ColumnTypeDropdown {
  // this item is used to denote the item used to open up type dropdown
  private static readonly COLUMN_TYPE_ITEM_CLASS = 'dropdown-column-type-item';

  private static setupParentItemContents(itemElement: HTMLElement, activeType: ColumnTypeInternal) {
    const {name: activeName, dropdownItem: activeDropdownItem} = activeType;
    // setup icon
    const activeIconContainerElement = (activeDropdownItem.element?.children[0] as HTMLElement).cloneNode(true);
    itemElement.replaceChild(activeIconContainerElement as HTMLElement, itemElement.children[0] as HTMLElement);
    // setup text
    const textElement = itemElement.children[1] as HTMLElement;
    textElement.innerText = activeName;
  }

  public static setUp(etc: EditableTableComponent, dropdownEl: HTMLElement, columnIndex: number): string | void {
    const {activeType, types} = etc.columnsDetails[columnIndex];
    const itemElement = dropdownEl.getElementsByClassName(ColumnTypeDropdown.COLUMN_TYPE_ITEM_CLASS)[0] as HTMLElement;
    ColumnTypeDropdown.setupParentItemContents(itemElement, activeType);
    if (types.length < 2) return (itemElement.style.pointerEvents = 'none');
    itemElement.style.pointerEvents = '';
    setTimeout(() => ColumnTypeDropdownItem.setUp(etc, columnIndex));
  }

  // prettier-ignore
  public static create(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    const buttonElement = DropdownItem.addButtonItem(etc, dropdownElement, DropdownButtonItemConf.DEFAULT_ITEM,
      NestedDropdownItem.NESTED_DROPDOWN_ITEM, ColumnTypeDropdown.COLUMN_TYPE_ITEM_CLASS);
    NestedDropdownItemEvents.addEvents(etc, buttonElement);
    const nestedDropdown = NestedDropdown.create(); // items added every time column dropdown is opened (setUp)
    buttonElement.appendChild(nestedDropdown);
    etc.activeOverlayElements.columnTypeDropdown = nestedDropdown;
  }
}
