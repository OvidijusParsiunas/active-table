import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {ActiveTable} from '../../../activeTable';
import {DropdownEvents} from '../dropdownEvents';
import {ColumnDropdown} from './columnDropdown';
import {DropdownItem} from '../dropdownItem';

export class ColumnDropdownEvents {
  public static onKeyDown(this: ActiveTable, dropdownElement: HTMLElement, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ENTER) {
      const itemElement = event.target as HTMLElement;
      if (DropdownItem.doesElementContainInputClass(itemElement)) {
        ColumnDropdown.processTextAndHide(this);
      } else {
        itemElement.dispatchEvent(new Event('mouseenter'));
        itemElement.dispatchEvent(new Event('click'));
      }
    } else if (event.key === KEYBOARD_KEY.ESCAPE) {
      ColumnDropdown.processTextAndHide(this);
    }
    DropdownEvents.itemKeyNavigation(this.shadowRoot as ShadowRoot, dropdownElement, event);
  }

  public static set(at: ActiveTable, dropdownElement: HTMLElement) {
    dropdownElement.onkeydown = ColumnDropdownEvents.onKeyDown.bind(at, dropdownElement);
  }
}
