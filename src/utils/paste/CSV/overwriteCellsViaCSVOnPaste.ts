import {CategoryCellElement} from '../../../elements/cell/cellsWithTextDiv/categoryCell/categoryCellElement';
import {DateCellInputElement} from '../../../elements/cell/cellsWithTextDiv/dateCell/dateCellInputElement';
import {DATE_COLUMN_TYPE, TEXT_DIV_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from '../../../enums/columnType';
import {CategoryDropdown} from '../../../elements/dropdown/categoryDropdown/categoryDropdown';
import {InsertNewColumn} from '../../insertRemoveStructure/insert/insertNewColumn';
import {InsertNewRow} from '../../insertRemoveStructure/insert/insertNewRow';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellTypeTotalsUtils} from '../../cellType/cellTypeTotalsUtils';
import {DataUtils} from '../../insertRemoveStructure/shared/dataUtils';
import {CaretPosition} from '../../focusedElements/caretPosition';
import {CellElementIndex} from '../../elements/cellElementIndex';
import {TableRow, CellText} from '../../../types/tableContents';
import {CellElement} from '../../../elements/cell/cellElement';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {CellEvents} from '../../../elements/cell/cellEvents';
import {ArrayUtils} from '../../array/arrayUtils';
import {CSVRow, CSV} from '../../../types/CSV';
import {Browser} from '../../browser/browser';

export class OverwriteCellsViaCSVOnPaste {
  // if the data does not fill the 2D array, fill cells with empty strings
  private static createRowDataArrayWithEmptyCells(arrayLength: number, data: CSVRow, dataStartIndex: number) {
    const newRowData = DataUtils.createEmptyStringDataArray(arrayLength);
    newRowData.splice(dataStartIndex, data.length, ...data);
    return newRowData;
  }

  // prettier-ignore
  private static createNewRows(etc: EditableTableComponent, dataForNewRows: CSV, startColumnIndex: number) {
    dataForNewRows.forEach((rowData: CSVRow) => {
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
    const columnDetails = columnsDetails[columnIndex];
    const oldType = CellTypeTotalsUtils.parseType(CellElement.getText(cellElement), columnDetails.types);
    const processedNewCellText = CellEvents.updateCell(
      etc, newCellText, rowIndex, columnIndex, { element: cellElement, updateTableEvent: false });
    if (columnDetails.userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
      CategoryCellElement.finaliseEditedText(etc, cellElement.children[0] as HTMLElement, columnIndex, true);
    } else if (DATE_COLUMN_TYPE[columnDetails.userSetColumnType] && Browser.IS_INPUT_DATE_SUPPORTED) {
      DateCellInputElement.updateInputBasedOnTextDiv(columnDetails.userSetColumnType, cellElement);
    }
    setTimeout(() => {
      // CAUTION-2
      const newType = CellTypeTotalsUtils.parseType(processedNewCellText, columnDetails.types);
      CellTypeTotalsUtils.changeCellTypeAndSetNewColumnType(columnDetails, oldType, newType);
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
    const {userSetColumnType, categoryDropdown: dropdown, settings: {defaultText}} = etc.columnsDetails[columnIndex];
    if (TEXT_DIV_COLUMN_TYPE[userSetColumnType]) {
      const textElement = cellElement.children[0] as HTMLElement;
      CaretPosition.setToEndOfText(etc, textElement);
      if (userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
        CategoryDropdown.updateCategoryDropdown(cellElement, dropdown, defaultText, true);
      }
    } else {
      CaretPosition.setToEndOfText(etc, cellElement);
    }
  }

  // prettier-ignore
  private static processFocusedCell(etc: EditableTableComponent, columnIndex: number) {
    const cellElement = etc.focusedElements.cell.element as HTMLElement;
    const text = CellElement.getText(cellElement);
    etc.focusedElements.cell.type = CellTypeTotalsUtils.parseType(text, etc.columnsDetails[columnIndex].types);
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
