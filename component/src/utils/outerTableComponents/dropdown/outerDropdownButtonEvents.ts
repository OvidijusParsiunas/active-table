import {OuterContainerDropdownI} from '../../../types/outerContainerInternal';
import {OuterContentPosition} from '../../../types/outerContainer';
import {Dropdown} from '../../../elements/dropdown/dropdown';
import {OuterDropdownElement} from './outerDropdownElement';
import {ActiveTable} from '../../../activeTable';

type DisplayFunc = (at: ActiveTable, dropdownElement: HTMLElement) => void;

export class OuterDropdownButtonEvents {
  // this is used to prevent the dropdown from opening up again after clicking the button to close
  private static DO_NOT_DISPLAY_DROPDOWN_CLASS = 'do-not-display-class';

  private static mouseClickButton(at: ActiveTable, dropdownElement: HTMLElement, displayFunc: DisplayFunc) {
    if (dropdownElement.classList.contains(OuterDropdownButtonEvents.DO_NOT_DISPLAY_DROPDOWN_CLASS)) {
      dropdownElement.classList.remove(OuterDropdownButtonEvents.DO_NOT_DISPLAY_DROPDOWN_CLASS);
    } else {
      displayFunc(at, dropdownElement);
    }
  }

  private static mouseDownButton(dropdownElement: HTMLElement) {
    if (Dropdown.isDisplayed(dropdownElement)) {
      dropdownElement.classList.add(OuterDropdownButtonEvents.DO_NOT_DISPLAY_DROPDOWN_CLASS);
    }
  }

  private static getDisplayFunc(position: OuterContentPosition, dropdown: OuterContainerDropdownI) {
    if (position.startsWith('top')) return OuterDropdownElement.display.bind(this, dropdown);
    return OuterDropdownElement.displayReactToBottomVisibility.bind(this, dropdown);
  }

  // prettier-ignore
  public static set(at: ActiveTable,
      buttonElement: HTMLElement, position: OuterContentPosition, dropdown: OuterContainerDropdownI) {
    const displayFunc = OuterDropdownButtonEvents.getDisplayFunc(position, dropdown);
    buttonElement.addEventListener('mousedown', OuterDropdownButtonEvents.mouseDownButton.bind(this, dropdown.element));
    buttonElement.addEventListener('click',
      OuterDropdownButtonEvents.mouseClickButton.bind(this, at, dropdown.element, displayFunc));
  }
}
