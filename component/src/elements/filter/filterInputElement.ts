import {OuterContainerElements} from '../../utils/outerTableComponents/outerContainerElements';
import {FilterInputCaseElement} from './filterInputCaseElement';
import {OuterContainers} from '../../types/outerContainer';
import {FilterInputEvents} from './filterInputEvents';
import {ActiveTable} from '../../activeTable';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
export class FilterInputElement {
  private static readonly DEFAULT_INPUT_POSITION = 'top-right';
  private static readonly FILTER_INPUT_CLASS = 'row-filter-input';

  private static createElement() {
    const inputElement = document.createElement('input');
    inputElement.placeholder = 'Filter Planets...';
    inputElement.classList.add(FilterInputElement.FILTER_INPUT_CLASS);
    inputElement.style.order = '1';
    return inputElement;
  }

  private static createContainerElement() {
    const containerElement = document.createElement('div');
    containerElement.classList.add('row-filter-input-container');
    return containerElement;
  }

  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    const columnIndex = 1;
    const containerElement = FilterInputElement.createContainerElement();
    const inputElement = FilterInputElement.createElement();
    containerElement.appendChild(inputElement);
    if (typeof at.filter === 'boolean' || at.filter?.caseButton !== false) {
      FilterInputCaseElement.create(at, inputElement, containerElement, columnIndex);
    }
    OuterContainerElements.addToContainer(FilterInputElement.DEFAULT_INPUT_POSITION, outerContainers, containerElement);
    setTimeout(() => FilterInputEvents.setEvents(at, inputElement, columnIndex, false));
  }
}
