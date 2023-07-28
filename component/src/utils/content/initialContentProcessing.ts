import {CellText, TableContent, TableRow} from '../../types/tableContent';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {EMPTY_STRING} from '../../consts/text';
import {ActiveTable} from '../../activeTable';

export class InitialContentProcessing {
  private static cleanupContentThatDidNotGetAdded(content: TableContent, columnsDetails: ColumnsDetailsT) {
    if (content[0]?.length - columnsDetails.length > 0) content.forEach((row) => row.splice(columnsDetails.length));
    if (columnsDetails.length === 0) {
      content.splice(0, content.length);
    } else if (content.length > columnsDetails[0].elements.length) {
      content.splice(columnsDetails[0].elements.length);
    }
  }

  public static postProcess(content: TableContent, columnsDetails: ColumnsDetailsT) {
    setTimeout(() => InitialContentProcessing.cleanupContentThatDidNotGetAdded(content, columnsDetails));
  }

  private static fillRow(row: TableRow, maxRowLength: number) {
    const newArray = new Array(maxRowLength - row.length).fill(EMPTY_STRING);
    row.splice(row.length, maxRowLength - row.length, ...newArray);
  }

  private static processRowContentByLength(content: TableContent, maxRowLength: number) {
    // if all rows length is 0 - remove them
    if (maxRowLength === 0) {
      content.splice(0, content.length);
    }
    content.forEach((row) => {
      if (row.length < maxRowLength) {
        InitialContentProcessing.fillRow(row, maxRowLength);
      }
    });
  }

  private static getMaxRowLength(content: TableContent) {
    return content.reduce((currentMax, row) => {
      return Math.max(currentMax, row.length);
    }, 0);
  }

  private static removeRowsExceedingLimit(content: TableContent, maxRows?: number) {
    if (maxRows !== undefined && maxRows > 0 && content.length > maxRows) {
      content.splice(maxRows, content.length - 1);
    }
  }

  private static removeDuplicateHeaders(content: TableContent, defaultValue?: CellText) {
    const headerRow = content[0];
    headerRow.reduce((currentSet, newValue, columnIndex) => {
      if (currentSet.has(newValue)) {
        headerRow[columnIndex] = defaultValue || '';
      } else {
        currentSet.add(newValue);
      }
      return currentSet;
    }, new Set());
  }

  public static preProcess(at: ActiveTable, content: TableContent) {
    const {maxRows, allowDuplicateHeaders, _defaultColumnsSettings} = at;
    InitialContentProcessing.removeRowsExceedingLimit(content, maxRows);
    const maxRowLength = InitialContentProcessing.getMaxRowLength(content);
    InitialContentProcessing.processRowContentByLength(content, maxRowLength);
    if (!allowDuplicateHeaders && content.length > 0) {
      InitialContentProcessing.removeDuplicateHeaders(content, _defaultColumnsSettings.defaultText);
    }
  }
}
