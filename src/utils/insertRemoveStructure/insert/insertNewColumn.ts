import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';
import {ElementDetails} from '../../../types/elementDetails';
import {UpdateColumns} from '../shared/updateColumns';

export class InsertNewColumn {
  // prettier-ignore
  private static updateColumns(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
      const rowDetails: ElementDetails = { element: rowElement, index: rowIndex };
      const lastCellElement = rowElement.children[rowElement.children.length - 1] as HTMLElement;
      const lastColumn: ElementDetails = { element: lastCellElement, index: rowElement.children.length - 1 };
      UpdateColumns.update(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.ADD, lastColumn)
  }

  // prettier-ignore
  private static addCell(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, isHeader = false) {
    const cellElement = CellElement.createCellElement(etc, etc.defaultValue, rowIndex, columnIndex, isHeader);
    // if rowElement.children[columnIndex] is undefined, the element is added at the end
    rowElement.insertBefore(cellElement, rowElement.children[columnIndex]);
    etc.contents[rowIndex].splice(columnIndex, 0, etc.defaultValue);
    setTimeout(() => InsertNewColumn.updateColumns(etc, rowElement, rowIndex, columnIndex));
  }

  private static insertNewCellsToDataRows(etc: EditableTableComponent, columnIndex: number) {
    Array.from(etc.dataElementRef?.children || []).forEach((dataRowElement: Node, rowIndex: number) => {
      InsertNewColumn.addCell(etc, dataRowElement as HTMLElement, rowIndex + 1, columnIndex);
    });
  }

  private static insertCellToHeaderRow(etc: EditableTableComponent, columnIndex: number) {
    if (etc.headerElementRef) {
      const headerRow = etc.headerElementRef.children[0];
      InsertNewColumn.addCell(etc, headerRow as HTMLElement, 0, columnIndex, true);
    }
  }

  public static insert(etc: EditableTableComponent, columnIndex: number) {
    InsertNewColumn.insertCellToHeaderRow(etc, columnIndex);
    InsertNewColumn.insertNewCellsToDataRows(etc, columnIndex);
    etc.onTableUpdate(etc.contents);
  }
}
