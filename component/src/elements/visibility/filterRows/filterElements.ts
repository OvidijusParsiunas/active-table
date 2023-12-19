import {FilterInternalUtils} from '../../../utils/outerTableComponents/filter/rows/filterInternalUtils';
import {OuterContainerElements} from '../../../utils/outerTableComponents/outerContainerElements';
import {FilterDropdownElement} from './activeColumn/dropdown/filterDropdownElement';
import {ToggleableElement} from '../../../utils/elements/toggleableElement';
import {StatefulCSSEvents} from '../../../utils/elements/statefulCSSEvents';
import {FilterInputCaseElement} from './case/filterInputCaseElement';
import {ElementStyle} from '../../../utils/elements/elementStyle';
import {FilterInputElement} from './input/filterInputElement';
import {OuterContainers} from '../../../types/outerContainer';
import {CSSStyle, StatefulCSS} from '../../../types/cssStyle';
import {ActiveTable} from '../../../activeTable';
import {Filter} from '../../../types/filter';

export class FilterElements {
  public static readonly DEFAULT_INPUT_POSITION = 'top-right';

  private static createContainerElement(order?: number) {
    const containerElement = document.createElement('div');
    containerElement.classList.add('filter-rows-container');
    containerElement.style.order = String(order || 0);
    return containerElement;
  }

  // the order at which the elements are added is very important - please check the css selectors
  // prettier-ignore
  private static createComponent(at: ActiveTable, outerContainers: OuterContainers, userConfig: Filter) {
    const position = userConfig.position || FilterElements.DEFAULT_INPUT_POSITION;
    const containerElement = FilterElements.createContainerElement(userConfig.order);
    const internalConfig = FilterInternalUtils.addConfig(at, userConfig);
    if (userConfig.dropdown !== false) {
      const dropdownElement = FilterDropdownElement.create(
        at, containerElement, position, internalConfig, userConfig.styles?.dropdownIcon);
      setTimeout(() => containerElement.appendChild(dropdownElement)); // appended at the end
    }
    if (userConfig.caseButton !== false) {
      FilterInputCaseElement.create(at, containerElement, internalConfig, userConfig.styles);
    }
    const inputElement = FilterInputElement.create(internalConfig, userConfig, at.data);
    containerElement.appendChild(inputElement);
    OuterContainerElements.addToContainer(position, outerContainers, containerElement);
  }

  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    if (typeof at.filter === 'boolean') {
      FilterElements.createComponent(at, outerContainers, {});
    } else if (Array.isArray(at.filter)) {
      at.filter.forEach((userConfig) => {
        FilterElements.createComponent(at, outerContainers, userConfig);
      });
    } else if (at.filter) {
      FilterElements.createComponent(at, outerContainers, at.filter);
    }
    setTimeout(() => FilterInternalUtils.resetAllInputs(at));
  }

  public static applyStatefulStyles(element: HTMLElement, hoverStyle: CSSStyle, styles: StatefulCSS = {}) {
    const statefulStyles = ElementStyle.generateStatefulCSS(styles, hoverStyle, {color: '#484848'});
    Object.assign(element.style, statefulStyles.default);
    setTimeout(() => StatefulCSSEvents.setEvents(element, statefulStyles, ToggleableElement.ACTIVE_BUTTON_CLASS));
  }
}
