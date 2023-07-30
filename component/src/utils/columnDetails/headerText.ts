import {FilterInternalUtils} from '../outerTableComponents/filter/rows/filterInternalUtils';
import {VisibilityUtils} from '../outerTableComponents/filter/filterInternalUtils';
import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {ActiveTable} from '../../activeTable';

interface Event {
  colMove?: boolean;
  colRemove?: boolean;
}

export class HeaderText {
  public static onAttemptChange(at: ActiveTable, cellElement: HTMLElement, columnIndex: number, event?: Event) {
    const colRem = event?.colRemove;
    if (!colRem) {
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(at, cellElement, columnIndex, event?.colMove);
    }
    if (at._visiblityInternal.filters) {
      if (FilterInternalUtils.wasHeaderChanged(at._columnsDetails, at._visiblityInternal.filters, columnIndex, colRem)) {
        VisibilityUtils.headerChanged(at);
      }
    }
  }
}
