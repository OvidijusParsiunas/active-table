import {InsertNewColumn} from '../insertRemoveStructure/insert/insertNewColumn';
import {InsertNewRow} from '../insertRemoveStructure/insert/insertNewRow';
import {CellTypeTotalsUtils} from '../cellTypeTotals/cellTypeTotalsUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {DataUtils} from '../insertRemoveStructure/shared/dataUtils';
import {TableCellText, TableRow} from '../../types/tableContents';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {CellEvents} from '../../elements/cell/cellEvents';
import {ArrayUtils} from '../array/arrayUtils';
import {CSV, CSVRow} from '../../types/CSV';

export class OverwriteCellsViaCSVOnPaste {
  // if the data array does not fill the full structure, fill cells with the default value
  // prettier-ignore
  private static createDataArrayWithDefaultCells(
      arrayLength: number, defaultValue: string, data: CSVRow, dataStartIndex: number) {
    const newRowData = DataUtils.createDataArray(arrayLength, defaultValue);
    newRowData.splice(dataStartIndex, data.length, ...data);
    return newRowData;
  }

  // prettier-ignore
  private static createNewRows(etc: EditableTableComponent, dataForNewRows: CSV, startColumnIndex: number) {
    dataForNewRows.forEach((rowData: CSVRow) => {
      const newRowData = OverwriteCellsViaCSVOnPaste.createDataArrayWithDefaultCells(
        etc.contents[0].length, etc.defaultCellValue, rowData, startColumnIndex);
      InsertNewRow.insert(etc, etc.contents.length, true, newRowData);
    });
  }

  // prettier-ignore
  private static createNewColumns(etc: EditableTableComponent, dataForNewColumnsByRow: CSV, startRowIndex: number) {
    const dataForNewColumnsByColumn = ArrayUtils.transpose(dataForNewColumnsByRow);
    dataForNewColumnsByColumn.forEach((columnData: CSVRow) => {
      const newColumnData = OverwriteCellsViaCSVOnPaste.createDataArrayWithDefaultCells(
        etc.contents.length, etc.defaultCellValue, columnData, startRowIndex);
      InsertNewColumn.insert(etc, etc.contents[0].length, newColumnData);
    });
  }

  // prettier-ignore
  private static overwriteCell(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, newCellText: string) {
    // the reason why columnIndex is multiplied by 2 is because there is a divider element after each cell
    const cellElement = rowElement.children[columnIndex * 2] as HTMLElement;
    const oldType = CellTypeTotalsUtils.parseType(cellElement.textContent as string, etc.defaultCellValue);
    CellEvents.updateCell(etc, newCellText, rowIndex, columnIndex, { element: cellElement, updateTableEvent: false });
    setTimeout(() => {
      const newType = CellTypeTotalsUtils.parseType(newCellText, etc.defaultCellValue);
      CellTypeTotalsUtils.changeCellTypeAndSetNewColumnType(etc.columnsDetails[columnIndex], oldType, newType);
    });
  }

  // prettier-ignore
  private static overwriteRowData(etc: EditableTableComponent,
      row: TableRow, rowIndex: number, columnIndex: number, rowElement: HTMLElement) {
    row.forEach((cellText: TableCellText, CSVColumnIndex: number) => {
      const relativeColumnIndex = columnIndex + CSVColumnIndex;
      OverwriteCellsViaCSVOnPaste.overwriteCell(etc, rowElement, rowIndex, relativeColumnIndex, cellText as string);
    });
  }

  private static setFocusedCellType(etc: EditableTableComponent, cellText: string) {
    etc.focusedCell.type = CellTypeTotalsUtils.parseType(cellText, etc.defaultCellValue);
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
    setTimeout(() => OverwriteCellsViaCSVOnPaste.setFocusedCellType(etc, dataToOverwriteRows[0][0]));
    return dataForNewColumns;
  }

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
    OverwriteCellsViaCSVOnPaste.overwriteCellsTextUsingCSV(etc, CSV, rowIndex, columnIndex);
  }

  public static isCSVData(clipboardText: string): boolean {
    return (
      clipboardText.indexOf(ParseCSVClipboardText.NEW_LINE_SYMBOL) > -1 ||
      clipboardText.indexOf(ParseCSVClipboardText.TAB_SYMBOL) > -1
    );
  }
}
