import {NumberOfIdenticalHeaderText} from '../numberOfIdenticalHeaderText';
import {EditableTableComponent} from '../../editable-table-component';
import {TableCellText, TableRow} from '../../types/tableContents';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {CSV} from '../../types/CSV';

export class UpdateCellsViaCSVOnPaste {
  // prettier-ignore
  private static updateCell(rowElement: HTMLElement, rowIndex: number, columnIndex: number, newText: string,
      editableTableComponent: EditableTableComponent) {
    rowElement.children[columnIndex].textContent = newText;
    // not have to re-render the whole table
    editableTableComponent.contents[rowIndex][columnIndex] = newText;
    editableTableComponent.onCellUpdate(newText, rowIndex, columnIndex);
  }

  // prettier-ignore
  private static getNewText(cellText: string, rowIndex: number,
      editableTableComponent: EditableTableComponent): string {
    if (!editableTableComponent.duplicateHeadersAllowed && rowIndex === 0
        && NumberOfIdenticalHeaderText.get(cellText, editableTableComponent.contents[0]) > 0) {
      return editableTableComponent.defaultValue;
    }
    return cellText as string;
  }

  // prettier-ignore
  private static updateColumn(rowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText: TableCellText,
      editableTableComponent: EditableTableComponent) {
    const newText = UpdateCellsViaCSVOnPaste.getNewText(cellText as string, rowIndex, editableTableComponent)
    UpdateCellsViaCSVOnPaste.updateCell(rowElement, rowIndex, columnIndex, newText, editableTableComponent)
  }

  // prettier-ignore
  private static updateRow(row: TableRow, rowIndex: number, columnIndex: number, rowElement: HTMLElement,
      editableTableComponent: EditableTableComponent) {
    row.forEach((cellText: TableCellText, CSVColumnIndex: number) => {
      const relativeColumnIndex = columnIndex + CSVColumnIndex;
      UpdateCellsViaCSVOnPaste.updateColumn(rowElement, rowIndex, relativeColumnIndex, cellText, editableTableComponent)
    });
  }

  // TO-DO create new rows/columns if index exceeds the current amount
  // TO-DO if prediction table - validate what is inserted, type and prevent the creation of new columns
  // (potentially highlight what is failing validation in red and display what the problem is upon hover)
  // training table may not be available and the user may just want to predict with their model
  // which will only allow validation when an error is thrown, catch that error and display
  // prettier-ignore
  private static updateCellsTextUsingCSV(table: HTMLElement, CSV: CSV, rowIndex: number, columnIndex: number,
      editableTableComponent: EditableTableComponent) {
    const headerElement = table.children[0];
    const dataElement = table.children[1];
    CSV.forEach((row: TableRow, CSVRowIndex: number) => {
      const relativeRowIndex = rowIndex + CSVRowIndex;
      const rowElement = relativeRowIndex === 0 ? headerElement.children[0] : dataElement.children[relativeRowIndex - 1];
      UpdateCellsViaCSVOnPaste.updateRow(
        row, relativeRowIndex, columnIndex, rowElement as HTMLElement, editableTableComponent);
    });
    editableTableComponent.onTableUpdate(editableTableComponent.contents);
  }

  // prettier-ignore
  public static update(clipboardText: string, event: ClipboardEvent, rowIndex: number, columnIndex: number,
      editableTableComponent: EditableTableComponent) {
    event.preventDefault();
    const CSV = ParseCSVClipboardText.parse(clipboardText);
    const tableElement = (event.target as HTMLElement).parentElement?.parentElement?.parentElement;
    this.updateCellsTextUsingCSV(tableElement as HTMLElement, CSV, rowIndex, columnIndex, editableTableComponent);
  }

  public static isCSVData(clipboardText: string): boolean {
    return (
      clipboardText.indexOf(ParseCSVClipboardText.NEW_LINE_SYMBOL) > -1 ||
      clipboardText.indexOf(ParseCSVClipboardText.TAB_SYMBOL) > -1
    );
  }
}
