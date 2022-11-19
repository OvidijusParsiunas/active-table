import {EditableTableComponent} from '../../editable-table-component';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';

export class IndexColumnEvents {
  public static setEvents(etc: EditableTableComponent, rowIndex: number, cell: HTMLElement) {
    cell.onclick = RowDropdown.display.bind(etc, rowIndex);
  }
}
