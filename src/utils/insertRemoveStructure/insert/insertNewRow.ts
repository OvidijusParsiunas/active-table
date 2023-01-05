import {RowDropdownCellOverlay} from '../../../elements/dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlay';
import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewColumnElement} from '../../../elements/table/addNewElements/column/addNewColumnElement';
import {AddNewRowElement} from '../../../elements/table/addNewElements/row/addNewRowElement';
import {RowElement} from '../../../elements/table/addNewElements/row/rowElement';
import {EditableTableComponent} from '../../../editable-table-component';
import {IndexColumn} from '../../../elements/indexColumn/indexColumn';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {PaginationUtils} from '../../pagination/paginationUtils';
import {CellText, TableRow} from '../../../types/tableContents';
import {UpdateCellsForRows} from '../update/updateCellsForRows';
import {ElementDetails} from '../../../types/elementDetails';
import {StripedRows} from '../../stripedRows/stripedRows';
import {MoveRow} from '../../moveStructure/moveRow';
import {MaximumColumns} from './maximumColumns';
import {InsertNewCell} from './insertNewCell';
import {DataUtils} from '../shared/dataUtils';
import {MaximumRows} from './maximumRows';

export class InsertNewRow {
  // CAUTION-2 if the addition or removal of row causes the parent div to change width, this is indeed run after rerender,
  // however the notification messages are necessary and the rebinding does not seem to cause issues, nevertheless take
  // note of this if editing any of the logic below
  private static bindAndfireCellUpdates(etc: EditableTableComponent, rowIndex: number) {
    const lastRowIndex = etc.contents.length - 1;
    const lastDataRowElement = etc.tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    const lastRowDetails: ElementDetails = {element: lastDataRowElement, index: lastRowIndex};
    UpdateCellsForRows.rebindAndFireUpdates(etc, rowIndex, CELL_UPDATE_TYPE.ADD, lastRowDetails); // REF-20
    etc.onTableUpdate(etc.contents);
  }

  private static canStartRenderCellBeAdded(etc: EditableTableComponent, rowIndex: number, columnIndex: number) {
    if (rowIndex === 0) {
      return MaximumColumns.canAddMore(etc);
    }
    return etc.columnsDetails[columnIndex];
  }

  // prettier-ignore
  private static addCells(etc: EditableTableComponent,
      newRowData: TableRow, newRowElement: HTMLElement, rowIndex: number, isNewText: boolean) {
    const {auxiliaryTableContentInternal: {displayIndexColumn, displayAddColumnCell}} = etc;
    if (displayIndexColumn) IndexColumn.createAndPrependToRow(etc, newRowElement, rowIndex);
    newRowData.forEach((cellText: CellText, columnIndex: number) => {
      if (isNewText || InsertNewRow.canStartRenderCellBeAdded(etc, rowIndex, columnIndex)) {
        InsertNewCell.insertToRow(etc, newRowElement, rowIndex, columnIndex, cellText as string, isNewText);
      }
    });
    if (displayAddColumnCell) AddNewColumnElement.createAndAppendToRow(etc, newRowElement, rowIndex);
    setTimeout(() => RowDropdownCellOverlay.add(etc, rowIndex, newRowElement.children[0] as HTMLElement));
  }

  // prettier-ignore
  private static updagePagination(etc: EditableTableComponent,
      rowIndex: number, isNewText: boolean, newRowElement: HTMLElement) {
    if (!isNewText) {
      PaginationUtils.initialRowUpdates(etc, rowIndex, newRowElement);
    } else {
      PaginationUtils.updateOnRowChange(etc, rowIndex, newRowElement);
    }
  }

  private static insertNewRow(etc: EditableTableComponent, rowIndex: number, isNewText: boolean, rowData?: TableRow) {
    const newRowData = rowData || DataUtils.createEmptyStringDataArray(etc.contents[0]?.length || 1);
    const newRowElement = RowElement.create();
    if (etc.pagination) InsertNewRow.updagePagination(etc, rowIndex, isNewText, newRowElement);
    etc.tableBodyElementRef?.insertBefore(newRowElement, etc.tableBodyElementRef.children[rowIndex]);
    // don't need a timeout as addition of row with new text is not expensive
    if (isNewText) etc.contents.splice(rowIndex, 0, []);
    InsertNewRow.addCells(etc, newRowData, newRowElement, rowIndex, isNewText);
    return newRowElement;
  }

  // isNewText indicates whether rowData is already in the contents state or if it needs to be added
  public static insert(etc: EditableTableComponent, rowIndex: number, isNewText: boolean, rowData?: TableRow) {
    if (!MaximumRows.canAddMore(etc)) return;
    const isReplacingHeader = isNewText && rowIndex === 0 && etc.columnsDetails.length > 0;
    if (isReplacingHeader) rowIndex = 1; // REF-26
    InsertNewRow.insertNewRow(etc, rowIndex, isNewText, rowData);
    if (isNewText) {
      ToggleAdditionElements.update(etc, true, AddNewRowElement.toggle);
      if (etc.auxiliaryTableContentInternal.displayIndexColumn) IndexColumn.updateIndexes(etc, rowIndex + 1);
      StripedRows.updateRows(etc, rowIndex);
    }
    if (isReplacingHeader) MoveRow.move(etc, 0, true); // REF-26
    setTimeout(() => {
      // this is used to prevent multiple rebindings of same rows as upon the insertion of multiple via the initial
      // table render or after pasting, the contents array would be populated synchronously which would cause
      // the lastRowIndex to be high every time this is called and rows between rowIndex and lastRowIndex would
      // be rebinded multiple times
      if (!rowData) {
        InsertNewRow.bindAndfireCellUpdates(etc, rowIndex);
      } else if (rowIndex === etc.contents.length - 1) {
        // may not be best to start from 0 but this method has no concept of starting point
        InsertNewRow.bindAndfireCellUpdates(etc, 0);
      }
    });
  }

  public static insertEvent(this: EditableTableComponent) {
    let newRowIndex = this.contents.length;
    if (this.paginationInternal) {
      const {maxVisibleRowIndex} = PaginationUtils.getRelativeRowIndexes(this);
      if (maxVisibleRowIndex < newRowIndex) newRowIndex = maxVisibleRowIndex;
    }
    InsertNewRow.insert(this, newRowIndex, true);
  }
}
