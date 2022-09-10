import {ColumnSizerElements} from '../../../elements/cell/columnSizerElements';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellElement} from '../../../elements/cell/cellElement';
import {ColumnDetails} from '../../../types/columnDetails';

export class InsertNewCell {
  private static createDefaultColumnDetailsObject(cellElement: HTMLElement): ColumnDetails {
    return {elements: [cellElement]};
  }

  // prettier-ignore
  private static updateColumnDetailsAndSizers(
      etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    if (rowIndex === 0) {
      // cannot be in a timeout as createAndAddNew needs it
      etc.columnsDetails.splice(columnIndex, 0, InsertNewCell.createDefaultColumnDetailsObject(cellElement));
      ColumnSizerElements.createAndAddNew(etc);
    } else {
      // TO-DO - not sure if all cell elements are needed, if this is not required in the future do not this code
      setTimeout(() => etc.columnsDetails[columnIndex].elements.push(cellElement));
    }
  }

  // prettier-ignore
  private static add(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText: string) {
    const cellElement = CellElement.createCellElement(etc, cellText, rowIndex, columnIndex);
    // if rowElement.children[columnIndex] is undefined, the element is added at the end
    rowElement.insertBefore(cellElement, rowElement.children[columnIndex]);
    return cellElement;
  }

  // isNewText indicates whether rowData is already in the contents state or if it needs to be added
  // prettier-ignore
  public static insertToRow(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText: string, isNewText: boolean) {
    const cellElement = InsertNewCell.add(etc, rowElement, rowIndex, columnIndex, cellText);
    InsertNewCell.updateColumnDetailsAndSizers(etc, rowIndex, columnIndex, cellElement);
    // cannot plce in a timeout as etc.contents length is used to get last row index
    if (isNewText) etc.contents[rowIndex].splice(columnIndex, 0, etc.defaultCellValue);
  }
}
