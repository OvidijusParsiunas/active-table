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

  private static moveClassToLastVisibleRow(lastVisibleRow: Element, currentOwnerRow: HTMLElement | null) {
    if (currentOwnerRow) currentOwnerRow.id = '';
    lastVisibleRow.id = RowElement.LAST_VISIBLE_ROW_ID;
  }

  // REF-25
  // Add new row element is always appended to the table, but not always visible (e.g. if the user has
  // chosen not to display it or max rows has been reached), hence we must always monitor its current
  // visibility and given that it can be safely assumed that it is the last row element, we can use
  // its isDisplayed method to help assign the last-visible row id to the correct row
  public static toggleLastRowClass(shadowRoot: ShadowRoot, addNewRowElement: HTMLElement) {
    const ownerRow = shadowRoot.getElementById(RowElement.LAST_VISIBLE_ROW_ID);
    if (AddNewRowElement.isDisplayed(addNewRowElement.children[0] as HTMLElement)) {
      if (addNewRowElement.id !== RowElement.LAST_VISIBLE_ROW_ID) {
        RowElement.moveClassToLastVisibleRow(addNewRowElement, ownerRow);
      }
    } else {
      const {previousElementSibling} = addNewRowElement;
      if (previousElementSibling) RowElement.moveClassToLastVisibleRow(previousElementSibling, ownerRow);
    }
  }
}
