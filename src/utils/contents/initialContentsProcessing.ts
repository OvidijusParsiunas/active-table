import {TableDimensionsUtils} from '../tableDimensions/tableDimensionsUtils';
import {TableContents, TableRow} from '../../types/tableContents';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {EMPTY_STRING} from '../../consts/text';

export class InitialContentsProcessing {
  public static postProcess(contents: TableContents, columnsDetails: ColumnsDetailsT) {
    setTimeout(() => TableDimensionsUtils.cleanupContentsThatDidNotGetAdded(contents, columnsDetails));
  }

  private static fillRow(row: TableRow, maxRowLength: number) {
    const newArray = new Array(maxRowLength - row.length).fill(EMPTY_STRING);
    row.splice(row.length, maxRowLength - row.length, ...newArray);
  }

  private static makeAllContentRowsSameLength(contents: TableContents, maxRowLength: number) {
    contents.forEach((row) => {
      if (row.length < maxRowLength) {
        InitialContentsProcessing.fillRow(row, maxRowLength);
      }
    });
  }

  private static getMaxRowLength(contents: TableContents) {
    return contents.reduce((currentMax, row) => {
      return Math.max(currentMax, row.length);
    }, 0);
  }

  private static removeRowsExceedingLimit(contents: TableContents, maxRows?: number) {
    if (maxRows !== undefined && maxRows > 0 && contents.length > maxRows) {
      contents.splice(maxRows, contents.length - 1);
    }
  }

  public static preProcess(contents: TableContents, maxRows?: number) {
    InitialContentsProcessing.removeRowsExceedingLimit(contents, maxRows);
    const maxRowLength = InitialContentsProcessing.getMaxRowLength(contents);
    InitialContentsProcessing.makeAllContentRowsSameLength(contents, maxRowLength);
  }
}
