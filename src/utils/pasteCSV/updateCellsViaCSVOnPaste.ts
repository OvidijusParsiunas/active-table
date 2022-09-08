import {EditableTableComponent} from '../../editable-table-component';
import {TableCellText, TableRow} from '../../types/tableContents';
import {NumberOfIdenticalCells} from '../numberOfIdenticalCells';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {CSV} from '../../types/CSV';

export class UpdateCellsViaCSVOnPaste {
  // prettier-ignore
  private static updateCell(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, newText: string) {
    rowElement.children[columnIndex].textContent = newText;
    // not have to re-render the whole table
    etc.contents[rowIndex][columnIndex] = newText;
    etc.onCellUpdate(newText, rowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
  }

  private static getNewText(cellText: string, rowIndex: number, etc: EditableTableComponent): string {
    if (!etc.duplicateHeadersAllowed && rowIndex === 0 && NumberOfIdenticalCells.get(cellText, etc.contents[0]) > 0) {
      return etc.defaultCellValue;
    }
    return cellText as string;
  }

  // prettier-ignore
  private static updateColumn(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText: TableCellText) {
    const newText = UpdateCellsViaCSVOnPaste.getNewText(cellText as string, rowIndex, etc)
    UpdateCellsViaCSVOnPaste.updateCell(etc, rowElement, rowIndex, columnIndex, newText)
  }

  // prettier-ignore
  private static updateRow(etc: EditableTableComponent,
      row: TableRow, rowIndex: number, columnIndex: number, rowElement: HTMLElement) {
    row.forEach((cellText: TableCellText, CSVColumnIndex: number) => {
      const relativeColumnIndex = columnIndex + CSVColumnIndex;
      UpdateCellsViaCSVOnPaste.updateColumn(etc, rowElement, rowIndex, relativeColumnIndex, cellText)
    });
  }

  // TO-DO create new rows/columns if index exceeds the current amount
  // TO-DO if prediction table - validate what is inserted, type and prevent the creation of new columns
  // (potentially highlight what is failing validation in red and display what the problem is upon hover)
  // training table may not be available and the user may just want to predict with their model
  // which will only allow validation when an error is thrown, catch that error and display
  // prettier-ignore
  private static updateCellsTextUsingCSV(etc: EditableTableComponent,
      table: HTMLElement, CSV: CSV, rowIndex: number, columnIndex: number,) {
    const headerElement = table.children[0];
    const dataElement = table.children[1];
    CSV.forEach((row: TableRow, CSVRowIndex: number) => {
      const relativeRowIndex = rowIndex + CSVRowIndex;
      const rowElement = relativeRowIndex === 0 ? headerElement.children[0] : dataElement.children[relativeRowIndex - 1];
      UpdateCellsViaCSVOnPaste.updateRow(etc, row, relativeRowIndex, columnIndex, rowElement as HTMLElement);
    });
    etc.onTableUpdate(etc.contents);
  }

  // prettier-ignore
  public static update(etc: EditableTableComponent,
      clipboardText: string, event: ClipboardEvent, rowIndex: number, columnIndex: number,) {
    event.preventDefault();
    const CSV = ParseCSVClipboardText.parse(clipboardText);
    const tableElement = (event.target as HTMLElement).parentElement?.parentElement?.parentElement;
    this.updateCellsTextUsingCSV(etc, tableElement as HTMLElement, CSV, rowIndex, columnIndex);
  }

  public static isCSVData(clipboardText: string): boolean {
    return (
      clipboardText.indexOf(ParseCSVClipboardText.NEW_LINE_SYMBOL) > -1 ||
      clipboardText.indexOf(ParseCSVClipboardText.TAB_SYMBOL) > -1
    );
  }
}
