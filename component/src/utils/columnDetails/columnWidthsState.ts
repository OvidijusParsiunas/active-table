import {ExtractElements} from '../elements/extractElements';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {ColumnsWidths} from '../../types/columnsWidths';
import {ActiveTable} from '../../activeTable';

// REF-35
export class ColumnWidthsState {
  public static overwriteWidths(columnsDetails: ColumnsDetailsT, columnsWidths: ColumnsWidths) {
    columnsWidths.columns.forEach((column, index) => (columnsDetails[index].elements[0].style.width = `${column}px`));
  }

  public static fireUpdate(at: ActiveTable) {
    const {tableElementRef, tableBodyElementRef} = at;
    if (!tableElementRef || !tableBodyElementRef) return;
    const firstRow = tableBodyElementRef.children[0] as HTMLElement;
    if (firstRow) {
      const cellElements = ExtractElements.textCellsArrFromRow(firstRow);
      const columnWidths = cellElements.map((element) => (element as HTMLElement).offsetWidth);
      at.onColumnWidthsUpdate({
        columns: columnWidths,
      });
    }
  }
}
