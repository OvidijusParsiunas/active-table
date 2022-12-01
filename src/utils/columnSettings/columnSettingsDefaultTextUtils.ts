import {EditableTableComponent} from '../../editable-table-component';
import {CellEvents} from '../../elements/cell/cellEvents';
import {ColumnDetailsT} from '../../types/columnDetails';

export class ColumnSettingsDefaultTextUtils {
  public static unsetDefaultText(etc: EditableTableComponent, columnDetails: ColumnDetailsT, columnIndex: number) {
    columnDetails.elements.forEach((element, rowIndex: number) => {
      CellEvents.removeTextIfDefault(etc, rowIndex, columnIndex, element);
    });
  }

  public static setDefaultText(etc: EditableTableComponent, columnDetails: ColumnDetailsT, columnIndex: number) {
    columnDetails.elements.forEach((element, rowIndex: number) => {
      CellEvents.setCellToDefaultIfNeeded(etc, rowIndex, columnIndex, element, false);
    });
  }
}
