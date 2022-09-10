import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ElementDetails} from '../../../types/elementDetails';
import {UpdateColumns} from '../shared/updateColumns';
import {InsertNewCell} from './insertNewCell';

export class InsertNewColumn {
  // prettier-ignore
  private static updateColumns(
      etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const rowDetails: ElementDetails = { element: rowElement, index: rowIndex };
    const lastCellElement = rowElement.children[rowElement.children.length - 1] as HTMLElement;
    const lastColumn: ElementDetails = { element: lastCellElement, index: rowElement.children.length - 1 };
    // WORK - check if this is fired correctly for add row
    UpdateColumns.update(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.ADD, lastColumn);
  }

  private static insertToAllRows(etc: EditableTableComponent, columnIndex: number) {
    Array.from(etc.tableBodyElementRef?.children || []).forEach((rowElement: Node, rowIndex: number) => {
      InsertNewCell.insertToRow(etc, rowElement as HTMLElement, rowIndex + 1, columnIndex, etc.defaultCellValue, false);
      // WORK - potentially display all the time
      setTimeout(() => InsertNewColumn.updateColumns(etc, rowElement as HTMLElement, rowIndex, columnIndex));
    });
  }

  public static insertForAllRowsEvent(etc: EditableTableComponent, columnIndex: number) {
    InsertNewColumn.insertToAllRows(etc, columnIndex);
    setTimeout(() => etc.onTableUpdate(etc.contents));
  }
}
