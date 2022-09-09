import {ColumnSizerElements} from '../../../elements/cell/columnSizerElements';
import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';
import {ElementDetails} from '../../../types/elementDetails';
import {ColumnDetails} from '../../../types/columnDetails';
import {UpdateColumns} from '../shared/updateColumns';

export class InsertNewColumn {
  public static readonly DEFAULT_COLUMN_WIDTH = '100px';

  private static createDefaultColumnDetailsObject(width: string, cellElement: HTMLElement): ColumnDetails {
    return {width, elements: [cellElement]};
  }

  // prettier-ignore
  private static updateColumns(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const rowDetails: ElementDetails = { element: rowElement, index: rowIndex };
    const lastCellElement = rowElement.children[rowElement.children.length - 1] as HTMLElement;
    const lastColumn: ElementDetails = { element: lastCellElement, index: rowElement.children.length - 1 };
    UpdateColumns.update(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.ADD, lastColumn);
  }

  // prettier-ignore
  private static add(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, width: string, cellText?: string) {
    const text = cellText === undefined ? etc.defaultCellValue : cellText;
    const cellElement = CellElement.createCellElement(etc, text, width, rowIndex, columnIndex);
    // if rowElement.children[columnIndex] is undefined, the element is added at the end
    rowElement.insertBefore(cellElement, rowElement.children[columnIndex]);
    // assuming that the use of existing values is already inside contents
    if (cellText === undefined) {
      etc.contents[rowIndex].splice(columnIndex, 0, etc.defaultCellValue);
      setTimeout(() => InsertNewColumn.updateColumns(etc, rowElement, rowIndex, columnIndex));
    }
    return cellElement;
  }

  // prettier-ignore
  public static insertToRow(
      etc: EditableTableComponent, dataRowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText?: string) {
    const columnDetails = etc.columnsDetails[columnIndex];
    const cellElement = InsertNewColumn.add(etc, dataRowElement, rowIndex, columnIndex, columnDetails.width, cellText);
    setTimeout(() => columnDetails.elements.push(cellElement));
  }

  private static insertToDataRows(etc: EditableTableComponent, columnIndex: number) {
    Array.from(etc.dataElementRef?.children || []).forEach((dataRowElement: Node, rowIndex: number) => {
      InsertNewColumn.insertToRow(etc, dataRowElement as HTMLElement, rowIndex + 1, columnIndex);
    });
  }

  public static insertToHeaderRow(etc: EditableTableComponent, columnIndex: number, cellText?: string) {
    if (etc.headerElementRef) {
      const headerRow = etc.headerElementRef.children[0];
      const width = InsertNewColumn.DEFAULT_COLUMN_WIDTH;
      const cellElement = InsertNewColumn.add(etc, headerRow as HTMLElement, 0, columnIndex, width, cellText);
      etc.columnsDetails.splice(columnIndex, 0, InsertNewColumn.createDefaultColumnDetailsObject(width, cellElement));
      setTimeout(() => ColumnSizerElements.createAndAddNew(etc));
    }
  }

  public static insertForAllRows(etc: EditableTableComponent, columnIndex: number) {
    InsertNewColumn.insertToHeaderRow(etc, columnIndex);
    InsertNewColumn.insertToDataRows(etc, columnIndex);
    etc.onTableUpdate(etc.contents);
  }

  public static insertForAllRowsEvent(etc: EditableTableComponent, columnIndex: number) {
    InsertNewColumn.insertForAllRows(etc, columnIndex);
  }
}
