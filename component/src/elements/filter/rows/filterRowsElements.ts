import {OuterContainerElements} from '../../../utils/outerTableComponents/outerContainerElements';
import {FilterRowsDropdownElement} from './activeColumn/dropdown/filterRowsDropdownElement';
import {FilterRowsInputCaseElement} from './case/filterRowsInputCaseElement';
import {FilterRowsInputElement} from './input/filterRowsInputElement';
import {OuterContainers} from '../../../types/outerContainer';
import {ActiveTable} from '../../../activeTable';

export class FilterRowsElements {
  private static readonly DEFAULT_INPUT_POSITION = 'top-right';
  public static readonly ICON_BUTTON_CLASS = 'outer-container-icon-button';

  private static createContainerElement() {
    const containerElement = document.createElement('div');
    containerElement.classList.add('filter-rows-container');
    return containerElement;
  }

  // the order at which the elements are added is very important - please check the css selectors
  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    const columnIndex = 1;
    const position = FilterRowsElements.DEFAULT_INPUT_POSITION;
    const containerElement = FilterRowsElements.createContainerElement();
    const inputElement = FilterRowsInputElement.create(at);
    if (typeof at.filterRows === 'boolean' || at.filterRows?.dropdown !== false) {
      const dropdownElement = FilterRowsDropdownElement.create(at, containerElement, position);
      setTimeout(() => containerElement.appendChild(dropdownElement)); // appended at the end
    }
    if (typeof at.filterRows === 'boolean' || at.filterRows?.caseButton !== false) {
      FilterRowsInputCaseElement.create(at, inputElement, containerElement, columnIndex);
    }
    containerElement.appendChild(inputElement);
    OuterContainerElements.addToContainer(position, outerContainers, containerElement);
  }
}
