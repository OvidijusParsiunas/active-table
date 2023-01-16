import {NumberOfRowsDropdownItemUtil} from './numberOfRowsDropdownItemUtil';
import {NumberOfRowsDropdownItem} from './numberOfRowsDropdownItem';
import {NumberOfRowsDropdown} from './numberOfRowsDropdown';
import {ActiveTable} from '../../../../activeTable';

export class NumberOfRowsDropdownItemEvents {
  private static itemMouseDown(this: ActiveTable, optionsButton: HTMLElement, event: MouseEvent) {
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

  public static setEvents(at: ActiveTable, item: HTMLElement, optionsButton: HTMLElement) {
    item.onmousedown = NumberOfRowsDropdownItemEvents.itemMouseDown.bind(at, optionsButton);
  }
}
