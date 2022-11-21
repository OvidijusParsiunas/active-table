import {DropdownItemNavigation} from './dropdownItemNavigation';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';

export class DropdownEvents {
  public static itemKeyNavigation(dropdownElement: HTMLElement, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.TAB || event.key === KEYBOARD_KEY.ARROW_DOWN) {
      event.preventDefault();
      DropdownItemNavigation.focusSiblingItem(event.target as HTMLElement, dropdownElement, true);
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      DropdownItemNavigation.focusSiblingItem(event.target as HTMLElement, dropdownElement, false);
    } else if (event.key === KEYBOARD_KEY.ARROW_RIGHT) {
      DropdownItemNavigation.focusFirstNestedDropdownItem(event.target as HTMLElement);
    } else if (event.key === KEYBOARD_KEY.ARROW_LEFT) {
      DropdownItemNavigation.focusNestedDropdownParentItem(event.target as HTMLElement);
    }
  }
}
