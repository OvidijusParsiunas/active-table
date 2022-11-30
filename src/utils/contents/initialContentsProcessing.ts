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

  public static preProcess(contents: TableContents) {
    const maxRowLength = InitialContentsProcessing.getMaxRowLength(contents);
    InitialContentsProcessing.makeAllContentRowsSameLength(contents, maxRowLength);
  }
}
