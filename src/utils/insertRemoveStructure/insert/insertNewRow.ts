import {EditableTableComponent} from '../../../editable-table-component';
import {AddNewRowElement} from '../../../elements/row/addNewRowElement';
import {TableCellText, TableRow} from '../../../types/tableContents';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {UpdateCellsForRows} from '../update/updateCellsForRows';
import {ElementDetails} from '../../../types/elementDetails';
import {RowElement} from '../../../elements/row/rowElement';
import {MaximumColumns} from './maximumColumns';
import {InsertNewCell} from './insertNewCell';
import {DataUtils} from '../shared/dataUtils';
import {MaximumRows} from './maximumRows';

export class InsertNewRow {
  private static fireCellUpdates(etc: EditableTableComponent, rowIndex: number) {
    const lastRowIndex = etc.contents.length - 1;
    const lastDataRowElement = etc.tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    const lastRowDetails: ElementDetails = {element: lastDataRowElement, index: lastRowIndex};
    UpdateCellsForRows.rebindAndFireUpdates(etc, rowIndex, CELL_UPDATE_TYPE.ADD, lastRowDetails);
    etc.onTableUpdate(etc.contents);
  }

  private static canStartRenderCellBeAdded(etc: EditableTableComponent, rowIndex: number, columnIndex: number) {
    if (rowIndex === 0) {
      return MaximumColumns.canAddMore(etc);
    }
    return etc.columnsDetails[columnIndex];
  }

  // prettier-ignore
  private static addCells(etc: EditableTableComponent,
      newRowData: TableRow, newRowElement: HTMLElement, rowIndex: number, isNewText: boolean) {
    newRowData.forEach((cellText: TableCellText, columnIndex: number) => {
      if (isNewText || InsertNewRow.canStartRenderCellBeAdded(etc, rowIndex, columnIndex)) {
        InsertNewCell.insertToRow(etc, newRowElement, rowIndex, columnIndex, cellText as string, isNewText);
      }
    });
  }

  private static insertNewRow(etc: EditableTableComponent, rowIndex: number, isNewText: boolean, rowData?: TableRow) {
    const newRowData = rowData || DataUtils.createDataArray(etc.contents[0]?.length || 1, etc.defaultCellValue);
    const newRowElement = RowElement.create();
    etc.tableBodyElementRef?.insertBefore(newRowElement, etc.tableBodyElementRef.children[rowIndex]);
    // don't need a timeout as addition of row with new text is not expensive
    if (isNewText) etc.contents.splice(rowIndex, 0, []);
    InsertNewRow.addCells(etc, newRowData, newRowElement, rowIndex, isNewText);
    return newRowElement;
  }

  // isNewText indicates whether rowData is already in the contents state or if it needs to be added
  public static insert(etc: EditableTableComponent, rowIndex: number, isNewText: boolean, rowData?: TableRow) {
    if (!MaximumRows.canAddMore(etc)) return;
    InsertNewRow.insertNewRow(etc, rowIndex, isNewText, rowData);
    setTimeout(() => {
      if (isNewText) {
        AddNewRowElement.toggle(etc);
        InsertNewRow.fireCellUpdates(etc, rowIndex);
      }
    });
  }

  public static insertEvent(this: EditableTableComponent) {
    InsertNewRow.insert(this, this.contents.length, true);
  }
}
