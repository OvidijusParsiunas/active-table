import {EditableTableComponent} from '../../../editable-table-component';
import {UpdateCellsForColumns} from '../update/updateCellsForColumns';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ElementDetails} from '../../../types/elementDetails';
import {InsertNewCell} from './insertNewCell';

export class InsertNewColumn {
  // prettier-ignore
  private static updateColumns(
      etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const rowDetails: ElementDetails = { element: rowElement, index: rowIndex };
    const lastCellElementIndex = rowElement.children.length - 2;
    const lastCellElement = rowElement.children[lastCellElementIndex] as HTMLElement;
    // index is the data cell index not the element index - as there are divider elements we divide by 2
    const lastColumn: ElementDetails = { element: lastCellElement, index: lastCellElementIndex / 2 };
    UpdateCellsForColumns.rebindAndFireUpdates(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.ADD, lastColumn);
  }

  private static insertToAllRows(etc: EditableTableComponent, columnIndex: number) {
    const rowElements = Array.from(etc.tableBodyElementRef?.children || []);
    rowElements.slice(0, etc.contents.length).forEach((rowElement: Node, rowIndex: number) => {
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
