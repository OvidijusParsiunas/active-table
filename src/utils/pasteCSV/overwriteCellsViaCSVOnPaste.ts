import {InsertNewColumn} from '../insertRemoveStructure/insert/insertNewColumn';
import {InsertNewRow} from '../insertRemoveStructure/insert/insertNewRow';
import {EditableTableComponent} from '../../editable-table-component';
import {DataUtils} from '../insertRemoveStructure/shared/dataUtils';
import {TableCellText, TableRow} from '../../types/tableContents';
import {NumberOfIdenticalCells} from '../numberOfIdenticalCells';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {ArrayUtils} from '../array/arrayUtils';
import {CSV, CSVRow} from '../../types/CSV';

export class OverwriteCellsViaCSVOnPaste {
  // if the data array does not fill the full structure, fill cells with the default value
  private static createDataArrayWithDefaultCells(etc: EditableTableComponent, data: CSVRow, dataStartIndex: number) {
    const newRowData = DataUtils.createDataArray(etc.contents[0].length, etc.defaultCellValue);
    newRowData.splice(dataStartIndex, data.length, ...data);
    return newRowData;
  }

  private static createNewRows(etc: EditableTableComponent, dataForNewRows: CSV, startColumnIndex: number) {
    dataForNewRows.forEach((rowData: CSVRow) => {
      const newRowData = OverwriteCellsViaCSVOnPaste.createDataArrayWithDefaultCells(etc, rowData, startColumnIndex);
      InsertNewRow.insert(etc, etc.contents.length, true, newRowData);
    });
  }

  private static createNewColumns(etc: EditableTableComponent, dataForNewColumnsByRow: CSV, startRowIndex: number) {
    const dataForNewColumnsByColumn = ArrayUtils.transpose(dataForNewColumnsByRow);
    dataForNewColumnsByColumn.forEach((columnData: CSVRow) => {
      const newColumnData = OverwriteCellsViaCSVOnPaste.createDataArrayWithDefaultCells(etc, columnData, startRowIndex);
      InsertNewColumn.insert(etc, etc.contents[0].length, newColumnData);
    });
  }

  // prettier-ignore
  private static overwriteCell(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, newCellText: string) {
    // the reason why columnIndex is multiplied by 2 is because there is a divider element after each cell
    rowElement.children[columnIndex * 2].textContent = newCellText;
    etc.contents[rowIndex][columnIndex] = newCellText;
    etc.onCellUpdate(newCellText, rowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
  }

  private static getNewCellText(cellText: string, rowIndex: number, etc: EditableTableComponent): string {
    if (!etc.duplicateHeadersAllowed && rowIndex === 0 && NumberOfIdenticalCells.get(cellText, etc.contents[0]) > 0) {
      return etc.defaultCellValue;
    }
    return cellText as string;
  }

  // prettier-ignore
  private static overwriteRowData(etc: EditableTableComponent,
      row: TableRow, rowIndex: number, columnIndex: number, rowElement: HTMLElement) {
    row.forEach((cellText: TableCellText, CSVColumnIndex: number) => {
      const relativeColumnIndex = columnIndex + CSVColumnIndex;
      const newCellText = OverwriteCellsViaCSVOnPaste.getNewCellText(cellText as string, rowIndex, etc);
      OverwriteCellsViaCSVOnPaste.overwriteCell(etc, rowElement, rowIndex, relativeColumnIndex, newCellText);
    });
  }

  // prettier-ignore
  private static overwriteExistingCells(
      etc: EditableTableComponent, dataToOverwriteRows: CSV, startRowIndex: number, startColumnIndex: number) {
    const dataForNewColumns: CSV = [];
    dataToOverwriteRows.forEach((dataToOverwriteRow: CSVRow, CSVRowIndex: number) => {
      const relativeRowIndex = startRowIndex + CSVRowIndex;
      const rowElement = etc.tableBodyElementRef?.children[relativeRowIndex] as HTMLElement;
      const numberOfCellsToOverwrite = etc.contents[0].length - startColumnIndex;
      const overwriteData = dataToOverwriteRow.slice(0, numberOfCellsToOverwrite);
      OverwriteCellsViaCSVOnPaste.overwriteRowData(etc, overwriteData, relativeRowIndex, startColumnIndex, rowElement);
      const overflowData = dataToOverwriteRow.slice(numberOfCellsToOverwrite);
      dataForNewColumns.push(overflowData);
    });
    return dataForNewColumns;
  }

  // TO-DO create new rows/columns if index exceeds the current amount
  // (potentially highlight what is failing validation in red and display what the problem is upon hover)
  // prettier-ignore
  private static overwriteCellsTextUsingCSV(
      etc: EditableTableComponent, CSV: CSV, startRowIndex: number, startColumnIndex: number) {
    const numberOfRowsToOverwrite = etc.contents.length - startRowIndex;
    const dataToOverwriteRows = CSV.slice(0, numberOfRowsToOverwrite);
    // the reason why new columns are not created when the existing cells are overwritten is because the creation of new
    // columns allows new column data to be defined - which is gathered after traversing all dataToOverwriteRows
    const dataForNewColumnsByRow = OverwriteCellsViaCSVOnPaste.overwriteExistingCells(
      etc, dataToOverwriteRows, startRowIndex, startColumnIndex);
    OverwriteCellsViaCSVOnPaste.createNewColumns(etc, dataForNewColumnsByRow, startRowIndex);
    const dataForNewRows = CSV.slice(numberOfRowsToOverwrite);
    OverwriteCellsViaCSVOnPaste.createNewRows(etc, dataForNewRows, startColumnIndex);
    etc.onTableUpdate(etc.contents);
  }

  // prettier-ignore
  public static overwrite(etc: EditableTableComponent,
      clipboardText: string, event: ClipboardEvent, rowIndex: number, columnIndex: number,) {
    event.preventDefault();
    const CSV = ParseCSVClipboardText.parse(clipboardText);
    this.overwriteCellsTextUsingCSV(etc, CSV, rowIndex, columnIndex);
  }

  public static isCSVData(clipboardText: string): boolean {
    return (
      clipboardText.indexOf(ParseCSVClipboardText.NEW_LINE_SYMBOL) > -1 ||
      clipboardText.indexOf(ParseCSVClipboardText.TAB_SYMBOL) > -1
    );
  }
}
