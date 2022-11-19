import {EditableTableComponent} from '../../editable-table-component';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';

export class IndexColumnEvents {
  public static setEvents(etc: EditableTableComponent, cell: HTMLElement, rowIndex: number) {
    cell.onclick = RowDropdown.display.bind(etc, rowIndex);
  }
}
