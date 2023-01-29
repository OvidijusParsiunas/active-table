import {RowsPerPageDropdownItemUtil} from './rowsPerPageDropdownItemUtil';
import {RowsPerPageDropdownItem} from './rowsPerPageDropdownItem';
import {RowsPerPageDropdown} from './rowsPerPageDropdown';
import {ActiveTable} from '../../../../activeTable';

export class RowsPerPageDropdownItemEvents {
  private static itemMouseDown(this: ActiveTable, optionsButton: HTMLElement, event: MouseEvent) {
    const {rowsPerPageDropdown, rowsPerPage} = this.paginationInternal;
    const dropdown = rowsPerPageDropdown as HTMLElement;
    const newRowsPerPage = (event.target as HTMLElement).innerText;
    if (rowsPerPage !== Number(newRowsPerPage)) {
      RowsPerPageDropdownItemUtil.setNewRowsPerPage(this, optionsButton, newRowsPerPage);
    }
    const items = Array.from(dropdown.children) as HTMLElement[];
    RowsPerPageDropdown.hide(dropdown, items);
    RowsPerPageDropdownItem.unsetActiveItem(dropdown);
    RowsPerPageDropdownItem.setActive(items, newRowsPerPage);
  }

  public static setEvents(at: ActiveTable, item: HTMLElement, optionsButton: HTMLElement) {
    item.onmousedown = RowsPerPageDropdownItemEvents.itemMouseDown.bind(at, optionsButton);
  }
}
