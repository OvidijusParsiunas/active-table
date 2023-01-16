// eslint-disable-next-line max-len
import {RowDropdownCellOverlayEvents} from '../../../elements/dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlayEvents';
import {IndexColumnEvents} from '../../../elements/indexColumn/indexColumnEvents';
import {CellEventsReset} from '../../../elements/cell/cellEventsReset';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';
import {ActiveTable} from '../../../activeTable';

export class UpdateCellsForRows {
  // prettier-ignore
  private static updateRowCells(at: ActiveTable,
      rowElement: HTMLElement, rowIndex: number, cellUpdateType: CELL_UPDATE_TYPE) {
    const dataCellElements = ExtractElements.textCellsArrFromRow(rowElement);
    dataCellElements.forEach((cellElement: Node, columnIndex: number) => {
      if (cellUpdateType !== CELL_UPDATE_TYPE.REMOVED) {
        CellEventsReset.reset(at, cellElement as HTMLElement, rowIndex, columnIndex); // REF-33
      }
      at.onCellUpdate(CellElement.getText(cellElement as HTMLElement), rowIndex, columnIndex, cellUpdateType);
    });
    if (cellUpdateType !== CELL_UPDATE_TYPE.REMOVED) {
      const leftMostCell = rowElement.children[0] as HTMLElement;
      if (at.auxiliaryTableContentInternal.displayIndexColumn) IndexColumnEvents.setEvents(at, leftMostCell, rowIndex);
      if (at.rowDropdownSettings.displaySettings.openMethod?.overlayClick) {
        RowDropdownCellOverlayEvents.setOverlayEvents(at, rowIndex, leftMostCell);
      }
    }
  }

  private static updateLastRow(at: ActiveTable, cellUpdateType: CELL_UPDATE_TYPE, lastRow: ElementDetails) {
    if (at.tableBodyElementRef?.children) {
      UpdateCellsForRows.updateRowCells(at, lastRow.element, lastRow.index, cellUpdateType);
    }
  }

  private static updateLowerBeforeLastRows(at: ActiveTable, startRowIndex: number, lastRowIndex: number) {
    const tableBodyChildren = at.tableBodyElementRef?.children;
    if (tableBodyChildren) {
      const lowerRows = Array.from(tableBodyChildren).slice(startRowIndex, lastRowIndex);
      lowerRows.forEach((row: Node, lowerRowIndex: number) => {
        const relativeContentsRowIndex = lowerRowIndex + startRowIndex;
        const rowElement = row as HTMLElement;
        UpdateCellsForRows.updateRowCells(at, rowElement, relativeContentsRowIndex, CELL_UPDATE_TYPE.UPDATE);
      });
    }
  }

  // REF-20
  // the reason why last row details need to be passed here is because after removal of last row, the last element details
  // are no longer available as this class's methods are run in setTimeouts, hence those details need to be captured
  // before these methods are executed
  // CAUTION-2 if the addition or removal of row causes the parent div to change width, this is indeed run after rerender,
  // however the onCellUpdate messages are required and event rebinding here still appears to be valid
  // prettier-ignore
  public static rebindAndFireUpdates(
      at: ActiveTable, startRowIndex: number, lastRowUpdateType: CELL_UPDATE_TYPE, lastRow: ElementDetails) {
    UpdateCellsForRows.updateLowerBeforeLastRows(at, startRowIndex, lastRow.index);
    UpdateCellsForRows.updateLastRow(at, lastRowUpdateType, lastRow);
  }
}
