import {FilterRowsInputEvents} from './filterRowsInputEvents';
import {ActiveTable} from '../../../../activeTable';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
export class FilterRowsInputElement {
  private static readonly INPUT_CLASS = 'filter-rows-input';

  private static createElement() {
    const inputElement = document.createElement('input');
    inputElement.placeholder = 'Filter Planets...';
    inputElement.classList.add(FilterRowsInputElement.INPUT_CLASS);
    inputElement.style.order = '1';
    return inputElement;
  }

  public static create(at: ActiveTable) {
    const columnIndex = 1;
    const inputElement = FilterRowsInputElement.createElement();
    setTimeout(() => FilterRowsInputEvents.setEvents(at, inputElement, columnIndex, false));
    return inputElement;
  }
}
