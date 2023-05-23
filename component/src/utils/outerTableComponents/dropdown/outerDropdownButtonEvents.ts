import {OuterContentPosition} from '../../../types/outerContainer';
import {Dropdown} from '../../../elements/dropdown/dropdown';
import {OuterDropdownElement} from './outerDropdownElement';
import {ActiveTable} from '../../../activeTable';

type DisplayFunc = (at: ActiveTable, dropdownElement: HTMLElement) => void;

export class OuterDropdownButtonEvents {
  // this is used to prevent the dropdown from opening up again after clicking the button to close
  private static DO_NOT_DISPLAY_DROPDOWN_CLASS = 'do-not-display-class';

  private static getDisplayFunc(position: OuterContentPosition) {
    if (position.startsWith('top')) return OuterDropdownElement.display;
    return OuterDropdownElement.displayReactToBottomVisibility;
  }

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

  // prettier-ignore
  public static set(at: ActiveTable,
      buttonElement: HTMLElement, dropdownElement: HTMLElement, position: OuterContentPosition) {
    const displayFunc = OuterDropdownButtonEvents.getDisplayFunc(position);
    buttonElement.onmousedown = OuterDropdownButtonEvents.mouseDownButton.bind(this, dropdownElement);
    buttonElement.onclick = OuterDropdownButtonEvents.mouseClickButton.bind(this, at, dropdownElement, displayFunc);
    return dropdownElement;
  }
}
