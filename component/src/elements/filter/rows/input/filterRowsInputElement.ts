import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
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

  public static create(at: ActiveTable, config: FilterRowsInternalConfig) {
    const inputElement = FilterRowsInputElement.createElement();
    config.inputElement = inputElement;
    setTimeout(() => FilterRowsInputEvents.setEvents(at, config));
    return inputElement;
  }
}
