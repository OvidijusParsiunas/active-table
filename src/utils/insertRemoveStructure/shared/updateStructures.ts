import {EditableTableComponent} from '../../../editable-table-component';
import {CellElement} from '../../../elements/cell/cellElement';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';

export interface LastRowDetails {
  element: HTMLElement;
  index: number;
}

export class UpdateStructures {
  // prettier-ignore
  private static updateRowCells(etc: EditableTableComponent,
      rowElement: HTMLElement, contentsRowIndex: number, cellUpdateType: CELL_UPDATE_TYPE) {
    Array.from(rowElement.children).forEach((cellElement: Node, columnIndex: number) => {
      CellElement.setCellEvents(etc, cellElement as HTMLElement, contentsRowIndex, columnIndex);
      etc.onCellUpdate(cellElement.textContent as string, contentsRowIndex, columnIndex, cellUpdateType);
    });
  }

  // the reason why last row details need to be passed here is because remove row no longer has the last element details
  // if the last row was remove and because this class's methods are run in setTimeouts, those details need to be captured
  // before these methods are executed
  private static updateLastRow(etc: EditableTableComponent, cellUpdateType: CELL_UPDATE_TYPE, lastRow: LastRowDetails) {
    const dataElementChildren = etc.dataElementRef?.children;
    if (dataElementChildren) {
      UpdateStructures.updateRowCells(etc, lastRow.element, lastRow.index, cellUpdateType);
    }
  }

  // prettier-ignore
  private static updateLowerBeforeLastRows(etc: EditableTableComponent, startContentsRowIndex: number,
      lastContentsRowIndex: number) {
    const dataElementChildren = etc.dataElementRef?.children;
    if (dataElementChildren) {
      const lowerRows = Array.from(dataElementChildren).slice(startContentsRowIndex - 1, lastContentsRowIndex - 1);
      lowerRows.forEach((rowElement: Node, rowIndex: number) => {
        const relativeContentsRowIndex = rowIndex + startContentsRowIndex;
        UpdateStructures.updateRowCells(etc, rowElement as HTMLElement, relativeContentsRowIndex, CELL_UPDATE_TYPE.UPDATE);
      });
    }
  }

  // prettier-ignore
  public static updateDataRows(etc: EditableTableComponent,
      startContentsRowIndex: number, lastRowUpdateType: CELL_UPDATE_TYPE, lastRow: LastRowDetails) {
    UpdateStructures.updateLowerBeforeLastRows(etc, startContentsRowIndex, lastRow.index)
    UpdateStructures.updateLastRow(etc, lastRowUpdateType, lastRow);
  }
}
