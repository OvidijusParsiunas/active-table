import {EditableTableComponent} from '../../../../editable-table-component';
import {NumberOfRowsDropdownItemUtil} from './numberOfRowsDropdownItemUtil';
import {NumberOfRowsDropdownItem} from './numberOfRowsDropdownItem';
import {NumberOfRowsDropdown} from './numberOfRowsDropdown';

export class NumberOfRowsDropdownItemEvents {
  private static itemMouseDown(this: EditableTableComponent, optionsButton: HTMLElement, event: MouseEvent) {
    const {numberOfRowsDropdown, numberOfRows} = this.paginationInternal;
    const dropdown = numberOfRowsDropdown as HTMLElement;
    const newNumberOfRows = (event.target as HTMLElement).innerText;
    if (numberOfRows !== Number(newNumberOfRows)) {
      NumberOfRowsDropdownItemUtil.setNewNumberOfRows(this, optionsButton, newNumberOfRows);
    }
    const items = Array.from(dropdown.children) as HTMLElement[];
    NumberOfRowsDropdown.hide(dropdown, items);
    NumberOfRowsDropdownItem.unsetActiveItem(dropdown);
    NumberOfRowsDropdownItem.setActive(items, newNumberOfRows);
  }

  public static setEvents(etc: EditableTableComponent, item: HTMLElement, optionsButton: HTMLElement) {
    item.onmousedown = NumberOfRowsDropdownItemEvents.itemMouseDown.bind(etc, optionsButton);
  }
}
