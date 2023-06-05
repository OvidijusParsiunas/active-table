import {OuterDropdownItemEvents} from '../../../../utils/outerTableComponents/dropdown/outerDropdownItemEvents';
import {RowsPerPageDropdownItemUtil} from './rowsPerPageDropdownItemUtil';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {RowsPerPageDropdown} from './rowsPerPageDropdown';
import {ActiveTable} from '../../../../activeTable';

export class RowsPerPageDropdownItemEvents {
  private static action(pagination: PaginationInternal, optionsButton: HTMLElement, at: ActiveTable, targetText: string) {
    if ((pagination as PaginationInternal).rowsPerPage !== Number(targetText)) {
      RowsPerPageDropdownItemUtil.setNewRowsPerPage(at, optionsButton, targetText);
    }
  }

  public static setEvents(at: ActiveTable, item: HTMLElement, optionsButton: HTMLElement) {
    const actionFunc = RowsPerPageDropdownItemEvents.action.bind(this, at.pagination as PaginationInternal, optionsButton);
    const hideFunc = RowsPerPageDropdown.hide;
    item.onmousedown = OuterDropdownItemEvents.itemMouseDownCommon.bind(at, actionFunc, hideFunc);
  }
}
