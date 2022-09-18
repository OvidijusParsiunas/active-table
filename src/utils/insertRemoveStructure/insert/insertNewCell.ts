import {InsertRemoveColumnSizer} from '../../columnSizer/manipulateColumnSizer';
import {CellDividerElement} from '../../../elements/cell/cellDividerElement';
import {EditableTableComponent} from '../../../editable-table-component';
import {ColumnDetails} from '../../columnDetails/columnDetails';
import {CellElement} from '../../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../../types/columnDetails';

export class InsertNewCell {
  private static insertElementsToRow(rowElement: HTMLElement, newCellElement: HTMLElement, columnIndex: number) {
    // the reason why columnIndex is multiplied by 2 is because there is a divider element after each cell
    // if child is undefined, the element is added at the end
    const childIndex = columnIndex * 2;
    rowElement.insertBefore(newCellElement, rowElement.children[childIndex]);
    const newCellDividerElement = CellDividerElement.create();
    rowElement.insertBefore(newCellDividerElement, rowElement.children[childIndex + 1]);
  }

  // prettier-ignore
  private static updateColumnDetailsAndSizers(
      etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    if (rowIndex === 0) {
      const columnDetails = ColumnDetails.createPartial(cellElement);
      etc.columnsDetails.splice(columnIndex, 0, columnDetails as ColumnDetailsT);
      InsertRemoveColumnSizer.insert(etc, etc.columnsDetails, columnDetails, columnIndex);
    } else {
      // TO-DO - not sure if all cell elements are needed, if this is not required in the future do not this code
      etc.columnsDetails[columnIndex].elements.push(cellElement);
    }
  }

  // isNewText indicates whether rowData is already in the contents state or if it needs to be added
  // prettier-ignore
  public static insertToRow(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText: string, isNewText: boolean) {
    const newCellElement = CellElement.createCellElement(etc, cellText, rowIndex, columnIndex);
    InsertNewCell.insertElementsToRow(rowElement, newCellElement, columnIndex);
    setTimeout(() => InsertNewCell.updateColumnDetailsAndSizers(etc, rowIndex, columnIndex, newCellElement));
    // cannot place in a timeout as etc.contents length is used to get last row index
    if (isNewText) etc.contents[rowIndex].splice(columnIndex, 0, cellText);
  }
}
