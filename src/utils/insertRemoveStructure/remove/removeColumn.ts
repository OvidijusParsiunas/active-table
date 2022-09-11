import {FireCellUpdatesForColumns} from '../shared/fireCellUpdatesForColumns';
import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ColumnSizerList} from '../../../types/overlayElements';
import {ElementDetails} from '../../../types/elementDetails';

export class RemoveColumn {
  private static removeColumnSizer(columnSizers: ColumnSizerList, overlayElementsParent: HTMLElement) {
    columnSizers.pop();
    overlayElementsParent.removeChild(overlayElementsParent.children[overlayElementsParent.children.length - 1]);
  }

  private static removeCell(etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const lastCellElement = rowElement.children[rowElement.children.length - 1] as HTMLElement;
    const lastColumn: ElementDetails = {element: lastCellElement, index: rowElement.children.length - 1};
    rowElement.removeChild(rowElement.children[columnIndex]);
    etc.contents[rowIndex].splice(columnIndex, 1);
    setTimeout(() => {
      const rowDetails: ElementDetails = {element: rowElement, index: rowIndex};
      FireCellUpdatesForColumns.update(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.REMOVED, lastColumn);
    });
  }

  private static removeCellFromRow(etc: EditableTableComponent, columnIndex: number) {
    const rowElements = Array.from(etc.tableBodyElementRef?.children || []);
    rowElements.slice(1, etc.contents.length).forEach((rowElement: Node, rowIndex: number) => {
      RemoveColumn.removeCell(etc, rowElement as HTMLElement, rowIndex + 1, columnIndex);
    });
  }

  private static removeCellFromHeaderRow(etc: EditableTableComponent, columnIndex: number) {
    const headerRow = etc.tableBodyElementRef?.children[0];
    RemoveColumn.removeCell(etc, headerRow as HTMLElement, 0, columnIndex);
    RemoveColumn.removeColumnSizer(
      etc.overlayElementsState.columnSizers.list,
      etc.overlayElementsParentRef as HTMLElement
    );
    etc.columnsDetails.splice(columnIndex, 1);
  }

  public static remove(etc: EditableTableComponent, columnIndex: number) {
    RemoveColumn.removeCellFromHeaderRow(etc, columnIndex);
    RemoveColumn.removeCellFromRow(etc, columnIndex);
    setTimeout(() => etc.onTableUpdate(etc.contents));
  }
}
