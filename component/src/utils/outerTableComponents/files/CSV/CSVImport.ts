import {UpdateAllTableData} from '../../../programmaticUpdates/updateAllTableData';
import {ImportOverwriteOptions} from '../../../../types/files';
import {ActiveTable} from '../../../../activeTable';

export class CSVImport {
  private static getPaddedArray(rowsOfData: string[][], largestRowLength: number) {
    return rowsOfData.map((row) => row.concat(Array(largestRowLength).fill('')).slice(0, largestRowLength));
  }

  private static splitRow(row: string) {
    // Matches commas outside of double-quotes
    const regex = /("[^"]*"|[^,]+)(,|$)/g;
    const rowCells: string[] = [];
    row.replace(regex, (_, value) => {
      rowCells.push(value);
      // Return an empty string to continue the iteration
      return '';
    });

    return rowCells;
  }

  private static parseDataFromRow(row: string, cells: string[][], largestRowLength: number) {
    const rowCells = CSVImport.splitRow(row);
    if (rowCells.length > 0) {
      cells.push(rowCells);
      if (rowCells.length > largestRowLength) largestRowLength = rowCells.length;
    }
    return largestRowLength;
  }

  // TO-DO validation and error handling
  private static parseCSV(csvText: string) {
    try {
      const rows = csvText.split(/\r\n|\n/) as string[];
      const cells: string[][] = [];
      let largestRowLength = 0;
      rows.forEach((row) => {
        largestRowLength = CSVImport.parseDataFromRow(row, cells, largestRowLength);
      });
      return CSVImport.getPaddedArray(cells, largestRowLength);
    } catch (errorMessage) {
      console.error('Incorrect format');
      return null;
    }
  }

  private static getStartRowIndex(numberOfTableRows: number, options?: ImportOverwriteOptions): number {
    if (options && typeof options.tableRowStartIndex === 'number') {
      if (options.tableRowStartIndex < 0 || options.tableRowStartIndex > numberOfTableRows) {
        return numberOfTableRows;
      }
      return options.tableRowStartIndex;
    }
    return 0;
  }

  public static processFile(at: ActiveTable, csvText: string, options?: ImportOverwriteOptions) {
    const csvData = CSVImport.parseCSV(csvText);
    if (csvData && options && typeof options.importRowStartIndex === 'number')
      csvData.splice(0, options.importRowStartIndex);
    if (!csvData || csvData.length === 0) return;
    const startRowIndex = CSVImport.getStartRowIndex(at.data.length, options);
    UpdateAllTableData.update(at, csvData, startRowIndex);
  }

  public static import(at: ActiveTable, file: File, options?: ImportOverwriteOptions) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => CSVImport.processFile(at, event.target?.result as string, options);
  }
}
