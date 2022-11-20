import {CategoryCellEvents} from '../../../elements/cell/cellsWithTextDiv/categoryCell/categoryCellEvents';
import {DateCellEvents} from '../../../elements/cell/cellsWithTextDiv/dateCell/dateCellEvents';
import {IndexColumnEvents} from '../../../elements/indexColumn/indexColumnEvents';
import {DATE_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from '../../../enums/columnType';
import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';

export class UpdateCellsForRows {
  // prettier-ignore
  private static resetCellEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number,
      columnIndex: number) {
    CellElement.setCellEvents(etc, cellElement as HTMLElement, rowIndex, columnIndex);
    const userSetColumnType = etc.columnsDetails[columnIndex].userSetColumnType;
    if (userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
      CategoryCellEvents.setEvents(etc, cellElement as HTMLElement, rowIndex, columnIndex);
    } else if (DATE_COLUMN_TYPE[userSetColumnType]) {
      DateCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex, userSetColumnType);
    }
  }

  // prettier-ignore
  private static updateRowCells(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, cellUpdateType: CELL_UPDATE_TYPE) {
    const dataCellElements = ExtractElements.textCellsArrFromRow(rowElement);
    dataCellElements.forEach((cellElement: Node, columnIndex: number) => {
      if (cellUpdateType !== CELL_UPDATE_TYPE.REMOVED) {
        UpdateCellsForRows.resetCellEvents(etc, cellElement as HTMLElement, rowIndex, columnIndex);
      }
      etc.onCellUpdate(cellElement.textContent as string, rowIndex, columnIndex, cellUpdateType);
    });
  }

  private static updateLastRow(etc: EditableTableComponent, cellUpdateType: CELL_UPDATE_TYPE, lastRow: ElementDetails) {
    if (etc.tableBodyElementRef?.children) {
      UpdateCellsForRows.updateRowCells(etc, lastRow.element, lastRow.index, cellUpdateType);
    }
  }

  private static updateLowerBeforeLastRows(etc: EditableTableComponent, startRowIndex: number, lastRowIndex: number) {
    const tableBodyChildren = etc.tableBodyElementRef?.children;
    if (tableBodyChildren) {
      const lowerRows = Array.from(tableBodyChildren).slice(startRowIndex, lastRowIndex);
      lowerRows.forEach((row: Node, lowerRowIndex: number) => {
        const relativeContentsRowIndex = lowerRowIndex + startRowIndex;
        const rowElement = row as HTMLElement;
        UpdateCellsForRows.updateRowCells(etc, rowElement, relativeContentsRowIndex, CELL_UPDATE_TYPE.UPDATE);
        if (etc.displayIndexColumn) {
          IndexColumnEvents.setEvents(etc, rowElement.children[0] as HTMLElement, relativeContentsRowIndex);
        }
      });
    }
  }

  // REF-20
  // the reason why last row details need to be passed here is because after removal of last row, the last element details
  // are no longer available as this class's methods are run in setTimeouts, hence those details need to be captured
  // before these methods are executed
  // prettier-ignore
  public static rebindAndFireUpdates(
      etc: EditableTableComponent, startRowIndex: number, lastRowUpdateType: CELL_UPDATE_TYPE, lastRow: ElementDetails) {
    UpdateCellsForRows.updateLowerBeforeLastRows(etc, startRowIndex, lastRow.index);
    UpdateCellsForRows.updateLastRow(etc, lastRowUpdateType, lastRow);
  }
}
