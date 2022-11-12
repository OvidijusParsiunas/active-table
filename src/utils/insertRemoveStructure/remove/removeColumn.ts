import {InsertRemoveColumnSizer} from '../../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {CategoryDropdown} from '../../../elements/dropdown/categoryDropdown/categoryDropdown';
import {StaticTableWidthUtils} from '../../tableDimensions/staticTable/staticTableWidthUtils';
import {ColumnGroupElement} from '../../../elements/table/column/columnGroupElement';
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
    const lastColumn: ElementDetails = LastColumn.getDetails(etc.columnsDetails, rowIndex);
    RemoveColumn.removeElements(rowElement, columnIndex);
    etc.contents[rowIndex].splice(columnIndex, 1);
    etc.columnsDetails.splice(columnIndex, 1)[0]; // needs to be after getDetails but before the following line
    if (rowIndex === 0) StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, false);
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

  // TO-DO - default to add new column column when there are no more columns
  public static remove(etc: EditableTableComponent, columnIndex: number) {
    const columnDetailsToBeRemoved = etc.columnsDetails[columnIndex];
    RemoveColumn.removeCellFromAllRows(etc, columnIndex);
    ColumnGroupElement.update(etc);
    setTimeout(() => {
      CategoryDropdown.remove(etc.tableElementRef as HTMLElement, columnDetailsToBeRemoved.categoryDropdown.element);
      InsertRemoveColumnSizer.remove(etc, columnIndex);
      etc.onTableUpdate(etc.contents);
    });
  }

  public static removeEvent(this: EditableTableComponent, columnIndex: number) {
    RemoveColumn.remove(this, columnIndex);
  }
}
