import {CategoryCellElement} from '../../../elements/cell/cellsWithTextDiv/categoryCell/categoryCellElement';
import {DateCellInputElement} from '../../../elements/cell/cellsWithTextDiv/dateCell/dateCellInputElement';
import {CategoryDropdown} from '../../../elements/dropdown/categoryDropdown/categoryDropdown';
import {InsertNewColumn} from '../../insertRemoveStructure/insert/insertNewColumn';
import {InsertNewRow} from '../../insertRemoveStructure/insert/insertNewRow';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellTypeTotalsUtils} from '../../columnType/cellTypeTotalsUtils';
import {DataUtils} from '../../insertRemoveStructure/shared/dataUtils';
import {CaretPosition} from '../../focusedElements/caretPosition';
import {CellElementIndex} from '../../elements/cellElementIndex';
import {TableRow, CellText} from '../../../types/tableContents';
import {CellElement} from '../../../elements/cell/cellElement';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {CellEvents} from '../../../elements/cell/cellEvents';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {ArrayUtils} from '../../array/arrayUtils';
import {EMPTY_STRING} from '../../../consts/text';
import {CSVRow, CSV} from '../../../types/CSV';
import {Browser} from '../../browser/browser';

export class OverwriteCellsViaCSVOnPaste {
  // prettier-ignore
  private static removeDataThatIsNotEditableFromNewRows(columnsDetails: ColumnsDetailsT, dataForNewRows: CSV,
      startColumnIndex: number) {
    const existingColumnsToCheck = columnsDetails.slice(startColumnIndex);
    existingColumnsToCheck.forEach((columnDetails, colIndex) => {
      if (!columnDetails.settings.isCellTextEditable) dataForNewRows.forEach((dataRow) => {
        dataRow[colIndex] = EMPTY_STRING;
      });
    });
    return dataForNewRows;
  }

  // if the data does not fill the 2D array, fill cells with empty strings
  private static createRowDataArrayWithEmptyCells(arrayLength: number, data: CSVRow, dataStartIndex: number) {
    const newRowData = DataUtils.createEmptyStringDataArray(arrayLength);
    newRowData.splice(dataStartIndex, data.length, ...data);
    return newRowData;
  }

  // prettier-ignore
  private static createNewRows(etc: EditableTableComponent, dataForNewRows: CSV, startColumnIndex: number) {
    const processedDataForNewRows = OverwriteCellsViaCSVOnPaste.removeDataThatIsNotEditableFromNewRows(etc.columnsDetails,
      dataForNewRows, startColumnIndex);
    processedDataForNewRows.forEach((rowData: CSVRow) => {
      const newRowData = OverwriteCellsViaCSVOnPaste.createRowDataArrayWithEmptyCells(
        etc.contents[0].length, rowData, startColumnIndex);
      InsertNewRow.insert(etc, etc.contents.length, true, newRowData);
    });
  }

  // prettier-ignore
  private static createNewColumns(etc: EditableTableComponent, dataForNewColumnsByRow: CSV, startRowIndex: number) {
    const dataForNewColumnsByColumn = ArrayUtils.transpose(dataForNewColumnsByRow);
    dataForNewColumnsByColumn.forEach((columnData: CSVRow) => {
      const newColumnData = OverwriteCellsViaCSVOnPaste.createRowDataArrayWithEmptyCells(
        etc.contents.length, columnData, startRowIndex);
      InsertNewColumn.insert(etc, etc.contents[0].length, newColumnData);
    });
  }

