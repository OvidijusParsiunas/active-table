import {EditableTableComponent} from '../../../editable-table-component';
import {UpdateCellsForColumns} from '../update/updateCellsForColumns';
import {FocusedCellUtils} from '../../focusedCell/focusedCellUtils';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';
import {TableRow} from '../../../types/tableContents';
import {LastColumn} from '../shared/lastColumn';
import {InsertNewCell} from './insertNewCell';

export class InsertNewColumn {
  // prettier-ignore
  private static updateColumns(
      etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const rowDetails: ElementDetails = { element: rowElement, index: rowIndex };
    const lastColumn: ElementDetails = LastColumn.getDetails(rowElement);
    UpdateCellsForColumns.rebindAndFireUpdates(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.ADD, lastColumn);
  }

  private static insertToAllRows(etc: EditableTableComponent, columnIndex: number, columnData?: TableRow) {
    const rowElements = ExtractElements.textRowsArrFromTBody(etc.tableBodyElementRef as HTMLElement, etc.contents);
    rowElements.forEach((rowElement: Node, rowIndex: number) => {
      const cellText = columnData ? columnData[rowIndex] : etc.defaultCellValue;
      InsertNewCell.insertToRow(etc, rowElement as HTMLElement, rowIndex, columnIndex, cellText as string, true);
      // TO-DO - potentially display all the time
      setTimeout(() => InsertNewColumn.updateColumns(etc, rowElement as HTMLElement, rowIndex, columnIndex));
    });
  }

  // columnData is in a row format to populate the column by iterating through each row
  public static insert(etc: EditableTableComponent, columnIndex: number, columnData?: TableRow) {
    FocusedCellUtils.incrementColumnIndex(etc.focusedCell, columnIndex);
    InsertNewColumn.insertToAllRows(etc, columnIndex, columnData);
    setTimeout(() => etc.onTableUpdate(etc.contents));
  }

  public static insertEvent(this: EditableTableComponent, columnIndex: number) {
    InsertNewColumn.insert(this, columnIndex);
  }
}
