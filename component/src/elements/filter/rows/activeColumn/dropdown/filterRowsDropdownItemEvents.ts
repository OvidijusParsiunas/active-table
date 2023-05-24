import {OuterDropdownItemEvents} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownItemEvents';
import {FilterRowsInputEvents} from '../../input/filterRowsInputEvents';
import {FilterRowsInternal} from '../../../../../types/filterInternal';
import {FilterRowsDropdownElement} from './filterRowsDropdownElement';
import {ActiveTable} from '../../../../../activeTable';

export class FilterRowsDropdownItemEvents {
  private static resetEvents(rows: FilterRowsInternal, at: ActiveTable, targetText: string) {
    if (rows.activeColumnName !== targetText) {
      rows.activeColumnName = targetText;
      FilterRowsInputEvents.setEvents(at);
    }
  }

  public static setEvents(at: ActiveTable, item: HTMLElement) {
    const rows = at._filterInternal.rows as FilterRowsInternal;
    const actionFunc = FilterRowsDropdownItemEvents.resetEvents.bind(this, rows);
    const hideFunc = FilterRowsDropdownElement.hide;
    item.onmousedown = OuterDropdownItemEvents.itemMouseDownCommon.bind(at, actionFunc, hideFunc);
  }
}