  // prettier-ignore
  private static overwriteCell(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, newCellText: string) {
    const {auxiliaryTableContentInternal: {displayIndexColumn}, columnsDetails} = etc;
    const elementIndex = CellElementIndex.getViaColumnIndex(columnIndex, displayIndexColumn);
    const cellElement = rowElement.children[elementIndex] as HTMLElement;
    if (cellElement.contentEditable === 'false') return;
    const columnDetails = columnsDetails[columnIndex];
    const oldType = CellTypeTotalsUtils.parseTypeName(CellElement.getText(cellElement), columnDetails.types);
    const processedNewCellText = CellEvents.updateCell(
      etc, newCellText, rowIndex, columnIndex, { element: cellElement, updateTableEvent: false });
    if (columnDetails.activeType.categories) {
      CategoryCellElement.finaliseEditedText(etc, cellElement.children[0] as HTMLElement, columnIndex, true);
    } else if (Browser.IS_INPUT_DATE_SUPPORTED && columnDetails.activeType.calendar) {
      DateCellInputElement.updateInputBasedOnTextDiv(cellElement, columnDetails.activeType);
    }
    setTimeout(() => {
      // CAUTION-2
      const newType = CellTypeTotalsUtils.parseTypeName(processedNewCellText, columnDetails.types);
      CellTypeTotalsUtils.changeCellType(columnDetails, oldType, newType);
    });
  }

  // prettier-ignore
  private static overwriteRowData(etc: EditableTableComponent,
      row: TableRow, rowIndex: number, columnIndex: number, rowElement: HTMLElement) {
    row.forEach((cellText: CellText, CSVColumnIndex: number) => {
      const relativeColumnIndex = columnIndex + CSVColumnIndex;
      OverwriteCellsViaCSVOnPaste.overwriteCell(etc, rowElement, rowIndex, relativeColumnIndex, cellText as string);
    });
  }

  // prettier-ignore
  private static setCaretToEndAndHighlightIfCategory(etc: EditableTableComponent, cellElement: HTMLElement,
      columnIndex: number) {
    const {activeType, categoryDropdown, settings: {defaultText}} = etc.columnsDetails[columnIndex];
    CaretPosition.setToEndOfText(etc, cellElement);
    if (activeType.categories) {
      CategoryDropdown.updateCategoryDropdown(cellElement, categoryDropdown, defaultText, true);
    }
  }

  // prettier-ignore
  private static processFocusedCell(etc: EditableTableComponent, columnIndex: number) {
    const cellElement = etc.focusedElements.cell.element as HTMLElement;
    const text = CellElement.getText(cellElement);
    etc.focusedElements.cell.typeName = CellTypeTotalsUtils.parseTypeName(text, etc.columnsDetails[columnIndex].types);
    OverwriteCellsViaCSVOnPaste.setCaretToEndAndHighlightIfCategory(etc, cellElement, columnIndex);
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
    setTimeout(() => OverwriteCellsViaCSVOnPaste.processFocusedCell(etc, startColumnIndex));
    return dataForNewColumns;
  }

  private static insertColumnsInsideIfCantInsertRight(etc: EditableTableComponent, CSV: CSV, startColumnIndex: number) {
    const columnsToBeOverwritten = etc.columnsDetails.slice(startColumnIndex);
    const indexOfNoRightInsertionColumn = columnsToBeOverwritten.findIndex((columnDetails) => {
      return columnDetails.settings.isInsertRightAvailable === false;
    });
    // if can insert right for all proceeding, no need to augment csv or table
    if (indexOfNoRightInsertionColumn === -1) return;
    if (indexOfNoRightInsertionColumn === 0) {
      // if the currently pasted on column does not allow right insertion, only overwrite the existing column's cells
      // this augments the CSV object to contain data for the first column
      CSV.forEach((row) => row.splice(1, row.length - 1));
    } else {
      // insert new columns before the column that has no right insertion and also overwrite that column's cells
      const numberOfColumnsToBeInserted = CSV[0].length - (indexOfNoRightInsertionColumn + 1);
      for (let i = 0; i < numberOfColumnsToBeInserted; i += 1) {
        InsertNewColumn.insert(etc, startColumnIndex + indexOfNoRightInsertionColumn);
      }
    }
  }

  // prettier-ignore
  private static overwriteCellsTextUsingCSV(
      etc: EditableTableComponent, CSV: CSV, startRowIndex: number, startColumnIndex: number) {
    const numberOfRowsToOverwrite = etc.contents.length - startRowIndex;
    OverwriteCellsViaCSVOnPaste.insertColumnsInsideIfCantInsertRight(etc, CSV, startColumnIndex);
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
