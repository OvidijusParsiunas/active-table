import {OuterDropdownButtonEvents} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownButtonEvents';
import {OuterDropdownElement} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {OuterContainerDropdownI} from '../../../../../types/outerContainerInternal';
import {ActiveOverlayElements} from '../../../../../types/activeOverlayElements';
import {FilterRowsInternalConfig} from '../../../../../types/filterInternal';
import {FilterRowsButtonElement} from '../button/filterRowsButtonElement';
import {OuterContentPosition} from '../../../../../types/outerContainer';
import {FilterRowsDropdownItem} from './filterRowsDropdownItem';
import {ActiveTable} from '../../../../../activeTable';

type DisplayFunc = (at: ActiveTable, dropdown: OuterContainerDropdownI) => void;

export class FilterRowsDropdownElement {
  public static hide(activeOverlayElements: ActiveOverlayElements) {
    OuterDropdownElement.hide(activeOverlayElements);
  }

  // prettier-ignore
  private static display(
      displayFunc: DisplayFunc, config: FilterRowsInternalConfig, at: ActiveTable, dropdown: OuterContainerDropdownI) {
    if (!at.content[0]) return;
    FilterRowsDropdownItem.populate(at, dropdown.element, config);
    displayFunc(at, dropdown);
  }

  // prettier-ignore
  public static create(at: ActiveTable, containerElement: HTMLElement, position: OuterContentPosition,
      config: FilterRowsInternalConfig) {
    const buttonElement = FilterRowsButtonElement.create();
    containerElement.appendChild(buttonElement);
    const hideFunc = FilterRowsDropdownElement.hide.bind(this, at._activeOverlayElements);
    const genericDisplayFunc = OuterDropdownButtonEvents.getDisplayFunc(position);
    const displayFunc = FilterRowsDropdownElement.display.bind(this, genericDisplayFunc, config)
    const {element} = OuterDropdownElement.create(
      at, buttonElement, position, ['filter-rows-dropdown'], hideFunc, displayFunc);
    return element;
  }
}
