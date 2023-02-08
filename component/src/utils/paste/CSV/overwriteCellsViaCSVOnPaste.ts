import {DateCellInputElement} from '../../../elements/cell/cellsWithTextDiv/dateCell/dateCellInputElement';
import {SelectCell} from '../../../elements/cell/cellsWithTextDiv/selectCell/selectCell';
import {InsertNewColumn} from '../../insertRemoveStructure/insert/insertNewColumn';
import {CellDropdown} from '../../../elements/dropdown/cellDropdown/cellDropdown';
import {InsertNewRow} from '../../insertRemoveStructure/insert/insertNewRow';
import {ColumnSettingsUtils} from '../../columnSettings/columnSettingsUtils';
import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {DataUtils} from '../../insertRemoveStructure/shared/dataUtils';
import {CaretPosition} from '../../focusedElements/caretPosition';
import {CellElementIndex} from '../../elements/cellElementIndex';
import {TableRow, CellText} from '../../../types/tableContent';
import {CellElement} from '../../../elements/cell/cellElement';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {CellEvents} from '../../../elements/cell/cellEvents';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {FocusedCell} from '../../../types/focusedCell';
import {ArrayUtils} from '../../array/arrayUtils';
import {EMPTY_STRING} from '../../../consts/text';
import {ActiveTable} from '../../../activeTable';
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
  private static createNewRows(at: ActiveTable, dataForNewRows: CSV, startColumnIndex: number) {
    const processedDataForNewRows = OverwriteCellsViaCSVOnPaste.removeDataThatIsNotEditableFromNewRows(at.columnsDetails,
      dataForNewRows, startColumnIndex);
    processedDataForNewRows.forEach((rowData: CSVRow) => {
      const newRowData = OverwriteCellsViaCSVOnPaste.createRowDataArrayWithEmptyCells(
        at.content[0].length, rowData, startColumnIndex);
      InsertNewRow.insert(at, at.content.length, true, newRowData);
    });
  }

  private static changeColumnSettings(at: ActiveTable, columnIndex: number) {
    const {elements} = at.columnsDetails[columnIndex];
    FocusedCellUtils.set(at.focusedElements.cell, elements[0], 0, columnIndex);
    ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(at, elements[0], columnIndex);
  }

  private static processNewColumn(at: ActiveTable) {
    const lastColumnIndex = at.columnsDetails.length - 1;
    CellEvents.setCellToDefaultIfNeeded(at, 0, lastColumnIndex, at.columnsDetails[lastColumnIndex].elements[0], false);
    OverwriteCellsViaCSVOnPaste.changeColumnSettings(at, lastColumnIndex);
  }

  // prettier-ignore
  private static createNewColumns(at: ActiveTable, dataForNewColumnsByRow: CSV, startRowIndex: number) {
    const dataForNewColumnsByColumn = ArrayUtils.transpose(dataForNewColumnsByRow);
    dataForNewColumnsByColumn.forEach((columnData: CSVRow) => {
      const newColumnData = OverwriteCellsViaCSVOnPaste.createRowDataArrayWithEmptyCells(
        at.content.length, columnData, startRowIndex);
      InsertNewColumn.insert(at, at.content[0].length, newColumnData);
      OverwriteCellsViaCSVOnPaste.processNewColumn(at);
    });
  }

  // prettier-ignore
  private static overwriteCell(at: ActiveTable,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, newCellText: string) {
    const {frameComponentsInternal: {displayIndexColumn}, columnsDetails} = at;
    const elementIndex = CellElementIndex.getViaColumnIndex(columnIndex, !!displayIndexColumn);
    const cellElement = rowElement.children[elementIndex] as HTMLElement;
    const columnDetails = columnsDetails[columnIndex];
    if ((rowIndex === 0 && !columnDetails.settings.isHeaderTextEditable)
      || rowIndex > 0 && !columnDetails.settings.isCellTextEditable) return;
     // this is to allow duplicate headers to be identified
    if (rowIndex === 0) CellElement.setNewText(at, cellElement, newCellText, false, false);
    CellEvents.updateCell(at, newCellText, rowIndex, columnIndex, { element: cellElement, updateTableEvent: false });
    if (columnDetails.activeType.cellDropdownProps) {
      SelectCell.finaliseEditedText(at, cellElement.children[0] as HTMLElement, columnIndex, true);
    } else if (Browser.IS_INPUT_DATE_SUPPORTED && columnDetails.activeType.calendar) {
      DateCellInputElement.updateInputBasedOnTextDiv(cellElement, columnDetails.activeType);
    }
    if (rowIndex === 0) OverwriteCellsViaCSVOnPaste.changeColumnSettings(at, columnIndex);
  }

  // prettier-ignore
  private static overwriteRowData(at: ActiveTable,
      row: TableRow, rowIndex: number, columnIndex: number, rowElement: HTMLElement) {
    row.forEach((cellText: CellText, CSVColumnIndex: number) => {
      const relativeColumnIndex = columnIndex + CSVColumnIndex;
      OverwriteCellsViaCSVOnPaste.overwriteCell(at, rowElement, rowIndex, relativeColumnIndex, cellText as string);
    });
  }

  // prettier-ignore
  private static setCaretToEndAndHighlightIfSelect(at: ActiveTable, cellElement: HTMLElement, columnIndex: number) {
    const {activeType, cellDropdown, settings: {defaultText}} = at.columnsDetails[columnIndex];
    CaretPosition.setToEndOfText(at, cellElement);
    if (activeType.cellDropdownProps) {
      CellDropdown.updateCellDropdown(cellElement, cellDropdown, at.tableDimensions.border, defaultText, true);
    }
  }

  // prettier-ignore
  private static overwriteExistingCells(
      at: ActiveTable, dataToOverwriteRows: CSV, startRowIndex: number, startColumnIndex: number) {
    const dataForNewColumns: CSV = [];
    dataToOverwriteRows.forEach((dataToOverwriteRow: CSVRow, CSVRowIndex: number) => {
      const relativeRowIndex = startRowIndex + CSVRowIndex;
      const rowElement = at.tableBodyElementRef?.children[relativeRowIndex] as HTMLElement;
      const numberOfCellsToOverwrite = at.content[0].length - startColumnIndex;
      const overwriteData = dataToOverwriteRow.slice(0, numberOfCellsToOverwrite);
      OverwriteCellsViaCSVOnPaste.overwriteRowData(at, overwriteData, relativeRowIndex, startColumnIndex, rowElement);
      const overflowData = dataToOverwriteRow.slice(numberOfCellsToOverwrite);
      dataForNewColumns.push(overflowData);
    });
    const focusedElement = at.focusedElements.cell.element as HTMLElement; // REF-15
    setTimeout(() => OverwriteCellsViaCSVOnPaste.setCaretToEndAndHighlightIfSelect(at, focusedElement, startColumnIndex));
    return dataForNewColumns;
  }

  // no new rows should be created if no columns that are to be overwritten/created allow text edit
  private static canNewRowsBeCreated(at: ActiveTable, CSV: CSV, startColumnIndex: number) {
    return at.columnsDetails
      .slice(startColumnIndex, startColumnIndex + CSV[0].length)
      .find((columnDetails) => columnDetails.settings.isCellTextEditable);
  }

  private static insertColumnsInsideIfCantInsertRight(at: ActiveTable, CSV: CSV, startColumnIndex: number) {
    const columnsToBeOverwritten = at.columnsDetails.slice(startColumnIndex);
    const indexOfNoRightInsertionColumn = columnsToBeOverwritten.findIndex((columnDetails) => {
      return columnDetails.settings.columnDropdown.isInsertRightAvailable === false;
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
        InsertNewColumn.insert(at, startColumnIndex + indexOfNoRightInsertionColumn);
      }
    }
  }

  // prettier-ignore
  private static overwriteCellsTextUsingCSV(at: ActiveTable, CSV: CSV, startRowIndex: number, startColumnIndex: number) {
    const numberOfRowsToOverwrite = at.content.length - startRowIndex;
    OverwriteCellsViaCSVOnPaste.insertColumnsInsideIfCantInsertRight(at, CSV, startColumnIndex);
    const dataToOverwriteRows = CSV.slice(0, numberOfRowsToOverwrite);
    // the reason why new columns are not created when the existing cells are overwritten is because the creation of new
    // columns allows new column data to be defined - which is gathered after traversing all dataToOverwriteRows
    const dataForNewColumnsByRow = OverwriteCellsViaCSVOnPaste.overwriteExistingCells(
      at, dataToOverwriteRows, startRowIndex, startColumnIndex);
    OverwriteCellsViaCSVOnPaste.createNewColumns(at, dataForNewColumnsByRow, startRowIndex);
    if (!OverwriteCellsViaCSVOnPaste.canNewRowsBeCreated(at, CSV, startColumnIndex)) return;
    const dataForNewRows = CSV.slice(numberOfRowsToOverwrite);
    OverwriteCellsViaCSVOnPaste.createNewRows(at, dataForNewRows, startColumnIndex);
    setTimeout(() => at.onContentUpdate(JSON.parse(JSON.stringify(at.content))));
  }

  private static focusOriginalCellAfterProcess(at: ActiveTable, process: () => void) {
    const {element, rowIndex, columnIndex} = at.focusedElements.cell as Required<FocusedCell>;
    process();
    FocusedCellUtils.set(at.focusedElements.cell, element, rowIndex, columnIndex);
  }

  // prettier-ignore
  public static overwrite(at: ActiveTable,
      clipboardText: string, event: ClipboardEvent, rowIndex: number, columnIndex: number,) {
    event.preventDefault();
    const CSV = ParseCSVClipboardText.parse(clipboardText);
    OverwriteCellsViaCSVOnPaste.focusOriginalCellAfterProcess(at,
      OverwriteCellsViaCSVOnPaste.overwriteCellsTextUsingCSV.bind(this, at, CSV, rowIndex, columnIndex));
  }

  public static isCSVData(clipboardText: string): boolean {
    return (
      clipboardText.indexOf(ParseCSVClipboardText.NEW_LINE_SYMBOL) > -1 ||
      clipboardText.indexOf(ParseCSVClipboardText.TAB_SYMBOL) > -1
    );
  }
}
