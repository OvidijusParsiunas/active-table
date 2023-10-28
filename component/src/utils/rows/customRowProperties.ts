import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationUtils} from '../outerTableComponents/pagination/paginationUtils';
import {RowHoverEvents} from './rowHoverEvents';
import {ActiveTable} from '../../activeTable';
import {CSSStyle} from '../../types/cssStyle';
import {StripedRows} from './stripedRows';

export class CustomRowProperties {
  private static setStyle(etc: ActiveTable, rowElement: HTMLElement, rowIndex: number, isAddRowEven: boolean) {
    if (etc._stripedRows) {
      if (isAddRowEven && AddNewRowElement.isAddNewRowRow(rowElement)) {
        rowIndex = Number(!etc.dataStartsAtHeader); // REF-32
      }
      return StripedRows.setRowStyle(rowElement, rowIndex, etc._stripedRows);
    }
    return undefined;
  }

  // prettier-ignore
  public static updateRow(etc: ActiveTable, rowElement: HTMLElement, rowIndex: number, isAddRowEven: boolean,
      lastRowIndex: number) {
    const defaultStyle: CSSStyle | undefined = CustomRowProperties.setStyle(etc, rowElement, rowIndex, isAddRowEven);
    // the reason why last row events are applied synchronously is because upon adding a new row via add new row element,
    // mouse leave is triggered on that element, hence need to add the event before it to use the correct default style
    if (rowIndex === lastRowIndex) {
      RowHoverEvents.addEvents(etc, rowElement, rowIndex, defaultStyle);
    } else {
      setTimeout(() => {
        RowHoverEvents.addEvents(etc, rowElement, rowIndex, defaultStyle);
      });
    }
  }

  // REF-32
  private static isAddRowRowSame(etc: ActiveTable) {
    return !!(
      etc.pagination &&
      etc._frameComponents.displayAddNewRow &&
      PaginationUtils.getLastPossiblePageNumber(etc) !== etc._pagination.activePageNumber
    );
  }

  // this can be considered to be wasteful if no striped rows are used and we are resetting the same row events
  // every time this is called, however we are still traversing all rows from startIndex for code simplicity
  public static update(etc: ActiveTable, startIndex = 0) {
    if (!etc._tableBodyElementRef) return;
    const rows = Array.from(etc._tableBodyElementRef.children) as HTMLElement[];
    const isAddRowEven = CustomRowProperties.isAddRowRowSame(etc);
    const lastRowIndex = rows.length - 1;
    rows.slice(startIndex).forEach((rowElement, rowIndex) => {
      const relativeRowIndex = rowIndex + startIndex;
      CustomRowProperties.updateRow(etc, rowElement, relativeRowIndex, isAddRowEven, lastRowIndex);
    });
  }
}
