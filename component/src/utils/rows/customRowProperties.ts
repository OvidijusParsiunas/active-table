import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationUtils} from '../outerTableComponents/pagination/paginationUtils';
import {RowHoverEvents} from './rowHoverEvents';
import {ActiveTable} from '../../activeTable';
import {CSSStyle} from '../../types/cssStyle';
import {StripedRows} from './stripedRows';

export class CustomRowProperties {
  private static setStyle(at: ActiveTable, rowElement: HTMLElement, rowIndex: number, isAddRowEven: boolean) {
    if (at._stripedRows) {
      if (isAddRowEven && AddNewRowElement.isAddNewRowRow(rowElement)) {
        rowIndex = Number(!at.dataStartsAtHeader); // REF-32
      }
      return StripedRows.setRowStyle(rowElement, rowIndex, at._stripedRows);
    }
    return undefined;
  }

  // prettier-ignore
  public static updateRow(at: ActiveTable, rowElement: HTMLElement, rowIndex: number, isAddRowEven: boolean,
      lastRowIndex: number) {
    const defaultStyle: CSSStyle | undefined = CustomRowProperties.setStyle(at, rowElement, rowIndex, isAddRowEven);
    // the reason why last row events are applied synchronously is because upon adding a new row via add new row element,
    // mouse leave is triggered on that element, hence need to add the event before it to use the correct default style
    if (rowIndex === lastRowIndex) {
      RowHoverEvents.addEvents(at, rowElement, rowIndex, defaultStyle);
    } else {
      setTimeout(() => {
        RowHoverEvents.addEvents(at, rowElement, rowIndex, defaultStyle);
      });
    }
  }

  // REF-32
  private static isAddRowRowSame(at: ActiveTable) {
    return !!(
      at.pagination &&
      at._frameComponents.displayAddNewRow &&
      PaginationUtils.getLastPossiblePageNumber(at) !== at._pagination.activePageNumber
    );
  }

  // this can be considered to be wasteful if no striped rows are used and we are resetting the same row events
  // every time this is called, however we are still traversing all rows from startIndex for code simplicity
  public static update(at: ActiveTable, startIndex = 0) {
    if (!at._tableBodyElementRef) return;
    const rows = Array.from(at._tableBodyElementRef.children) as HTMLElement[];
    const isAddRowEven = CustomRowProperties.isAddRowRowSame(at);
    const lastRowIndex = rows.length - 1;
    rows.slice(startIndex).forEach((rowElement, rowIndex) => {
      const relativeRowIndex = rowIndex + startIndex;
      CustomRowProperties.updateRow(at, rowElement, relativeRowIndex, isAddRowEven, lastRowIndex);
    });
  }
}
