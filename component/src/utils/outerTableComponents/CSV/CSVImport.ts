import {InsertNewRow} from '../../insertRemoveStructure/insert/insertNewRow';
import {RemoveRow} from '../../insertRemoveStructure/remove/removeRow';
import {ActiveTable} from '../../../activeTable';

export class CSVImport {
  private static getPaddedArray(rowsOfData: string[][], largestRowLength: number) {
    return rowsOfData.map((row) => row.concat(Array(largestRowLength).fill('')).slice(0, largestRowLength));
  }

  private static parseDataFromRow(row: string, rowsOfData: string[][], largestRowLength: number) {
    const data = row.split(',').filter((cellValue) => cellValue.trim() !== '');
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

  private static processFile(at: ActiveTable, csvText: string) {
    const newContent = CSVImport.parseCSV(csvText);
    if (!newContent) return;
    for (let i = at.content.length - 1; i >= 0; i -= 1) {
      RemoveRow.remove(at, i);
    }
    // in a timeout because RemoveRow.remove contains processes inside timeouts e.g. remove column details
    setTimeout(() => {
      newContent.forEach((row, index) => InsertNewRow.insert(at, index, true, row));
    });
  }

  public static import(at: ActiveTable, event: Event) {
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement).files?.[0] as Blob;
    reader.readAsText(file);
    reader.onload = (event) => CSVImport.processFile(at, event.target?.result as string);
  }
}
