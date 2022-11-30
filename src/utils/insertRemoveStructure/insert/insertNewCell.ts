import {CategoryCellElement} from '../../../elements/cell/cellsWithTextDiv/categoryCell/categoryCellElement';
import {InsertRemoveColumnSizer} from '../../../elements/columnSizer/utils/insertRemoveColumnSizer';
import {ColumnGroupElement} from '../../../elements/table/addNewElements/column/columnGroupElement';
import {DateCellElement} from '../../../elements/cell/cellsWithTextDiv/dateCell/dateCellElement';
import {CategoryDropdown} from '../../../elements/dropdown/categoryDropdown/categoryDropdown';
import {StaticTableWidthUtils} from '../../tableDimensions/staticTable/staticTableWidthUtils';
import {ColumnSettingsBorderUtils} from '../../columnSettings/columnSettingsBorderUtils';
import {UpdateIndexColumnWidth} from '../../../elements/indexColumn/updateIndexColumnWidth';
import {ColumnDetailsInitial, ColumnDetailsT} from '../../../types/columnDetails';
import {DATE_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from '../../../enums/columnType';
import {CellDividerElement} from '../../../elements/cell/cellDividerElement';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellTypeTotalsUtils} from '../../cellType/cellTypeTotalsUtils';
import {CellElementIndex} from '../../elements/cellElementIndex';
import {ColumnDetails} from '../../columnDetails/columnDetails';
import {CellElement} from '../../../elements/cell/cellElement';
import {DataUtils} from '../shared/dataUtils';

export class InsertNewCell {
  // prettier-ignore
  private static insertElementsToRow(rowElement: HTMLElement, newCellElement: HTMLElement, columnIndex: number,
      displayIndexColumn: boolean) {
    // if child is undefined, the element is added at the end
    const childIndex = CellElementIndex.getViaColumnIndex(columnIndex, displayIndexColumn);
    rowElement.insertBefore(newCellElement, rowElement.children[childIndex]);
    const newCellDividerElement = CellDividerElement.create();
    rowElement.insertBefore(newCellDividerElement, rowElement.children[childIndex + 1]);
  }

  // please note that this is run twice in firefox due to the render function being triggered twice
  // prettier-ignore
  private static updateColumnDetailsAndSizers(
      etc: EditableTableComponent, rowIndex: number, columnIndex: number, text: string, isNewText: boolean) {
    const {columnsDetails, categoryDropdownContainer} = etc;
    const columnDetails = columnsDetails[columnIndex];
    if (!columnDetails) return; // because column maximum kicks in during second render function trigger in firefox
    if (rowIndex === 0) {
      const categoryDropdown = CategoryDropdown.createAndAppend(categoryDropdownContainer as HTMLElement);
      ColumnDetails.updateWithNoSizer(columnDetails as ColumnDetailsInitial, categoryDropdown); // REF-13
      InsertRemoveColumnSizer.insert(etc, columnsDetails, columnIndex); // REF-13
      if (isNewText) {
        InsertRemoveColumnSizer.cleanUpCustomColumnSizers(etc, columnIndex);
        UpdateIndexColumnWidth.wrapTextWhenNarrowColumnsBreached(etc); // REF-19
      }
    } else {
      // CAUTION-2
      CellTypeTotalsUtils.incrementCellTypeAndSetNewColumnType(columnDetails, text);
    }
  }

  // prettier-ignore
  private static insert(etc: EditableTableComponent, rowElement: HTMLElement, newCellElement: HTMLElement,
      processedCellText: string, isNewText: boolean, rowIndex: number, columnIndex: number) {
    const {auxiliaryTableContentInternal: {displayIndexColumn}, contents, columnsDetails} = etc;
    const columnDetails = columnsDetails[columnIndex];
    columnDetails.elements.splice(rowIndex, 0, newCellElement); // cannot be in timeout for max rows
    InsertNewCell.insertElementsToRow(rowElement, newCellElement, columnIndex, displayIndexColumn);
    // cannot place in a timeout as etc.contents length is used to get last row index
    contents[rowIndex].splice(columnIndex, isNewText ? 0 : 1, processedCellText);
  }

  // prettier-ignore
  private static convertCell(etc: EditableTableComponent,
      columnDetails: ColumnDetailsT, rowIndex: number, columnIndex: number, newCellElement: HTMLElement) {
    if (columnDetails.userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
      CategoryCellElement.convertCellFromDataToCategory(etc, rowIndex, columnIndex, newCellElement, '');
      CategoryCellElement.finaliseEditedText(etc, newCellElement.children[0] as HTMLElement, columnIndex, true);
    } else if (DATE_COLUMN_TYPE[columnDetails.userSetColumnType]) {
      DateCellElement.convertCellFromDataToDate(columnDetails.userSetColumnType,
        etc, rowIndex, columnIndex, newCellElement);
    }
  }

  private static create(etc: EditableTableComponent, processedCellText: string, rowIndex: number, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    const newCellElement = CellElement.createCellElement(etc, processedCellText, rowIndex, columnIndex);
    InsertNewCell.convertCell(etc, columnDetails, rowIndex, columnIndex, newCellElement);
    return newCellElement;
  }

  // REF-13
  // the reason for creating object with elements and settings only is because changeWidthsBasedOnColumnInsertRemove
  // needs them to reset all column widths if required. We can worry about adding the other properties in a timeout
  // within the updateColumnDetailsAndSizers method
  private static insertInitialColumnDetails(etc: EditableTableComponent, cellText: string, index: number) {
    const {columnsDetails, columnsSettingsInternal} = etc;
    const columnDetails = ColumnDetails.createInitial(etc, columnsSettingsInternal[cellText]);
    columnsDetails.splice(index, 0, columnDetails as ColumnDetailsT);
  }

  // isNewText indicates whether rowData is already in the contents state or if it needs to be added
  // prettier-ignore
  public static insertToRow(etc: EditableTableComponent,
      rowElement: HTMLElement, rowIndex: number, columnIndex: number, cellText: string, isNewText: boolean) {
    if (rowIndex === 0) InsertNewCell.insertInitialColumnDetails(etc, cellText, columnIndex); // REF-13
    const processedCellText = DataUtils.processCellText(etc, rowIndex, columnIndex, cellText);
    const newCellElement = InsertNewCell.create(etc, processedCellText, rowIndex, columnIndex);
    InsertNewCell.insert(etc, rowElement, newCellElement, processedCellText, isNewText, rowIndex, columnIndex);
    if (rowIndex === 0) {
      if (etc.auxiliaryTableContentInternal.displayAddColumnCell) ColumnGroupElement.update(etc);
      if (isNewText) StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true); // REF-11
      ColumnSettingsBorderUtils.updateSiblingColumns(etc, columnIndex);
    }
    setTimeout(() => InsertNewCell.updateColumnDetailsAndSizers(etc, rowIndex, columnIndex, processedCellText, isNewText));
  }
}
