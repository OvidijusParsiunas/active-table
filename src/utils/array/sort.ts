import {EditableTableComponent} from '../../editable-table-component';
import {TableContents, TableRow} from '../../types/tableContents';
import {CellEvents} from '../../elements/cell/cellEvents';
import {ACTIVE_COLUMN_TYPE} from '../../enums/columnType';

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

  private static sortNumbers(dataContents: TableContents, columnIndex: number, asc: boolean) {
    if (asc) {
      Sort.sortNumbersColumnAscending(dataContents, columnIndex);
    } else {
      Sort.sortNumbersColumnDescending(dataContents, columnIndex);
    }
  }

  private static sortStringsColumnAscending(contents: TableContents, columnIndex: number) {
    contents.sort((a: TableRow, b: TableRow) => (a[columnIndex] as string).localeCompare(b[columnIndex] as string));
  }

  private static sortStringsColumnDescending(contents: TableContents, columnIndex: number) {
    contents.sort((a: TableRow, b: TableRow) => (b[columnIndex] as string).localeCompare(a[columnIndex] as string));
  }

  private static sortStrings(dataContents: TableContents, columnIndex: number, asc: boolean) {
    if (asc) {
      Sort.sortStringsColumnAscending(dataContents, columnIndex);
    } else {
      Sort.sortStringsColumnDescending(dataContents, columnIndex);
    }
  }

  public static sortContentsColumn(etc: EditableTableComponent, columnIndex: number, asc: boolean) {
    const dataContents = etc.contents.slice(1);
    const columnType = etc.columnsDetails[columnIndex].activeColumnType;
    if (columnType === ACTIVE_COLUMN_TYPE.Number) {
      Sort.sortNumbers(dataContents, columnIndex, asc);
    } else {
      Sort.sortStrings(dataContents, columnIndex, asc);
    }
    Sort.update(etc, dataContents);
  }
}

// Alternative way to sort any types

// private static sortAnyAscending(contents: TableContents, columnIndex: number) {
//   contents.sort((a: TableRow, b: TableRow) => {
//     if ((a[columnIndex] as number) < (b[columnIndex] as number)) {
//       return -1;
//     }
//     if ((a[columnIndex] as number) > (b[columnIndex] as number)) {
//       return 1;
//     }
//     return 0;
//   });
// }

// private static sortAnyDescending(contents: TableContents, columnIndex: number) {
//   contents.sort((a: TableRow, b: TableRow) => {
//     if ((a[columnIndex] as number) > (b[columnIndex] as number)) {
//       return -1;
//     }
//     if ((a[columnIndex] as number) < (b[columnIndex] as number)) {
//       return 1;
//     }
//     return 0;
//   });
// }

// private static sortAny(dataContents: TableContents, columnIndex: number, asc: boolean) {
//   if (asc) {
//     Sort.sortAnyAscending(dataContents, columnIndex);
//   } else {
//     Sort.sortAnyDescending(dataContents, columnIndex);
//   }
// }
