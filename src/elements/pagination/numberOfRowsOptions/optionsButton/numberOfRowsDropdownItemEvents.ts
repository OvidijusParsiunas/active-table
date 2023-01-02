import {NumberOfRowsOptionsButtonElement} from './numberOfRowsOptionsButtonElement';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {NumberOfRowsDropdownItem} from './numberOfRowsDropdownItem';
import {NumberOfRowsDropdown} from './numberOfRowsDropdown';

export class NumberOfRowsDropdownItemEvents {
  private static itemMouseDown(pagination: PaginationInternal, optionsButton: HTMLElement, event: MouseEvent) {
    const dropdown = pagination.numberOfRowsDropdown as HTMLElement;
    const newNumberOfRows = (event.target as HTMLElement).innerText;
    if (pagination.numberOfRows !== Number(newNumberOfRows)) {
      NumberOfRowsOptionsButtonElement.updateButtonText(optionsButton, newNumberOfRows);
    }
    NumberOfRowsDropdown.hide(dropdown);
    const items = Array.from(dropdown.children) as HTMLElement[];
    NumberOfRowsDropdownItem.unsetAllItemStyles(dropdown, items);
    NumberOfRowsDropdownItem.setActive(items, newNumberOfRows);
  }

  public static setEvents(etc: EditableTableComponent, item: HTMLElement, optionsButton: HTMLElement) {
    item.onmousedown = NumberOfRowsDropdownItemEvents.itemMouseDown.bind(this, etc.paginationInternal, optionsButton);
  }
}
