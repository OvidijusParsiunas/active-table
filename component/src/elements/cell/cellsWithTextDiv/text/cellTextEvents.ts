import {FocusNextColumnCellFromTextDiv} from '../../../../utils/focusedElements/focusNextColumnCellFromTextDiv';
import {DataCellEvents} from '../../dataCell/dataCellEvents';
import {ActiveTable} from '../../../../activeTable';

export class CellTextEvents {
  public static tabOutOfCell(at: ActiveTable, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    event.preventDefault();
    DataCellEvents.keyDownCell.bind(at, rowIndex, columnIndex)(event);
    FocusNextColumnCellFromTextDiv.focusOrBlurNext(at, columnIndex, rowIndex);
  }
}
