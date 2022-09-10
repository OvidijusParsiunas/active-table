import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';
import {ElementDetails} from '../../../types/elementDetails';

export class UpdateRows {
  // prettier-ignore
  private static updateRowCells(etc: EditableTableComponent,
      rowElement: HTMLElement, contentsRowIndex: number, cellUpdateType: CELL_UPDATE_TYPE) {
    Array.from(rowElement.children).forEach((cellElement: Node, columnIndex: number) => {
      if (cellUpdateType !== CELL_UPDATE_TYPE.REMOVED) {
        CellElement.setCellEvents(etc, cellElement as HTMLElement, contentsRowIndex, columnIndex);
      }
      etc.onCellUpdate(cellElement.textContent as string, contentsRowIndex, columnIndex, cellUpdateType);
    });
  }

  private static updateLastRow(etc: EditableTableComponent, cellUpdateType: CELL_UPDATE_TYPE, lastRow: ElementDetails) {
    if (etc.tableBodyElementRef?.children) {
      UpdateRows.updateRowCells(etc, lastRow.element, lastRow.index, cellUpdateType);
    }
  }

  // prettier-ignore
  private static updateLowerBeforeLastRows(etc: EditableTableComponent, startContentsRowIndex: number,
      lastContentsRowIndex: number) {
    const tableBodyChildren = etc.tableBodyElementRef?.children;
    if (tableBodyChildren) {
      const lowerRows = Array.from(tableBodyChildren).slice(startContentsRowIndex - 1, lastContentsRowIndex - 1);
      lowerRows.forEach((rowElement: Node, rowIndex: number) => {
        const relativeContentsRowIndex = rowIndex + startContentsRowIndex;
        UpdateRows.updateRowCells(etc, rowElement as HTMLElement, relativeContentsRowIndex, CELL_UPDATE_TYPE.UPDATE);
      });
    }
  }

  // the reason why last row details need to be passed here is because after removal of last row, the last element details
  // are no longer available as this class's methods are run in setTimeouts, hence those details need to be captured
  // before these methods are executed
  // prettier-ignore
  public static update(etc: EditableTableComponent,
      startContentsRowIndex: number, lastRowUpdateType: CELL_UPDATE_TYPE, lastRow: ElementDetails) {
    UpdateRows.updateLowerBeforeLastRows(etc, startContentsRowIndex, lastRow.index)
    UpdateRows.updateLastRow(etc, lastRowUpdateType, lastRow);
  }
}
