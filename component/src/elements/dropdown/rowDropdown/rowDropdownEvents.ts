import {DropdownItemNavigation} from '../dropdownItemNavigation';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {ActiveTable} from '../../../activeTable';
import {DropdownEvents} from '../dropdownEvents';
import {RowDropdown} from './rowDropdown';

export class RowDropdownEvents {
  // the reason why we track window key events is because the table is not actually focused when it is displayed,
  // (unlike column dropdown which has an input), hence initially clicking tab does not focus the dropdown and
  // instead we need to focus it programmatically here. Once focused, the actual dropdown events can take over.
  // prettier-ignore
  public static windowOnKeyDown(at: ActiveTable, event: KeyboardEvent) {
    const {_activeOverlayElements: {rowDropdown, fullTableOverlay}, shadowRoot} = at;
    if (at._focusedElements.rowDropdown || !rowDropdown || !fullTableOverlay) return;
    if (event.key === KEYBOARD_KEY.ENTER || event.key === KEYBOARD_KEY.ESCAPE) {
      RowDropdown.hide(at);
    } else if (!shadowRoot?.activeElement) {
      if (event.key === KEYBOARD_KEY.TAB || event.key === KEYBOARD_KEY.ARROW_DOWN) {
        event.preventDefault();
        at._focusedElements.rowDropdown = rowDropdown;
        DropdownItemNavigation.focusSiblingItem(rowDropdown.children[0] as HTMLElement, rowDropdown, true, true);
      } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
        at._focusedElements.rowDropdown = rowDropdown;
        DropdownItemNavigation.focusSiblingItem(
          rowDropdown.children[rowDropdown.children.length - 1] as HTMLElement, rowDropdown, false, true);
      }
    }
  }

  private static dropdownOnKeyDown(this: ActiveTable, dropdownElement: HTMLElement, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ENTER) {
      const itemElement = event.target as HTMLElement;
      itemElement.dispatchEvent(new Event('mouseenter'));
      itemElement.dispatchEvent(new Event('click'));
    } else if (event.key === KEYBOARD_KEY.ESCAPE) {
      RowDropdown.hide(this);
    }
    DropdownEvents.itemKeyNavigation(this.shadowRoot as ShadowRoot, dropdownElement, event);
  }

  public static set(at: ActiveTable, dropdownElement: HTMLElement) {
    dropdownElement.onkeydown = RowDropdownEvents.dropdownOnKeyDown.bind(at, dropdownElement);
  }
}
