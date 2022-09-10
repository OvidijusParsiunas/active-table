import {ColumnSizerElements} from '../../../elements/cell/columnSizerElements';
import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellElement} from '../../../elements/cell/cellElement';
import {ElementDetails} from '../../../types/elementDetails';
import {ColumnDetails} from '../../../types/columnDetails';
import {UpdateColumns} from '../shared/updateColumns';

export class InsertNewColumn {
  private static createDefaultColumnDetailsObject(cellElement: HTMLElement): ColumnDetails {
    return {elements: [cellElement]};
  }

  // prettier-ignore
  private static updateColumnDetailsAndSizers(
      etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    if (rowIndex === 0) {
      // cannot be in a timeout as createAndAddNew needs it
      etc.columnsDetails.splice(columnIndex, 0, InsertNewColumn.createDefaultColumnDetailsObject(cellElement));
      ColumnSizerElements.createAndAddNew(etc);
    } else {
      // TO-DO - not sure if need all cell elements, if this is not required in the future do not this code
      setTimeout(() => etc.columnsDetails[columnIndex].elements.push(cellElement));
    }
  }

  // prettier-ignore
  private static updateColumns(
      etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const rowDetails: ElementDetails = { element: rowElement, index: rowIndex };
    const lastCellElement = rowElement.children[rowElement.children.length - 1] as HTMLElement;
    const lastColumn: ElementDetails = { element: lastCellElement, index: rowElement.children.length - 1 };
    UpdateColumns.update(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.ADD, lastColumn);
  }

  // prettier-ignore
  private static add(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText?: string) {
    const text = cellText === undefined ? etc.defaultCellValue : cellText;
    const cellElement = CellElement.createCellElement(etc, text, rowIndex, columnIndex);
    // if rowElement.children[columnIndex] is undefined, the element is added at the end
    rowElement.insertBefore(cellElement, rowElement.children[columnIndex]);
    // assuming that the use of existing values is already inside contents
    if (cellText === undefined) {
      etc.contents[rowIndex].splice(columnIndex, 0, etc.defaultCellValue);
      // WORK - potentially display all the time
      setTimeout(() => InsertNewColumn.updateColumns(etc, rowElement, rowIndex, columnIndex));
    }
    return cellElement;
  }

  // prettier-ignore
  public static insertToRow(
      etc: EditableTableComponent, dataRowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText?: string) {
    const cellElement = InsertNewColumn.add(etc, dataRowElement, rowIndex, columnIndex, cellText);
    InsertNewColumn.updateColumnDetailsAndSizers(etc, rowIndex, columnIndex, cellElement);
  }

  private static insertToAllRows(etc: EditableTableComponent, columnIndex: number) {
    Array.from(etc.tableBodyElementRef?.children || []).forEach((dataRowElement: Node, rowIndex: number) => {
      InsertNewColumn.insertToRow(etc, dataRowElement as HTMLElement, rowIndex + 1, columnIndex);
    });
  }

  public static insertForAllRows(etc: EditableTableComponent, columnIndex: number) {
    InsertNewColumn.insertToAllRows(etc, columnIndex);
    setTimeout(() => etc.onTableUpdate(etc.contents));
  }

  public static insertForAllRowsEvent(etc: EditableTableComponent, columnIndex: number) {
    InsertNewColumn.insertForAllRows(etc, columnIndex);
  }
}
