import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ElementDetails} from '../../../types/elementDetails';
import {UpdateColumns} from '../shared/updateColumns';

export class RemoveColumn {
  // prettier-ignore
  private static removeCell(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const lastCellElement = rowElement.children[rowElement.children.length - 1] as HTMLElement;
    const lastColumn: ElementDetails = { element: lastCellElement, index: rowElement.children.length - 1 };
    rowElement.removeChild(rowElement.children[columnIndex]);
    etc.contents[rowIndex].splice(columnIndex, 1);
    setTimeout(() =>{
      const rowDetails: ElementDetails = { element: rowElement, index: rowIndex };
      UpdateColumns.update(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.REMOVED, lastColumn)
    });
  }

  private static removeCellFromDataRow(etc: EditableTableComponent, columnIndex: number) {
    Array.from(etc.dataElementRef?.children || []).forEach((dataRowElement: Node, rowIndex: number) => {
      RemoveColumn.removeCell(etc, dataRowElement as HTMLElement, rowIndex + 1, columnIndex);
    });
  }

  private static removeCellFromHeaderRow(etc: EditableTableComponent, columnIndex: number) {
    if (etc.headerElementRef) {
      const headerRow = etc.headerElementRef.children[0];
      RemoveColumn.removeCell(etc, headerRow as HTMLElement, 0, columnIndex);
    }
  }

  public static remove(etc: EditableTableComponent, columnIndex: number) {
    RemoveColumn.removeCellFromHeaderRow(etc, columnIndex);
    RemoveColumn.removeCellFromDataRow(etc, columnIndex);
    etc.onTableUpdate(etc.contents);
  }
}
