import {EditableTableComponent} from '../../../editable-table-component';
import {DropdownItemNavigation} from '../dropdownItemNavigation';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {DropdownEvents} from '../dropdownEvents';
import {RowDropdown} from './rowDropdown';

export class RowDropdownEvents {
  // the reason why we track window key events is because the table is not actually focused when it is displayed,
  // (unlike column dropdown which has an input), hence initially clicking tab does not focus the dropdown and
  // instead we need to focus it programmatically here. Once focused, the actual dropdown events can take over.
  // prettier-ignore
  public static windowOnKeyDown(etc: EditableTableComponent, event: KeyboardEvent) {
    const {overlayElementsState: {rowDropdown, fullTableOverlay}, shadowRoot} = etc;
    if (etc.focusedElements.rowDropdown || !rowDropdown || !fullTableOverlay) return;
    if (event.key === KEYBOARD_KEY.ENTER || event.key === KEYBOARD_KEY.ESCAPE) {
      RowDropdown.hide(etc);
    } else if (!shadowRoot?.activeElement) {
      if (event.key === KEYBOARD_KEY.TAB || event.key === KEYBOARD_KEY.ARROW_DOWN) {
        event.preventDefault();
        etc.focusedElements.rowDropdown = rowDropdown;
        DropdownItemNavigation.focusSiblingItem(rowDropdown.children[0] as HTMLElement, rowDropdown, true, true);
      } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
        etc.focusedElements.rowDropdown = rowDropdown;
        DropdownItemNavigation.focusSiblingItem(
          rowDropdown.children[rowDropdown.children.length - 1] as HTMLElement, rowDropdown, false, true);
      }
    }
  }

  private static dropdownOnKeyDown(this: EditableTableComponent, dropdownElement: HTMLElement, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ENTER) {
      const itemElement = event.target as HTMLElement;
      itemElement.dispatchEvent(new Event('mouseenter'));
      itemElement.dispatchEvent(new Event('click'));
    } else if (event.key === KEYBOARD_KEY.ESCAPE) {
      RowDropdown.hide(this);
    }
    DropdownEvents.itemKeyNavigation(dropdownElement, event);
  }

  public static set(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    dropdownElement.onkeydown = RowDropdownEvents.dropdownOnKeyDown.bind(etc, dropdownElement);
  }
}
