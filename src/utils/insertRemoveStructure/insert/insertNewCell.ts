import {InsertRemoveColumnSizer} from '../../columnSizer/manipulateColumnSizer';
import {CellDividerElement} from '../../../elements/cell/cellDividerElement';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellTypeTotalsUtils} from '../../cellType/cellTypeTotalsUtils';
import {ColumnDetails} from '../../columnDetails/columnDetails';
import {CellElement} from '../../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../../types/columnDetails';
import {DataUtils} from '../shared/dataUtils';

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
      etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement, text: string) {
    const { columnsDetails, defaultCellValue } = etc;
    if (rowIndex === 0) {
      const columnDetails = ColumnDetails.createPartial(cellElement);
      columnsDetails.splice(columnIndex, 0, columnDetails as ColumnDetailsT);
      InsertRemoveColumnSizer.insert(etc, columnsDetails, columnDetails, columnIndex);
    } else {
      // TO-DO - not sure if all cell elements are needed, if this is not required in the future do not this code
      const columnDetails = etc.columnsDetails[columnIndex];
      columnDetails.elements.push(cellElement);
      setTimeout(() => CellTypeTotalsUtils.incrementCellTypeAndSetNewColumnType(columnDetails, defaultCellValue, text));
    }
  }

  // isNewText indicates whether rowData is already in the contents state or if it needs to be added
  // prettier-ignore
  public static insertToRow(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText: string, isNewText: boolean) {
    const processedCellText = DataUtils.processCellText(etc, rowIndex, cellText);
    const newCellElement = CellElement.createCellElement(etc, processedCellText, rowIndex, columnIndex);
    InsertNewCell.insertElementsToRow(rowElement, newCellElement, columnIndex);
    setTimeout(() => InsertNewCell.updateColumnDetailsAndSizers(
      etc, rowIndex, columnIndex, newCellElement, processedCellText));
    // cannot place in a timeout as etc.contents length is used to get last row index
    etc.contents[rowIndex].splice(columnIndex, isNewText ? 0 : 1, processedCellText);
  }
}
