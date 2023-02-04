import {CellEvents} from '../../elements/cell/cellEvents';
import {ColumnDetailsT} from '../../types/columnDetails';
import {ActiveTable} from '../../activeTable';

export class ColumnSettingsDefaultTextUtils {
  public static unsetDefaultText(at: ActiveTable, columnDetails: ColumnDetailsT, columnIndex: number) {
    columnDetails.elements.slice(1).forEach((element: HTMLElement, rowIndex: number) => {
      const relativeIndex = rowIndex + 1;
      CellEvents.removeTextIfDefault(at, relativeIndex, columnIndex, element);
    });
  }

  public static setDefaultText(at: ActiveTable, columnDetails: ColumnDetailsT, columnIndex: number) {
    let isCellUpdated = false;
    columnDetails.elements.slice(1).forEach((element: HTMLElement, rowIndex: number) => {
      const relativeIndex = rowIndex + 1;
      const isUpdated = CellEvents.setCellToDefaultIfNeeded(at, relativeIndex, columnIndex, element, false);
      if (!isCellUpdated && isUpdated) isCellUpdated = true;
    });
    setTimeout(() => at.onContentUpdate(JSON.parse(JSON.stringify(at.content))));
  }
}
