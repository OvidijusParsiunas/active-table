import {EditableTableComponent} from '../../editable-table-component';
import {CellEvents} from '../../elements/cell/cellEvents';
import {ColumnDetailsT} from '../../types/columnDetails';

export class ColumnSettingsDefaultTextUtils {
  public static unsetDefaultText(etc: EditableTableComponent, columnDetails: ColumnDetailsT, columnIndex: number) {
    columnDetails.elements.slice(1).forEach((element: HTMLElement, rowIndex: number) => {
      const relativeIndex = rowIndex + 1;
      CellEvents.removeTextIfDefault(etc, relativeIndex, columnIndex, element);
    });
  }

  public static setDefaultText(etc: EditableTableComponent, columnDetails: ColumnDetailsT, columnIndex: number) {
    let isCellUpdated = false;
    columnDetails.elements.slice(1).forEach((element: HTMLElement, rowIndex: number) => {
      const relativeIndex = rowIndex + 1;
      const isUpdated = CellEvents.setCellToDefaultIfNeeded(etc, relativeIndex, columnIndex, element, false);
      if (!isCellUpdated && isUpdated) isCellUpdated = true;
    });
    etc.onTableUpdate(etc.contents);
  }
}
