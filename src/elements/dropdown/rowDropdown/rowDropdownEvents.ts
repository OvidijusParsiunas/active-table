import {EditableTableComponent} from '../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {DropdownItemFocus} from '../dropdownItemFocus';
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
    } else if (event.key === KEYBOARD_KEY.TAB) {
      event.preventDefault();
      etc.focusedElements.rowDropdown = rowDropdown;
      // the reason why the last item is used is because the next item that is going to be focused will be the first item
      if (!shadowRoot?.activeElement) DropdownItemFocus.focusNextItem(RowDropdown.LAST_ITEM as HTMLElement, rowDropdown);
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      
    }
  }

  private static dropdownOnKeyDown(this: EditableTableComponent, dropdownElement: HTMLElement, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ENTER) {
      const itemElement = event.target as HTMLElement;
      itemElement.dispatchEvent(new Event('mouseenter'));
      itemElement.dispatchEvent(new Event('click'));
    } else if (event.key === KEYBOARD_KEY.ESCAPE) {
      RowDropdown.hide(this);
    } else if (event.key === KEYBOARD_KEY.TAB) {
      event.preventDefault();
      DropdownItemFocus.focusNextItem(event.target as HTMLElement, dropdownElement);
    }
  }

  public static set(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    dropdownElement.onkeydown = RowDropdownEvents.dropdownOnKeyDown.bind(etc, dropdownElement);
  }
}
