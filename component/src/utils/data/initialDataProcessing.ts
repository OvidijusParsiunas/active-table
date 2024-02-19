import {CellText, TableData, TableRow} from '../../types/tableData';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {EMPTY_STRING} from '../../consts/text';
import {ActiveTable} from '../../activeTable';

export class InitialDataProcessing {
  private static cleanupDataThatDidNotGetAdded(data: TableData, columnsDetails: ColumnsDetailsT) {
    if (data[0]?.length - columnsDetails.length > 0) data.forEach((row) => row.splice(columnsDetails.length));
    if (columnsDetails.length === 0) {
      data.splice(0, data.length);
    } else if (data.length > columnsDetails[0].elements.length) {
      data.splice(columnsDetails[0].elements.length);
    }
  }

  public static postProcess(data: TableData, columnsDetails: ColumnsDetailsT) {
    setTimeout(() => InitialDataProcessing.cleanupDataThatDidNotGetAdded(data, columnsDetails));
  }

  private static fillRow(row: TableRow, maxRowLength: number) {
    const newArray = new Array(maxRowLength - row.length).fill(EMPTY_STRING);
    row.splice(row.length, maxRowLength - row.length, ...newArray);
  }

  private static processRowDataByLength(data: TableData, maxRowLength: number) {
    // if all rows length is 0 - remove them
    if (maxRowLength === 0) {
      data.splice(0, data.length);
    }
    data.forEach((row) => {
      if (row.length < maxRowLength) {
        InitialDataProcessing.fillRow(row, maxRowLength);
      }
    });
  }

  public static getMaxRowLength(data: TableData) {
    return data.reduce((currentMax, row) => {
      return Math.max(currentMax, row.length);
    }, 0);
  }

  private static removeRowsExceedingLimit(data: TableData, maxRows?: number) {
    if (maxRows !== undefined && maxRows > 0 && data.length > maxRows) {
      data.splice(maxRows, data.length - 1);
    }
  }

  private static removeDuplicateHeaders(data: TableData, defaultValue?: CellText) {
    const headerRow = data[0];
    headerRow.reduce((currentSet, newValue, columnIndex) => {
      if (currentSet.has(newValue)) {
        headerRow[columnIndex] = defaultValue || '';
      } else {
        currentSet.add(newValue);
      }
      return currentSet;
    }, new Set());
  }

  public static preProcess(at: ActiveTable, data: TableData) {
    const {maxRows, allowDuplicateHeaders, _defaultColumnsSettings} = at;
    InitialDataProcessing.removeRowsExceedingLimit(data, maxRows);
    const maxRowLength = InitialDataProcessing.getMaxRowLength(data);
    InitialDataProcessing.processRowDataByLength(data, maxRowLength);
    if (!allowDuplicateHeaders && data.length > 0) {
      InitialDataProcessing.removeDuplicateHeaders(data, _defaultColumnsSettings.defaultText);
    }
  }
}
