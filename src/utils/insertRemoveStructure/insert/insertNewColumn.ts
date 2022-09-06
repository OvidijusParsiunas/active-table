import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';

export class InsertNewCoulmn {
  private static updateNextColumns(etc: EditableTableComponent, startingColumnIndex: number) {
    const nextColumns = Array.from(etc.headerElementRef?.children[0].children || []).slice(startingColumnIndex);
    nextColumns.forEach((cellElement: Node, columnIndex: number) => {
      const relativeColumnIndex = columnIndex + startingColumnIndex;
      etc.onCellUpdate(cellElement.textContent as string, 0, relativeColumnIndex, CELL_UPDATE_TYPE.UPDATE);
      CellElement.setCellEvents(etc, cellElement as HTMLElement, 0, relativeColumnIndex);
    });
  }

  // prettier-ignore
  private static addCell(etc: EditableTableComponent,
      rowElement: Node, rowIndex: number, columnIndex: number, isHeader = false) {
    const cellElement = CellElement.createCellElement(
      etc, etc.defaultValue, rowIndex, columnIndex, isHeader);
    // if rowElement.children[columnIndex] is undefined, the element is added at the end
    rowElement.insertBefore(cellElement, (rowElement as HTMLElement).children[columnIndex]);
    etc.contents[rowIndex].splice(columnIndex, 0, etc.defaultValue);
    etc.onCellUpdate(etc.defaultValue, rowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
    setTimeout(() => InsertNewCoulmn.updateNextColumns(etc, columnIndex + 1));
  }

  private static insertNewCellsToDataRows(etc: EditableTableComponent, columnIndex: number) {
    Array.from(etc.dataElementRef?.children || []).forEach((dataRowElement: Node, rowIndex: number) => {
      InsertNewCoulmn.addCell(etc, dataRowElement, rowIndex + 1, columnIndex);
    });
  }

  private static insertCellToHeaderRow(etc: EditableTableComponent, columnIndex: number) {
    if (etc.headerElementRef) {
      const headerRow = etc.headerElementRef.children[0];
      InsertNewCoulmn.addCell(etc, headerRow, 0, columnIndex, true);
    }
  }

  public static insert(etc: EditableTableComponent, columnIndex: number) {
    InsertNewCoulmn.insertCellToHeaderRow(etc, columnIndex);
    InsertNewCoulmn.insertNewCellsToDataRows(etc, columnIndex);
    etc.onTableUpdate(etc.contents);
  }
}
