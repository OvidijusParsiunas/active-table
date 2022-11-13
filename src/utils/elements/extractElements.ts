import {AddNewColumnElement} from '../../elements/table/addNewElements/column/addNewColumnElement';
import {TableContents} from '../../types/tableContents';

export class ExtractElements {
  public static textCellsArrFromRow(rowElement: HTMLElement) {
    return Array.from(rowElement.children).filter(
      (child) =>
        (child.tagName === 'TH' || child.tagName === 'TD') &&
        !child.classList.contains(AddNewColumnElement.ADD_COLUMN_CELL_CLASS)
    );
  }

  public static textRowsArrFromTBody(tableBodyElement: HTMLElement, contents: TableContents) {
    // not returning aux rows that contain other utils such as add new row
    return Array.from(tableBodyElement.children).slice(0, contents.length);
  }
}
