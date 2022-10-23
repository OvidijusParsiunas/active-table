import {DateCellElement} from '../../../elements/cell/cellsWithTextDiv/dateCell/dateCellElement';
import {CategoryCellElement} from '../../../elements/cell/cellsWithTextDiv/categoryCellElement';
import {CategoryDropdown} from '../../../elements/dropdown/categoryDropdown/categoryDropdown';
import {InsertRemoveColumnSizer} from '../../columnSizer/insertRemoveColumnSizer';
import {DATE_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from '../../../enums/columnType';
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
      const categoryDropdown = CategoryDropdown.createAndAppend(etc.tableElementRef as HTMLElement);
      const columnDetails = ColumnDetails.createPartial(cellElement, categoryDropdown);
      columnsDetails.splice(columnIndex, 0, columnDetails as ColumnDetailsT);
      InsertRemoveColumnSizer.insert(etc, columnsDetails, columnDetails, columnIndex);
    } else {
      // TO-DO - not sure if all cell elements are needed, if this is not required in the future do not this code
      const columnDetails = etc.columnsDetails[columnIndex];
      columnDetails.elements.splice(rowIndex, 0, cellElement);
      setTimeout(() => CellTypeTotalsUtils.incrementCellTypeAndSetNewColumnType(columnDetails, defaultCellValue, text));
    }
  }

  // prettier-ignore
  private static convertCell(etc: EditableTableComponent,
      columnDetail: ColumnDetailsT, rowIndex: number, columnIndex: number, newCellElement: HTMLElement) {
    if (columnDetail.userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
      CategoryCellElement.convertCellFromDataToCategory(etc, rowIndex, columnIndex, newCellElement, '');
      CategoryCellElement.finaliseEditedText(etc, newCellElement.children[0] as HTMLElement, columnIndex, true);
    } else if (DATE_COLUMN_TYPE[columnDetail.userSetColumnType]) {
      DateCellElement.convertCellFromDataToDate(etc,
        rowIndex, columnIndex, newCellElement, columnDetail.userSetColumnType);
    }
  }

  private static create(etc: EditableTableComponent, processedCellText: string, rowIndex: number, columnIndex: number) {
    const newCellElement = CellElement.createCellElement(etc, processedCellText, rowIndex, columnIndex);
    const columnDetail = etc.columnsDetails[columnIndex];
    if (columnDetail) InsertNewCell.convertCell(etc, columnDetail, rowIndex, columnIndex, newCellElement);
    return newCellElement;
  }

  // isNewText indicates whether rowData is already in the contents state or if it needs to be added
  // prettier-ignore
  public static insertToRow(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText: string, isNewText: boolean) {
    const processedCellText = DataUtils.processCellText(etc, rowIndex, columnIndex, cellText);
    const newCellElement = InsertNewCell.create(etc, processedCellText, rowIndex, columnIndex);
    InsertNewCell.insertElementsToRow(rowElement, newCellElement, columnIndex);
    setTimeout(() => InsertNewCell.updateColumnDetailsAndSizers(
      etc, rowIndex, columnIndex, newCellElement, processedCellText));
    // cannot place in a timeout as etc.contents length is used to get last row index
    etc.contents[rowIndex].splice(columnIndex, isNewText ? 0 : 1, processedCellText);
  }
}
