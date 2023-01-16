import {DropdownItemNavigation} from './dropdownItemNavigation';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';

export class DropdownEvents {
  public static itemKeyNavigation(shadowRoot: ShadowRoot, dropdownElement: HTMLElement, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.TAB || event.key === KEYBOARD_KEY.ARROW_DOWN) {
      event.preventDefault();
      // workaround for when opened dropdown does not have a focused item
      const focusedElement = !shadowRoot?.activeElement ? dropdownElement.children[0] : event.target;
      DropdownItemNavigation.focusSiblingItem(focusedElement as HTMLElement, dropdownElement, true);
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      DropdownItemNavigation.focusSiblingItem(event.target as HTMLElement, dropdownElement, false);
    } else if (event.key === KEYBOARD_KEY.ARROW_RIGHT) {
      DropdownItemNavigation.focusFirstNestedDropdownItem(event.target as HTMLElement);
    } else if (event.key === KEYBOARD_KEY.ARROW_LEFT) {
      DropdownItemNavigation.focusNestedDropdownParentItem(event.target as HTMLElement);
    }
  }
}
