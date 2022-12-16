import {FocusNextColumnCellFromTextDiv} from '../../../../utils/focusedElements/focusNextColumnCellFromTextDiv';
import {EditableTableComponent} from '../../../../editable-table-component';
import {DataCellEvents} from '../../dataCell/dataCellEvents';

export class CellTextEvents {
  public static tabOutOfCell(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    event.preventDefault();
    DataCellEvents.keyDownCell.bind(etc)(event);
    FocusNextColumnCellFromTextDiv.focusOrBlurNext(etc, columnIndex, rowIndex);
  }
}
