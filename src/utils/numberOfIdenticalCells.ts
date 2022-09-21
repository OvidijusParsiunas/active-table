import {TableCellText, TableRow} from '../types/tableContents';

export class NumberOfIdenticalCells {
  public static get(targetText: string, tableRow: TableRow) {
    return tableRow.filter((cellText: TableCellText) => cellText === targetText).length;
  }
}
