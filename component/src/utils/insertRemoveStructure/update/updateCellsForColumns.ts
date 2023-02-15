import {CellEventsReset} from '../../../elements/cell/cellEventsReset';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';
import {FireEvents} from '../../events/fireEvents';
import {ActiveTable} from '../../../activeTable';

export class UpdateCellsForColumns {
  // prettier-ignore
  private static updateColumn(at: ActiveTable,
      rowIndex: number, cellElement: Node, columnIndex: number, updateType: CELL_UPDATE_TYPE) {
    if (updateType !== CELL_UPDATE_TYPE.REMOVED) {
      CellEventsReset.reset(at, cellElement as HTMLElement, rowIndex, columnIndex); // REF-33
    }
    FireEvents.onCellUpdate(at, CellElement.getText(cellElement as HTMLElement), rowIndex, columnIndex, updateType);
  }

  // prettier-ignore
  private static updateNextBeforeLastColumns(
      at: ActiveTable, row: ElementDetails, startColumnIndex: number, lastColumnIndex: number) {
    const nextColumns = ExtractElements.textCellsArrFromRow(row.element).slice(startColumnIndex, lastColumnIndex);
    nextColumns.forEach((cellElement: Node, columnIndex: number) => {
      const relativeColumnIndex = columnIndex + startColumnIndex;
      UpdateCellsForColumns.updateColumn(at, row.index, cellElement, relativeColumnIndex, CELL_UPDATE_TYPE.UPDATE);
    });
  }

  // the reason why last column details need to be passed here is because after removal of last element, its details are
  // no longer present here as this class's methods are run in setTimeouts, hence those details need to be captured
  // before these methods are executed
  // prettier-ignore
  public static rebindAndFireUpdates(at: ActiveTable, 
      row: ElementDetails, startingColumnIndex: number, updateType: CELL_UPDATE_TYPE, lastColumn: ElementDetails) {
    UpdateCellsForColumns.updateNextBeforeLastColumns(at, row, startingColumnIndex, lastColumn.index);
    UpdateCellsForColumns.updateColumn(at, row.index, lastColumn.element, lastColumn.index, updateType);
  }
}
