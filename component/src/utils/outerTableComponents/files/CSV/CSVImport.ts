import {UpdateAllTableData} from '../../../programmaticUpdates/updateAllTableData';
import {ImportOverwriteOptions} from '../../../../types/files';
import {ActiveTable} from '../../../../activeTable';

export class CSVImport {
  private static getPaddedArray(rowsOfData: string[][], largestRowLength: number) {
    return rowsOfData.map((row) => row.concat(Array(largestRowLength).fill('')).slice(0, largestRowLength));
  }

  private static parseDataFromRow(row: string, rowsOfData: string[][], largestRowLength: number) {
    const data = row.split(',');
    if (data.length > 0) {
      rowsOfData.push(data);
      if (data.length > largestRowLength) largestRowLength = data.length;
    }
    return largestRowLength;
  }

  // TO-DO validation and error handling
  private static parseCSV(csvText: string) {
    try {
      const rows = csvText.split(/\r\n|\n/) as string[];
      const rowsOfData: string[][] = [];
      let largestRowLength = 0;
      rows.forEach((row) => {
        largestRowLength = CSVImport.parseDataFromRow(row, rowsOfData, largestRowLength);
      });
      return CSVImport.getPaddedArray(rowsOfData, largestRowLength);
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
    const csvContent = CSVImport.parseCSV(csvText);
    if (csvContent && options && typeof options.importRowStartIndex === 'number')
      csvContent.splice(0, options.importRowStartIndex);
    if (!csvContent || csvContent.length === 0) return;
    const startRowIndex = CSVImport.getStartRowIndex(at.content.length, options);
    UpdateAllTableData.update(at, csvContent, startRowIndex);
  }

  public static import(at: ActiveTable, file: File, options?: ImportOverwriteOptions) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => CSVImport.processFile(at, event.target?.result as string, options);
  }
}
