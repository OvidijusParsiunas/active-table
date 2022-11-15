import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {IndexColumn} from '../../elements/table/indexColumn/indexColumn';
import {TableContents} from '../../types/tableContents';

export class ExtractElements {
  public static textCellsArrFromRow(rowElement: HTMLElement) {
    return Array.from(rowElement.children).filter(
      (child) =>
        (child.tagName === 'TH' || child.tagName === 'TD') &&
        !child.classList.contains(AddNewColumnElement.ADD_COLUMN_CELL_CLASS) &&
        !child.classList.contains(IndexColumn.INDEX_CELL_CLASS)
    );
  }

  public static textRowsArrFromTBody(tableBodyElement: HTMLElement, contents: TableContents, startIndex = 0) {
    // not returning aux rows that contain other utils such as add new row
    return Array.from(tableBodyElement.children).slice(startIndex, contents.length);
  }
}
