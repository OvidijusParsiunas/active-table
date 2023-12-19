import {RowDropdownCellOverlay} from '../../../elements/dropdown/rowDropdown/cellOverlay/rowDropdownCellOverlay';
import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewColumnElement} from '../../../elements/table/addNewElements/column/addNewColumnElement';
import {PaginationRowIndexes} from '../../outerTableComponents/pagination/paginationRowIndexes';
import {AddNewRowElement} from '../../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationUtils} from '../../outerTableComponents/pagination/paginationUtils';
import {RowElement} from '../../../elements/table/addNewElements/row/rowElement';
import {IndexColumn} from '../../../elements/indexColumn/indexColumn';
import {CustomRowProperties} from '../../rows/customRowProperties';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {UpdateCellsForRows} from '../update/updateCellsForRows';
import {ElementDetails} from '../../../types/elementDetails';
import {CellText, TableRow} from '../../../types/tableData';
import {MaximumColumns} from './maximum/maximumColumns';
import {MoveRow} from '../../moveStructure/moveRow';
import {FireEvents} from '../../events/fireEvents';
import {MaximumRows} from './maximum/maximumRows';
import {ActiveTable} from '../../../activeTable';
import {InsertNewCell} from './insertNewCell';
import {DataUtils} from '../shared/dataUtils';

export class InsertNewRow {
  // CAUTION-2 if the addition or removal of row causes the parent div to change width, this is indeed run after rerender,
  // however the notification messages are necessary and the rebinding does not seem to cause issues, nevertheless take
  // note of this if editing any of the logic below
  private static bindAndfireCellUpdates(at: ActiveTable, rowIndex: number) {
    const lastRowIndex = at.data.length - 1;
    const lastDataRowElement = at._tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    const lastRowDetails: ElementDetails = {element: lastDataRowElement, index: lastRowIndex};
    UpdateCellsForRows.rebindAndFireUpdates(at, rowIndex, CELL_UPDATE_TYPE.ADD, lastRowDetails); // REF-20
    setTimeout(() => FireEvents.onDataUpdate(at));
  }

  private static canStartRenderCellBeAdded(at: ActiveTable, rowIndex: number, columnIndex: number) {
    if (rowIndex === 0) {
      return MaximumColumns.canAddMore(at);
    }
    return at._columnsDetails[columnIndex];
  }

  // prettier-ignore
  private static addCells(at: ActiveTable,
      newRowData: TableRow, newRowElement: HTMLElement, rowIndex: number, isNewText: boolean) {
    const {_frameComponents: {displayIndexColumn, displayAddNewColumn}} = at;
    if (displayIndexColumn) IndexColumn.createAndPrependToRow(at, newRowElement, rowIndex);
    newRowData.forEach((cellText: CellText, columnIndex: number) => {
      if (isNewText || InsertNewRow.canStartRenderCellBeAdded(at, rowIndex, columnIndex)) {
        InsertNewCell.insertToRow(at, newRowElement, rowIndex, columnIndex, cellText as string, isNewText);
      }
    });
    if (displayAddNewColumn) AddNewColumnElement.createAndAppendToRow(at, newRowElement, rowIndex);
    setTimeout(() => RowDropdownCellOverlay.add(at, rowIndex, newRowElement.children[0] as HTMLElement));
  }

  // prettier-ignore
  private static updatePagination(at: ActiveTable,
      rowIndex: number, isNewText: boolean, newRowElement: HTMLElement) {
    if (!isNewText) {
      PaginationUtils.initialRowUpdates(at, rowIndex, newRowElement);
    } else {
      PaginationUtils.updateOnRowChange(at, rowIndex, newRowElement);
    }
  }

  private static insertNewRow(at: ActiveTable, rowIndex: number, isNewText: boolean, rowData?: TableRow) {
    const newRowData = rowData || DataUtils.createEmptyStringDataArray(at.data[0]?.length || 1);
    const newRowElement = RowElement.create();
    if (at.pagination) InsertNewRow.updatePagination(at, rowIndex, isNewText, newRowElement);
    at._tableBodyElementRef?.insertBefore(newRowElement, at._tableBodyElementRef.children[rowIndex]);
    // don't need a timeout as addition of row with new text is not expensive
    if (isNewText) at.data.splice(rowIndex, 0, []);
    InsertNewRow.addCells(at, newRowData, newRowElement, rowIndex, isNewText);
    return newRowElement;
  }

  // isNewText indicates whether rowData is already in the data state or if it needs to be added
  public static insert(at: ActiveTable, rowIndex: number, isNewText: boolean, rowData?: TableRow) {
    if (!MaximumRows.canAddMore(at)) return;
    const isReplacingHeader = isNewText && rowIndex === 0 && at._columnsDetails.length > 0;
    if (isReplacingHeader) rowIndex = 1; // REF-26
    const rowElement = InsertNewRow.insertNewRow(at, rowIndex, isNewText, rowData);
    if (isNewText) {
      ToggleAdditionElements.update(at, true, AddNewRowElement.toggle);
      if (at._frameComponents.displayIndexColumn) IndexColumn.updateIndexes(at, rowIndex + 1);
      CustomRowProperties.update(at, rowIndex);
    }
    if (isReplacingHeader) MoveRow.move(at, 0, true); // REF-26
    setTimeout(() => {
      if (at._isPopulatingTable) {
        UpdateCellsForRows.updateRowCells(at, rowElement, rowIndex, CELL_UPDATE_TYPE.ADD);
        // this is used to prevent multiple rebindings of same rows as upon the insertion of a new row or after pasting,
        // the data array would be populated synchronously which would cause the lastRowIndex to be high every time
        // this is called and rows between rowIndex and lastRowIndex would be rebinded multiple times
      } else if (!rowData) {
        InsertNewRow.bindAndfireCellUpdates(at, rowIndex);
      } else if (rowIndex === at.data.length - 1) {
        // may not be best to start from 0 but this method has no concept of starting point
        InsertNewRow.bindAndfireCellUpdates(at, 0);
      }
    });
  }

  // prettier-ignore
  public static insertEvent(this: ActiveTable) {
    let newRowIndex = this.data.length;
    if (this.pagination) {
      if (this._visiblityInternal.filters && this._tableBodyElementRef) {
        // before changing this check if new row can be added when none are present and one is present
        newRowIndex = this.data.length === 1 && !this.dataStartsAtHeader
          ? 1 : PaginationRowIndexes.getVisibleRowRealIndex(this._tableBodyElementRef, this._pagination) + 1;
      } else {
        const maxVisibleRowIndex = PaginationRowIndexes.getMaxVisibleRowIndex(this);
        if (maxVisibleRowIndex < newRowIndex) newRowIndex = maxVisibleRowIndex;
      }
    }
    InsertNewRow.insert(this, newRowIndex, true);
  }
}
