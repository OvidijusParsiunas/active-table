import {OuterContainerDropdownI} from '../../../types/outerContainerInternal';
import {ToggleableElement} from '../../elements/toggleableElement';
import {OuterContentPosition} from '../../../types/outerContainer';
import {Dropdown} from '../../../elements/dropdown/dropdown';
import {OuterDropdownElement} from './outerDropdownElement';
import {ActiveTable} from '../../../activeTable';

type DisplayFunc = (at: ActiveTable, dropdown: OuterContainerDropdownI) => void;

export class OuterDropdownButtonEvents {
  // this is used to prevent the dropdown from opening up again after clicking the button to close
  private static readonly DO_NOT_DISPLAY_DROPDOWN_CLASS = 'do-not-display-class';

  private static mouseClickButton(at: ActiveTable, dropdown: OuterContainerDropdownI, displayFunc: DisplayFunc) {
    const {element} = dropdown;
    if (element.classList.contains(OuterDropdownButtonEvents.DO_NOT_DISPLAY_DROPDOWN_CLASS)) {
      element.classList.remove(OuterDropdownButtonEvents.DO_NOT_DISPLAY_DROPDOWN_CLASS);
    } else {
      displayFunc(at, dropdown);
    }
  }

  private static mouseDownButton(dropdown: OuterContainerDropdownI) {
    const {element, button, activeButtonStyle} = dropdown;
    if (Dropdown.isDisplayed(element)) {
      element.classList.add(OuterDropdownButtonEvents.DO_NOT_DISPLAY_DROPDOWN_CLASS);
      ToggleableElement.unsetActive(button, activeButtonStyle);
    }
  }

  public static getDisplayFunc(position: OuterContentPosition) {
    if (position.startsWith('top')) return OuterDropdownElement.display;
    return OuterDropdownElement.displayReactToBottomVisibility;
  }

  // prettier-ignore
  public static set(at: ActiveTable, buttonElement: HTMLElement, position: OuterContentPosition,
      dropdown: OuterContainerDropdownI, displayFuncArg?: DisplayFunc) {
    const displayFunc = displayFuncArg || OuterDropdownButtonEvents.getDisplayFunc(position);
    buttonElement.addEventListener('mousedown', OuterDropdownButtonEvents.mouseDownButton.bind(this, dropdown));
    buttonElement.addEventListener('click',
      OuterDropdownButtonEvents.mouseClickButton.bind(this, at, dropdown, displayFunc));
  }
}
