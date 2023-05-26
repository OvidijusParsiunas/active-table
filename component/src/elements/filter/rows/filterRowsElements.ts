import {FilterRowsInternalUtils} from '../../../utils/outerTableComponents/filter/rows/filterRowsUtils';
import {OuterContainerElements} from '../../../utils/outerTableComponents/outerContainerElements';
import {FilterRowsDropdownElement} from './activeColumn/dropdown/filterRowsDropdownElement';
import {FilterRowsInputCaseElement} from './case/filterRowsInputCaseElement';
import {FilterRowsInputElement} from './input/filterRowsInputElement';
import {FilterRowsInputEvents} from './input/filterRowsInputEvents';
import {OuterContainers} from '../../../types/outerContainer';
import {FilterRowsConfig} from '../../../types/filterRows';
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
  private static createButton(at: ActiveTable, outerContainers: OuterContainers, userConfig: FilterRowsConfig) {
    const position = FilterRowsElements.DEFAULT_INPUT_POSITION;
    const containerElement = FilterRowsElements.createContainerElement();
    const internalConfig = FilterRowsInternalUtils.generateConfig(at, userConfig.defaultColumnHeaderName);
    if (userConfig.dropdown !== false) {
      const dropdownElement = FilterRowsDropdownElement.create(at, containerElement, position, internalConfig);
      setTimeout(() => containerElement.appendChild(dropdownElement)); // appended at the end
    }
    if (userConfig.caseButton !== false) {
      FilterRowsInputCaseElement.create(at, containerElement, internalConfig);
    }
    const inputElement = FilterRowsInputElement.create(internalConfig);
    containerElement.appendChild(inputElement);
    OuterContainerElements.addToContainer(position, outerContainers, containerElement);
  }

  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    if (typeof at.filterRows === 'boolean') {
      FilterRowsElements.createButton(at, outerContainers, {});
    } else if (Array.isArray(at.filterRows)) {
      at.filterRows.forEach((userConfig) => {
        FilterRowsElements.createButton(at, outerContainers, userConfig);
      });
    } else if (at.filterRows) {
      FilterRowsElements.createButton(at, outerContainers, at.filterRows);
    }
    setTimeout(() => FilterRowsInputEvents.setEventsForAllInputs(at));
  }
}
