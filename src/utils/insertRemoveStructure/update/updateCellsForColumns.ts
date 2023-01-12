import {EditableTableComponent} from '../../../editable-table-component';
import {CellEventsReset} from '../../../elements/cell/cellEventsReset';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';

export class UpdateCellsForColumns {
  // prettier-ignore
  private static updateColumn(etc: EditableTableComponent,
      rowIndex: number, cellElement: Node, columnIndex: number, cellUpdateType: CELL_UPDATE_TYPE) {
    if (cellUpdateType !== CELL_UPDATE_TYPE.REMOVED) {
      CellEventsReset.reset(etc, cellElement as HTMLElement, rowIndex, columnIndex); // REF-33
    }
    etc.onCellUpdate(CellElement.getText(cellElement as HTMLElement), rowIndex, columnIndex, cellUpdateType);
  }

  // prettier-ignore
  private static updateNextBeforeLastColumns(
      etc: EditableTableComponent, row: ElementDetails, startColumnIndex: number, lastColumnIndex: number) {
    const nextColumns = ExtractElements.textCellsArrFromRow(row.element).slice(startColumnIndex, lastColumnIndex);
    nextColumns.forEach((cellElement: Node, columnIndex: number) => {
      const relativeColumnIndex = columnIndex + startColumnIndex;
      UpdateCellsForColumns.updateColumn(etc, row.index, cellElement, relativeColumnIndex, CELL_UPDATE_TYPE.UPDATE);
    });
  }

  // the reason why last column details need to be passed here is because after removal of last element, its details are
  // no longer present here as this class's methods are run in setTimeouts, hence those details need to be captured
  // before these methods are executed
  // prettier-ignore
  public static rebindAndFireUpdates(etc: EditableTableComponent, 
      row: ElementDetails, startingColumnIndex: number, cellUpdateType: CELL_UPDATE_TYPE, lastColumn: ElementDetails) {
    UpdateCellsForColumns.updateNextBeforeLastColumns(etc, row, startingColumnIndex, lastColumn.index);
    UpdateCellsForColumns.updateColumn(etc, row.index, lastColumn.element, lastColumn.index, cellUpdateType);
  }
}
