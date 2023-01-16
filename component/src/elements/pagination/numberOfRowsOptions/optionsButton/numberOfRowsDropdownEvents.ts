import {DropdownItemNavigation} from '../../../dropdown/dropdownItemNavigation';
import {DropdownEvents} from '../../../dropdown/dropdownEvents';
import {KEYBOARD_KEY} from '../../../../consts/keyboardKeys';
import {NumberOfRowsDropdown} from './numberOfRowsDropdown';
import {ActiveTable} from '../../../../activeTable';

export class NumberOfRowsDropdownEvents {
  public static windowOnMouseDown(at: ActiveTable) {
    if (!at.paginationInternal.mouseDownOnNumberOfRowsButton) {
      NumberOfRowsDropdown.hide(at.paginationInternal.numberOfRowsDropdown as HTMLElement);
    }
  }

  // the reason why we track window key events is because the table is not actually focused when it is displayed,
  // (unlike column dropdown which has an input), hence initially clicking tab does not focus the dropdown and
  // instead we need to focus it programmatically here. Once focused, the actual dropdown events can take over.
  // prettier-ignore
  public static windowOnKeyDown(at: ActiveTable, event: KeyboardEvent) {
    const {shadowRoot, paginationInternal} = at;
    const dropdownElement = paginationInternal.numberOfRowsDropdown as HTMLElement;
    if (event.key === KEYBOARD_KEY.ESCAPE || event.key === KEYBOARD_KEY.ENTER) {
      NumberOfRowsDropdown.hide(dropdownElement);
    } else if (!shadowRoot?.activeElement) {
      if (event.key === KEYBOARD_KEY.ARROW_DOWN || event.key === KEYBOARD_KEY.TAB) {
        event.preventDefault();
        DropdownItemNavigation.focusSiblingItem(dropdownElement.children[0] as HTMLElement, dropdownElement, true, true);
      } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
        DropdownItemNavigation.focusSiblingItem(
          dropdownElement.children[dropdownElement.children.length - 1] as HTMLElement, dropdownElement, false, true);
      }
    }
  }

  private static dropdownOnKeyDown(this: ActiveTable, dropdownElement: HTMLElement, event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === KEYBOARD_KEY.ENTER) {
      const itemElement = event.target as HTMLElement;
      itemElement.dispatchEvent(new MouseEvent('mousedown'));
    } else if (event.key === KEYBOARD_KEY.ESCAPE) {
      NumberOfRowsDropdown.hide(dropdownElement);
    }
    DropdownEvents.itemKeyNavigation(this.shadowRoot as ShadowRoot, dropdownElement, event);
  }

  public static set(at: ActiveTable, dropdownElement: HTMLElement) {
    dropdownElement.onkeydown = NumberOfRowsDropdownEvents.dropdownOnKeyDown.bind(at, dropdownElement);
  }
}
