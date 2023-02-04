import {ExtractElements} from '../elements/extractElements';
import {ActiveTable} from '../../activeTable';

// REF-35
export class ColumnWidthsState {
  public static fireUpdate(at: ActiveTable) {
    const {tableElementRef, tableBodyElementRef} = at;
    if (!tableElementRef || !tableBodyElementRef) return;
    const firstRow = tableBodyElementRef.children[0] as HTMLElement;
    if (firstRow) {
      const cellElements = ExtractElements.textCellsArrFromRow(firstRow);
      const columnWidths = cellElements.map((element) => (element as HTMLElement).offsetWidth);
      at.onColumnWidthsUpdate(columnWidths);
    }
  }
}
