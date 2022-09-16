import {InsertRemoveColumnSizer} from '../../columnSizer/manipulateColumnSizer';
import {EditableTableComponent} from '../../../editable-table-component';
import {UpdateCellsForColumns} from '../update/updateCellsForColumns';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';
import {LastColumn} from '../shared/lastColumn';

export class RemoveColumn {
  private static removeElements(rowElement: HTMLElement, columnIndex: number) {
    const elementColumnIndex = columnIndex * 2;
    // remove the text element
    rowElement.removeChild(rowElement.children[elementColumnIndex]);
    // remove the divider element
    rowElement.removeChild(rowElement.children[elementColumnIndex]);
  }

  private static removeCell(etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const lastColumn: ElementDetails = LastColumn.getDetails(rowElement);
    RemoveColumn.removeElements(rowElement, columnIndex);
    etc.contents[rowIndex].splice(columnIndex, 1);
    setTimeout(() => {
      const rowDetails: ElementDetails = {element: rowElement, index: rowIndex};
      UpdateCellsForColumns.rebindAndFireUpdates(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.REMOVED, lastColumn);
    });
  }

  private static removeCellFromAllRows(etc: EditableTableComponent, columnIndex: number) {
    const rowElements = ExtractElements.textRowsArrFromTBody(etc.tableBodyElementRef as HTMLElement, etc.contents);
    rowElements.forEach((rowElement: Node, rowIndex: number) => {
      RemoveColumn.removeCell(etc, rowElement as HTMLElement, rowIndex, columnIndex);
    });
  }

  public static remove(etc: EditableTableComponent, columnIndex: number) {
    etc.columnsDetails.splice(columnIndex, 1);
    RemoveColumn.removeCellFromAllRows(etc, columnIndex);
    setTimeout(() => {
      InsertRemoveColumnSizer.remove(etc.columnsDetails, columnIndex);
      etc.onTableUpdate(etc.contents);
    });
  }
}
