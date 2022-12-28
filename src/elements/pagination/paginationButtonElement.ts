import {EditableTableComponent} from '../../editable-table-component';
import {PaginationButtonEvents} from './paginationButtonEvents';

export class PaginationButtonElement {
  private static readonly PAGINATION_BUTTON_CLASS = 'pagination-button';
  public static readonly DISABLED_PAGINATION_BUTTON_CLASS = 'pagination-button-disabled';

  public static create(etc: EditableTableComponent, number: number) {
    const button = document.createElement('div');
    button.innerText = String(number);
    button.classList.add(PaginationButtonElement.PAGINATION_BUTTON_CLASS);
    setTimeout(() => PaginationButtonEvents.setEvents(etc, button, number));
    return button;
  }
}
