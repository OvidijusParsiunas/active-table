import {DropdownItemNavigation} from '../../../elements/dropdown/dropdownItemNavigation';
import {DropdownEvents} from '../../../elements/dropdown/dropdownEvents';
import {OuterDropdownElement} from './outerDropdownElement';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {ActiveTable} from '../../../activeTable';

export class OuterDropdownEvents {
  public static windowOnMouseDown(at: ActiveTable) {
    if (at._activeOverlayElements.outerContainerDropdown) {
      OuterDropdownElement.hide(at._activeOverlayElements.outerContainerDropdown);
    }
  }

  // prettier-ignore
  public static windowOnKeyDown(at: ActiveTable, event: KeyboardEvent) {
    const {shadowRoot, _activeOverlayElements: {outerContainerDropdown: dropdown}} = at;
    if (!dropdown) return;
    if (event.key === KEYBOARD_KEY.ENTER || event.key === KEYBOARD_KEY.ESCAPE) {
      OuterDropdownElement.hide(dropdown);
    } else if (!shadowRoot?.activeElement) {
      if (event.key === KEYBOARD_KEY.TAB || event.key === KEYBOARD_KEY.ARROW_DOWN) {
        event.preventDefault();
        DropdownItemNavigation.focusSiblingItem(dropdown.children[0] as HTMLElement, dropdown, true, true);
      } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
        DropdownItemNavigation.focusSiblingItem(
          dropdown.children[ dropdown.children.length - 1] as HTMLElement, dropdown, false, true);
      }
    }
  }

  private static dropdownOnKeyDown(this: ActiveTable, dropdownElement: HTMLElement, event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === KEYBOARD_KEY.ENTER) {
      const itemElement = event.target as HTMLElement;
      itemElement.dispatchEvent(new MouseEvent('mousedown'));
    } else if (event.key === KEYBOARD_KEY.ESCAPE) {
      OuterDropdownElement.hide(dropdownElement);
    }
    DropdownEvents.itemKeyNavigation(this.shadowRoot as ShadowRoot, dropdownElement, event);
  }

  public static set(at: ActiveTable, dropdownElement: HTMLElement) {
    dropdownElement.onkeydown = OuterDropdownEvents.dropdownOnKeyDown.bind(at, dropdownElement);
  }
}
