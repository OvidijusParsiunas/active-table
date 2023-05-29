import {FilterInternalUtils} from '../outerTableComponents/filter/filterInternalUtils';
import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {ActiveTable} from '../../activeTable';

interface Event {
  colMove?: boolean;
  colRemove?: boolean;
}

export class HeaderText {
  public static onChange(at: ActiveTable, cellElement: HTMLElement, columnIndex: number, event?: Event) {
    if (!event?.colRemove) {
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(at, cellElement, columnIndex, event?.colMove);
    }
    if (at._filterInternal.rows) FilterInternalUtils.headerChanged(at);
  }
}
