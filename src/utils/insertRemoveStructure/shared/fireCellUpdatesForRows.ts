import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';
import {ElementDetails} from '../../../types/elementDetails';

export class FireCellUpdatesForRows {
  // prettier-ignore
  private static updateRowCells(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, cellUpdateType: CELL_UPDATE_TYPE) {
    Array.from(rowElement.children).forEach((cellElement: Node, columnIndex: number) => {
      if (cellUpdateType !== CELL_UPDATE_TYPE.REMOVED) {
        CellElement.setCellEvents(etc, cellElement as HTMLElement, rowIndex, columnIndex);
      }
      etc.onCellUpdate(cellElement.textContent as string, rowIndex, columnIndex, cellUpdateType);
    });
  }

  private static updateLastRow(etc: EditableTableComponent, cellUpdateType: CELL_UPDATE_TYPE, lastRow: ElementDetails) {
    if (etc.tableBodyElementRef?.children) {
      FireCellUpdatesForRows.updateRowCells(etc, lastRow.element, lastRow.index, cellUpdateType);
    }
  }

  // prettier-ignore
  private static updateLowerBeforeLastRows(etc: EditableTableComponent, startRowIndex: number, lastRowIndex: number) {
    const tableBodyChildren = etc.tableBodyElementRef?.children;
    if (tableBodyChildren) {
      const lowerRows = Array.from(tableBodyChildren).slice(startRowIndex, lastRowIndex);
      lowerRows.forEach((rowElement: Node, lowerRowIndex: number) => {
        const relativeContentsRowIndex = lowerRowIndex + startRowIndex;
        FireCellUpdatesForRows.updateRowCells(
          etc, rowElement as HTMLElement, relativeContentsRowIndex, CELL_UPDATE_TYPE.UPDATE);
      });
    }
  }

  // the reason why last row details need to be passed here is because after removal of last row, the last element details
  // are no longer available as this class's methods are run in setTimeouts, hence those details need to be captured
  // before these methods are executed
  // prettier-ignore
  public static update(
      etc: EditableTableComponent, startRowIndex: number, lastRowUpdateType: CELL_UPDATE_TYPE, lastRow: ElementDetails) {
    FireCellUpdatesForRows.updateLowerBeforeLastRows(etc, startRowIndex, lastRow.index)
    FireCellUpdatesForRows.updateLastRow(etc, lastRowUpdateType, lastRow);
  }
}
