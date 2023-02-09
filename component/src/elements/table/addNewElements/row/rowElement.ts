import {ActiveTable} from '../../../../activeTable';
import {AddNewRowElement} from './addNewRowElement';

export class RowElement {
  // REF-25
  // the reason why ID is used instead of a class is because only one element should ever have this at any given time
  private static readonly LAST_VISIBLE_ROW_ID = 'last-visible-row';

  public static create() {
    const rowElement = document.createElement('tr');
    rowElement.classList.add('row');
    return rowElement;
  }

  private static moveClassToLastVisibleRow(lastVisibleRow: Element, lastMarkedRow: HTMLElement | null) {
    if (lastMarkedRow) lastMarkedRow.id = '';
    lastVisibleRow.id = RowElement.LAST_VISIBLE_ROW_ID;
  }

  private static toggleNonAddRow(at: ActiveTable, addNewRowElement: HTMLElement, lastMarkedRow: HTMLElement | null) {
    if (at.pagination && at.paginationInternal) {
      const lastVisibleElement = at.paginationInternal.visibleRows[at.paginationInternal.visibleRows.length - 1];
      if (lastVisibleElement) return RowElement.moveClassToLastVisibleRow(lastVisibleElement, lastMarkedRow);
    }
    const {previousElementSibling} = addNewRowElement;
    if (previousElementSibling) RowElement.moveClassToLastVisibleRow(previousElementSibling, lastMarkedRow);
  }

  // REF-25
  // Add new row element is always appended to the table, but not always visible (e.g. if the user has
  // chosen not to display it or max rows has been reached), hence we must always monitor its current
  // visibility and given that it can be safely assumed that it is the last row element, we can use
  // its isDisplayed method to help assign the last-visible row id to the correct row
  public static toggleLastRowClass(at: ActiveTable) {
    const shadowRoot = at.shadowRoot as ShadowRoot;
    const addNewRowElement = (at.addRowCellElementRef as HTMLElement).parentElement as HTMLElement;
    const lastMarkedRow = shadowRoot.getElementById(RowElement.LAST_VISIBLE_ROW_ID);
    if (AddNewRowElement.isDisplayed(addNewRowElement.children[0] as HTMLElement)) {
      if (addNewRowElement.id !== RowElement.LAST_VISIBLE_ROW_ID) {
        RowElement.moveClassToLastVisibleRow(addNewRowElement, lastMarkedRow);
      }
    } else {
      RowElement.toggleNonAddRow(at, addNewRowElement, lastMarkedRow);
    }
  }
}
