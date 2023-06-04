import {FilterRowsInternalUtils} from '../outerTableComponents/filter/rows/filterRowsInternalUtils';
import {FilterInternalUtils} from '../outerTableComponents/filter/filterInternalUtils';
import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {ActiveTable} from '../../activeTable';

interface Event {
  colMove?: boolean;
  colRemove?: boolean;
}

export class HeaderText {
  public static onAttemptChange(at: ActiveTable, cellElement: HTMLElement, columnIndex: number, event?: Event) {
    if (!event?.colRemove) {
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(at, cellElement, columnIndex, event?.colMove);
    }
    if (at._filterInternal.rows) {
      if (FilterRowsInternalUtils.wasHeaderChanged(at._columnsDetails, at._filterInternal.rows, columnIndex)) {
        FilterInternalUtils.headerChanged(at);
      }
    }
  }
}
