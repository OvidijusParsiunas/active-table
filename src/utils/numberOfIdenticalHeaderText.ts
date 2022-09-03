import {TableCellText, TableRow} from '../types/tableContents';

export class NumberOfIdenticalHeaderText {
  public static get(targetHeaderText: string, headerRow: TableRow) {
    return headerRow.slice(0).filter((headerText: TableCellText) => headerText === targetHeaderText).length;
  }
}
