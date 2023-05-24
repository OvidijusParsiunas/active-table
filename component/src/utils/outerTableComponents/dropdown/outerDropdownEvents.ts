import {DropdownItemNavigation} from '../../../elements/dropdown/dropdownItemNavigation';
import {OuterContainerDropdownI} from '../../../types/outerContainerInternal';
import {DropdownEvents} from '../../../elements/dropdown/dropdownEvents';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {ActiveTable} from '../../../activeTable';

export class OuterDropdownEvents {
  public static windowOnMouseDown(at: ActiveTable) {
    if (at._activeOverlayElements.outerContainerDropdown) {
      at._activeOverlayElements.outerContainerDropdown.hide();
    }
  }

  // the reason why we track window key events is because the table is not actually focused when it is displayed,
  // (unlike column dropdown which has an input), hence initially clicking tab does not focus the dropdown and
  // instead we need to focus it programmatically here. Once focused, the actual dropdown events can take over.
  // prettier-ignore
  public static windowOnKeyDown(at: ActiveTable, event: KeyboardEvent) {
    const {shadowRoot, _activeOverlayElements: {outerContainerDropdown: dropdown}} = at;
    if (!dropdown) return;
    const {element, hide} = dropdown;
    if (event.key === KEYBOARD_KEY.ENTER || event.key === KEYBOARD_KEY.ESCAPE) {
      hide();
    } else if (!shadowRoot?.activeElement) {
      if (event.key === KEYBOARD_KEY.TAB || event.key === KEYBOARD_KEY.ARROW_DOWN) {
        event.preventDefault();
        DropdownItemNavigation.focusSiblingItem(element.children[0] as HTMLElement, element, true, true);
      } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
        DropdownItemNavigation.focusSiblingItem(
          element.children[element.children.length - 1] as HTMLElement, element, false, true);
      }
    }
  }

  private static dropdownOnKeyDown(this: ActiveTable, dropdown: OuterContainerDropdownI, event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === KEYBOARD_KEY.ENTER) {
      const itemElement = event.target as HTMLElement;
      itemElement.dispatchEvent(new MouseEvent('mousedown'));
    } else if (event.key === KEYBOARD_KEY.ESCAPE) {
      dropdown.hide();
    }
    DropdownEvents.itemKeyNavigation(this.shadowRoot as ShadowRoot, dropdown.element, event);
  }

  public static set(at: ActiveTable, dropdown: OuterContainerDropdownI) {
    dropdown.element.onkeydown = OuterDropdownEvents.dropdownOnKeyDown.bind(at, dropdown);
  }
}
