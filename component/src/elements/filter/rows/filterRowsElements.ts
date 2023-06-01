import {FilterRowsInternalUtils} from '../../../utils/outerTableComponents/filter/rows/filterRowsInternalUtils';
import {OuterContainerElements} from '../../../utils/outerTableComponents/outerContainerElements';
import {FilterRowsDropdownElement} from './activeColumn/dropdown/filterRowsDropdownElement';
import {FilterRowsInputCaseElement} from './case/filterRowsInputCaseElement';
import {ToggleableElement} from '../../../utils/elements/toggleableElement';
import {StatefulCSSEvents} from '../../../utils/elements/statefulCSSEvents';
import {FilterRowsInputElement} from './input/filterRowsInputElement';
import {ElementStyle} from '../../../utils/elements/elementStyle';
import {OuterContainers} from '../../../types/outerContainer';
import {CSSStyle, StatefulCSS} from '../../../types/cssStyle';
import {FilterRowsConfig} from '../../../types/filterRows';
import {ActiveTable} from '../../../activeTable';

export class FilterRowsElements {
  public static readonly DEFAULT_INPUT_POSITION = 'top-right';

  private static createContainerElement(order?: number) {
    const containerElement = document.createElement('div');
    containerElement.classList.add('filter-rows-container');
    containerElement.style.order = String(order || 0);
    return containerElement;
  }

  // the order at which the elements are added is very important - please check the css selectors
  // prettier-ignore
  private static createComponent(at: ActiveTable, outerContainers: OuterContainers, userConfig: FilterRowsConfig) {
    const position = userConfig.position || FilterRowsElements.DEFAULT_INPUT_POSITION;
    const containerElement = FilterRowsElements.createContainerElement(userConfig.order);
    const internalConfig = FilterRowsInternalUtils.addConfig(at, userConfig);
    if (userConfig.dropdown !== false) {
      const dropdownElement = FilterRowsDropdownElement.create(
        at, containerElement, position, internalConfig, userConfig.styles?.dropdownArrow);
      setTimeout(() => containerElement.appendChild(dropdownElement)); // appended at the end
    }
    if (userConfig.caseButton !== false) {
      FilterRowsInputCaseElement.create(at, containerElement, internalConfig, userConfig.styles);
    }
    const inputElement = FilterRowsInputElement.create(internalConfig, userConfig, at.content);
    containerElement.appendChild(inputElement);
    OuterContainerElements.addToContainer(position, outerContainers, containerElement);
  }

  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    if (typeof at.filterRows === 'boolean') {
      FilterRowsElements.createComponent(at, outerContainers, {});
    } else if (Array.isArray(at.filterRows)) {
      at.filterRows.forEach((userConfig) => {
        FilterRowsElements.createComponent(at, outerContainers, userConfig);
      });
    } else if (at.filterRows) {
      FilterRowsElements.createComponent(at, outerContainers, at.filterRows);
    }
    setTimeout(() => FilterRowsInternalUtils.resetAllInputs(at));
  }

  public static applyStatefulStyles(element: HTMLElement, hoverStyle: CSSStyle, styles: StatefulCSS = {}) {
    const statefulStyles = ElementStyle.generateStatefulCSS(styles, hoverStyle, {color: '#484848'});
    Object.assign(element.style, statefulStyles.default);
    setTimeout(() => StatefulCSSEvents.setEvents(element, statefulStyles, ToggleableElement.ACTIVE_BUTTON_CLASS));
  }
}
