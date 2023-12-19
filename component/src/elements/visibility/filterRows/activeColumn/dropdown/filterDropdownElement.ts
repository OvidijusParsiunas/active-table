import {OuterDropdownButtonEvents} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownButtonEvents';
import {OuterDropdownElement} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {OuterContainerDropdownI} from '../../../../../types/outerContainerInternal';
import {ActiveOverlayElements} from '../../../../../types/activeOverlayElements';
import {OuterContentPosition} from '../../../../../types/outerContainer';
import {FilterInternal} from '../../../../../types/visibilityInternal';
import {FilterButtonElement} from '../button/filterButtonElement';
import {FilterStyles} from '../../../../../types/filter';
import {FilterDropdownItem} from './filterDropdownItem';
import {CSSStyle} from '../../../../../types/cssStyle';
import {ActiveTable} from '../../../../../activeTable';

type DisplayFunc = (at: ActiveTable, dropdown: OuterContainerDropdownI) => void;

export class FilterDropdownElement {
  public static hide(activeStyle: CSSStyle, activeOverlayElements: ActiveOverlayElements) {
    OuterDropdownElement.hide(activeOverlayElements, activeStyle);
  }

  // prettier-ignore
  private static display(
      displayFunc: DisplayFunc, config: FilterInternal, at: ActiveTable, dropdown: OuterContainerDropdownI) {
    if (!at.data[0]) return;
    FilterDropdownItem.populate(at, dropdown, config);
    displayFunc(at, dropdown);
  }

  // prettier-ignore
  public static create(at: ActiveTable, containerElement: HTMLElement, position: OuterContentPosition,
      config: FilterInternal, dropdownArrowStyles?: FilterStyles['dropdownIcon']) {
    const buttonElement = FilterButtonElement.create(dropdownArrowStyles);
    containerElement.appendChild(buttonElement);
    const customActiveStyle = dropdownArrowStyles?.active || {};
    const activeStyle = {...FilterButtonElement.ACTIVE_STYLE, ...customActiveStyle};
    const hideFunc = FilterDropdownElement.hide.bind(this, activeStyle, at._activeOverlayElements);
    const genericDisplayFunc = OuterDropdownButtonEvents.getDisplayFunc(position);
    const displayFunc = FilterDropdownElement.display.bind(this, genericDisplayFunc, config)
    const {element} = OuterDropdownElement.create(
      at, buttonElement, position, activeStyle, ['filter-rows-dropdown'], hideFunc, displayFunc);
    return element;
  }
}
