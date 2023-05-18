import {OuterContainerElements} from '../../utils/outerTableComponents/outerContainerElements';
import {OuterContainers} from '../../types/outerContainer';
import {FilterInputEvents} from './filterInputEvents';
import {ActiveTable} from '../../activeTable';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
export class FilterInputElement {
  private static readonly DEFAULT_INPUT_POSITION = 'top-right';
  private static readonly FILTER_INPUT_CLASS = 'filter-input';

  private static createElement() {
    const inputElement = document.createElement('input');
    inputElement.placeholder = 'Filter Planets...';
    inputElement.classList.add(FilterInputElement.FILTER_INPUT_CLASS);
    inputElement.style.order = '1';
    return inputElement;
  }

  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    const inputElement = FilterInputElement.createElement();
    OuterContainerElements.addToContainer(FilterInputElement.DEFAULT_INPUT_POSITION, outerContainers, inputElement);
    setTimeout(() => FilterInputEvents.setEvents(at, inputElement, 1));
  }
}
