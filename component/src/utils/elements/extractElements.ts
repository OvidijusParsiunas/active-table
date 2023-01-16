import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {IndexColumn} from '../../elements/indexColumn/indexColumn';
import {CellElement} from '../../elements/cell/cellElement';
import {TableContent} from '../../types/tableContent';

export class ExtractElements {
  public static textCellsArrFromRow(rowElement: HTMLElement) {
    return Array.from(rowElement.children).filter(
      (child) =>
        (child.tagName === CellElement.HEADER_TAG || child.tagName === CellElement.DATA_TAG) &&
        !child.classList.contains(AddNewColumnElement.ADD_COLUMN_CELL_CLASS) &&
        !child.classList.contains(IndexColumn.INDEX_CELL_CLASS)
    );
  }

  public static textRowsArrFromTBody(tableBodyElement: HTMLElement, content: TableContent, startIndex = 0) {
    // not returning aux rows that contain other utils such as add new row
    return Array.from(tableBodyElement.children).slice(startIndex, content.length);
  }

  public static getRightColumnSiblingCell(cellElement: HTMLElement) {
    return cellElement.nextSibling?.nextSibling;
  }
}
