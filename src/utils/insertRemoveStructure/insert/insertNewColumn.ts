import {EditableTableComponent} from '../../../editable-table-component';
import {UpdateCellsForColumns} from '../update/updateCellsForColumns';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';
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

  private static insertToAllRows(etc: EditableTableComponent, columnIndex: number) {
    const rowElements = ExtractElements.textRowsArrFromTBody(etc.tableBodyElementRef as HTMLElement, etc.contents);
    rowElements.forEach((rowElement: Node, rowIndex: number) => {
      InsertNewCell.insertToRow(etc, rowElement as HTMLElement, rowIndex, columnIndex, etc.defaultCellValue, true);
      // TO-DO - potentially display all the time
      setTimeout(() => InsertNewColumn.updateColumns(etc, rowElement as HTMLElement, rowIndex, columnIndex));
    });
  }

  public static insert(etc: EditableTableComponent, columnIndex: number) {
    InsertNewColumn.insertToAllRows(etc, columnIndex);
    setTimeout(() => etc.onTableUpdate(etc.contents));
  }
}
