import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {NumberOfRowsOptionsElement} from './numberOfRowsOptionsElement';
import {NumberOfRowsDropdownItem} from './numberOfRowsDropdownItem';
import {NumberOfRowsDropdown} from './numberOfRowsDropdown';

export class NumberOfRowsDropdownItemEvents {
  private static itemMouseDown(pagination: PaginationInternal, optionsButton: HTMLElement, event: MouseEvent) {
    const dropdown = pagination.numberOfRowsDropdown as HTMLElement;
    const targetItem = event.target as HTMLElement;
    NumberOfRowsOptionsElement.updateButtonText(optionsButton, targetItem.innerText);
    NumberOfRowsDropdown.hide(dropdown);
    const items = Array.from(dropdown.children) as HTMLElement[];
    NumberOfRowsDropdownItem.unsetAllItemStyles(dropdown, items);
    NumberOfRowsDropdownItem.setActive(items, targetItem.innerText);
  }

  public static setEvents(etc: EditableTableComponent, item: HTMLElement, optionsButton: HTMLElement) {
    item.onmousedown = NumberOfRowsDropdownItemEvents.itemMouseDown.bind(this, etc.paginationInternal, optionsButton);
  }
}
