import {DropdownItemNavigation} from '../../../dropdown/dropdownItemNavigation';
import {EditableTableComponent} from '../../../../editable-table-component';
import {DropdownEvents} from '../../../dropdown/dropdownEvents';
import {KEYBOARD_KEY} from '../../../../consts/keyboardKeys';
import {NumberOfRowsDropdown} from './numberOfRowsDropdown';

export class NumberOfRowsDropdownEvents {
  public static windowOnMouseDown(etc: EditableTableComponent) {
    if (!etc.paginationInternal.mouseDownOnNumberOfRowsButton) {
      NumberOfRowsDropdown.hide(etc.paginationInternal.numberOfRowsDropdown as HTMLElement);
    }
  }

  // the reason why we track window key events is because the table is not actually focused when it is displayed,
  // (unlike column dropdown which has an input), hence initially clicking tab does not focus the dropdown and
  // instead we need to focus it programmatically here. Once focused, the actual dropdown events can take over.
  // prettier-ignore
  public static windowOnKeyDown(etc: EditableTableComponent, event: KeyboardEvent) {
    const {shadowRoot, paginationInternal} = etc;
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

  private static dropdownOnKeyDown(this: EditableTableComponent, dropdownElement: HTMLElement, event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === KEYBOARD_KEY.ENTER) {
      const itemElement = event.target as HTMLElement;
      itemElement.dispatchEvent(new MouseEvent('mousedown'));
    } else if (event.key === KEYBOARD_KEY.ESCAPE) {
      NumberOfRowsDropdown.hide(dropdownElement);
    }
    DropdownEvents.itemKeyNavigation(this.shadowRoot as ShadowRoot, dropdownElement, event);
  }

  public static set(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    dropdownElement.onkeydown = NumberOfRowsDropdownEvents.dropdownOnKeyDown.bind(etc, dropdownElement);
  }
}
