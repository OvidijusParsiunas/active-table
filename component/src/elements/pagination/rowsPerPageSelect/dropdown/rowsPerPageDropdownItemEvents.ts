import {RowsPerPageDropdownItemUtil} from './rowsPerPageDropdownItemUtil';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {RowsPerPageDropdownItem} from './rowsPerPageDropdownItem';
import {RowsPerPageDropdown} from './rowsPerPageDropdown';
import {ActiveTable} from '../../../../activeTable';

export class RowsPerPageDropdownItemEvents {
  // prettier-ignore
  private static itemMouseDown(this: ActiveTable, optionsButton: HTMLElement, event: MouseEvent) {
    const {pagination, _activeOverlayElements: {outerContainerDropdown}} = this;
    const newRowsPerPage = (event.target as HTMLElement).innerText;
    if (((pagination as PaginationInternal).rowsPerPage) !== Number(newRowsPerPage)) {
      RowsPerPageDropdownItemUtil.setNewRowsPerPage(this, optionsButton, newRowsPerPage);
    }
    if (!outerContainerDropdown) return;
    const items = Array.from(outerContainerDropdown.element.children) as HTMLElement[];
    RowsPerPageDropdown.hide(this._activeOverlayElements, items);
    RowsPerPageDropdownItem.unsetActiveItem(outerContainerDropdown.element);
    RowsPerPageDropdownItem.setActive(items, newRowsPerPage);
  }

  public static setEvents(at: ActiveTable, item: HTMLElement, optionsButton: HTMLElement) {
    item.onmousedown = RowsPerPageDropdownItemEvents.itemMouseDown.bind(at, optionsButton);
  }
}
