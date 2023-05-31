import {OuterDropdownButtonEvents} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownButtonEvents';
import {OuterDropdownElement} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {OuterContainerDropdownI} from '../../../../../types/outerContainerInternal';
import {ActiveOverlayElements} from '../../../../../types/activeOverlayElements';
import {FilterRowsInternalConfig} from '../../../../../types/filterInternal';
import {FilterRowsButtonElement} from '../button/filterRowsButtonElement';
import {OuterContentPosition} from '../../../../../types/outerContainer';
import {FilterRowsStyles} from '../../../../../types/filterRows';
import {FilterRowsDropdownItem} from './filterRowsDropdownItem';
import {CSSStyle} from '../../../../../types/cssStyle';
import {ActiveTable} from '../../../../../activeTable';

type DisplayFunc = (at: ActiveTable, dropdown: OuterContainerDropdownI) => void;

export class FilterRowsDropdownElement {
  public static hide(activeStyle: CSSStyle, activeOverlayElements: ActiveOverlayElements) {
    OuterDropdownElement.hide(activeOverlayElements, activeStyle);
  }

  // prettier-ignore
  private static display(
      displayFunc: DisplayFunc, config: FilterRowsInternalConfig, at: ActiveTable, dropdown: OuterContainerDropdownI) {
    if (!at.content[0]) return;
    FilterRowsDropdownItem.populate(at, dropdown, config);
    displayFunc(at, dropdown);
  }

  // prettier-ignore
  public static create(at: ActiveTable, containerElement: HTMLElement, position: OuterContentPosition,
      config: FilterRowsInternalConfig, dropdownArrowStyles?: FilterRowsStyles['dropdownArrow']) {
    const buttonElement = FilterRowsButtonElement.create(dropdownArrowStyles);
    containerElement.appendChild(buttonElement);
    const customActiveStyle = dropdownArrowStyles?.active || {};
    const activeStyle = {...FilterRowsButtonElement.ACTIVE_STYLE, ...customActiveStyle};
    const hideFunc = FilterRowsDropdownElement.hide.bind(this, activeStyle, at._activeOverlayElements);
    const genericDisplayFunc = OuterDropdownButtonEvents.getDisplayFunc(position);
    const displayFunc = FilterRowsDropdownElement.display.bind(this, genericDisplayFunc, config)
    const {element} = OuterDropdownElement.create(
      at, buttonElement, position, activeStyle, ['filter-rows-dropdown'], hideFunc, displayFunc);
    return element;
  }
}
