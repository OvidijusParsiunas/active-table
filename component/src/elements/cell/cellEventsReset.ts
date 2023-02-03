import {ColumnDropdownCellOverlayEvents} from '../dropdown/columnDropdown/cellOverlay/columnDropdownCellOverlayEvents';
import {RowDropdownCellOverlayEvents} from '../dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlayEvents';
import {EditableHeaderCellEvents} from './headerCell/editable/editableHeaderCellEvents';
import {DateCellEvents} from './cellsWithTextDiv/dateCell/dateCellEvents';
import {CheckboxCellEvents} from './checkboxCell/checkboxCellEvents';
import {SelectCell} from './cellsWithTextDiv/selectCell/selectCell';
import {HeaderCellEvents} from './headerCell/headerCellEvents';
import {DataCellEvents} from './dataCell/dataCellEvents';
import {ActiveTable} from '../../activeTable';

export class CellEventsReset {
  public static unset(cellElement: HTMLElement) {
    cellElement.onfocus = () => {};
    cellElement.onblur = () => {};
    cellElement.onmouseenter = () => {};
    cellElement.onmouseleave = () => {};
    cellElement.onmousedown = () => {};
    cellElement.oninput = () => {};
    cellElement.onpaste = () => {};
    cellElement.onkeydown = () => {};
  }

  private static setDataCellEvents(at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {settings, activeType} = at.columnsDetails[columnIndex];
    if (!settings.isCellTextEditable) return;
    DataCellEvents.setEvents(at, cellElement, rowIndex, columnIndex);
    const {cellDropdownProps, calendar, checkbox} = activeType;
    if (cellDropdownProps) {
      SelectCell.setEvents(at, cellElement, rowIndex, columnIndex);
    } else if (calendar) {
      DateCellEvents.setEvents(at, cellElement, rowIndex, columnIndex);
    } else if (checkbox) {
      CheckboxCellEvents.setEvents(at, cellElement, rowIndex, columnIndex);
    }
  }

  private static setHeaderCellEvents(at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (at.columnsSettings.dropdown?.displaySettings?.openMethod?.cellClick) {
      HeaderCellEvents.setEvents(at, cellElement, columnIndex);
    } else {
      DataCellEvents.setEvents(at, cellElement, rowIndex, columnIndex);
      EditableHeaderCellEvents.setEvents(at, cellElement, 0, columnIndex);
      ColumnDropdownCellOverlayEvents.setEvents(at, columnIndex);
    }
  }

  // REF-33
  public static reset(at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (rowIndex === 0) {
      CellEventsReset.setHeaderCellEvents(at, cellElement as HTMLElement, rowIndex, columnIndex);
    } else {
      CellEventsReset.setDataCellEvents(at, cellElement as HTMLElement, rowIndex, columnIndex);
    }
    if (!at.frameComponentsInternal.displayIndexColumn && columnIndex === 0) {
      RowDropdownCellOverlayEvents.addCellEvents(at, rowIndex, cellElement);
    }
  }
}
