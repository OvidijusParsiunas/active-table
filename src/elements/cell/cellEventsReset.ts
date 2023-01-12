import {ColumnDropdownCellOverlayEvents} from '../dropdown/columnDropdown/cellOverlay/columnDropdownCellOverlayEvents';
import {RowDropdownCellOverlayEvents} from '../dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlayEvents';
import {EditableHeaderCellEvents} from './headerCell/editable/editableHeaderCellEvents';
import {DateCellEvents} from './cellsWithTextDiv/dateCell/dateCellEvents';
import {EditableTableComponent} from '../../editable-table-component';
import {CheckboxCellEvents} from './checkboxCell/checkboxCellEvents';
import {SelectCell} from './cellsWithTextDiv/selectCell/selectCell';
import {HeaderCellEvents} from './headerCell/headerCellEvents';
import {DataCellEvents} from './dataCell/dataCellEvents';

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

  // prettier-ignore
  private static setDataCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {settings, activeType} = etc.columnsDetails[columnIndex];
    if (!settings.isCellTextEditable) return;
    DataCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
    const {selectProps, calendar, checkbox} = activeType;
    if (selectProps) {
      SelectCell.setEvents(etc, cellElement, rowIndex, columnIndex);
    } else if (calendar) {
      DateCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
    } else if (checkbox) {
      CheckboxCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
    }
  }

  // prettier-ignore
  private static setHeaderCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (etc.columnDropdownDisplaySettings.openMethod?.cellClick) {
      HeaderCellEvents.setEvents(etc, cellElement, columnIndex)
    } else {
      DataCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
      EditableHeaderCellEvents.setEvents(etc, cellElement, 0, columnIndex);
      ColumnDropdownCellOverlayEvents.setEvents(etc, columnIndex);
    }
  }

  // REF-33
  // prettier-ignore
  public static reset(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number,
      columnIndex: number) {
    if (rowIndex === 0) {
      CellEventsReset.setHeaderCellEvents(etc, cellElement as HTMLElement, rowIndex, columnIndex);
    } else {
      CellEventsReset.setDataCellEvents(etc, cellElement as HTMLElement, rowIndex, columnIndex);
    }
    if (!etc.auxiliaryTableContentInternal.displayIndexColumn && columnIndex === 0) {
      RowDropdownCellOverlayEvents.addCellEvents(etc, rowIndex, cellElement);
    }
  }
}
