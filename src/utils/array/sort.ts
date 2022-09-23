import {EditableTableComponent} from '../../editable-table-component';
import {TableContents, TableRow} from '../../types/tableContents';
import {CellEvents} from '../../elements/cell/cellEvents';

export class Sort {
  // prettier-ignore
  private static update(etc: EditableTableComponent, sortedDataContents: TableContents,) {
    const rowElements = (etc.tableBodyElementRef as HTMLElement).children;
    sortedDataContents.forEach((row, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      const rowChildren = rowElements[relativeRowIndex].children;
      row.forEach((cell, columnIndex) => {
        const elementColumnIndex = columnIndex * 2;
        // the reason why updateContents property is set to false is because we do not want to overwrite contents array
        // cells as their row references are still the same with the sortedDataContents, hence upon attempting to
        // overwrite the contents array cells, sortedDataContents cells are also overwritten. This is problematic because
        // sortedDataContents rows are in a different order, hence the cells to be traversed can already be overwritten
        // by the earlier cells
        CellEvents.updateCell(etc, cell as string, relativeRowIndex, columnIndex,
          { processText: false, element: rowChildren[elementColumnIndex] as HTMLElement,
            updateTableEvent: false, updateContents: false });
      });
    });
    etc.contents.splice(1, sortedDataContents.length, ...sortedDataContents);
    etc.onTableUpdate(etc.contents);
  }

  private static sortNumbersColumnAscending(contents: TableContents, columnIndex: number) {
    contents.sort((a: TableRow, b: TableRow) => (a[columnIndex] as number) - (b[columnIndex] as number));
  }

  private static sortNumbersColumnDescending(contents: TableContents, columnIndex: number) {
    contents.sort((a: TableRow, b: TableRow) => (b[columnIndex] as number) - (a[columnIndex] as number));
  }

  public static sortContentsColumn(etc: EditableTableComponent, columnIndex: number, asc: boolean) {
    const dataContents = etc.contents.slice(1);
    if (asc) {
      Sort.sortNumbersColumnAscending(dataContents, columnIndex);
    } else {
      Sort.sortNumbersColumnDescending(dataContents, columnIndex);
    }
    Sort.update(etc, dataContents);
  }
}
