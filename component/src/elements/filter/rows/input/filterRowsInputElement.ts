import {FilterRowsInternalConfig} from '../../../../types/filterInternal';

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

  public static create(config: FilterRowsInternalConfig) {
    const inputElement = FilterRowsInputElement.createElement();
    config.inputElement = inputElement;
    return inputElement;
  }
}
