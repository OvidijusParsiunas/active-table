import {EditableTableComponent} from '../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {DropdownEvents} from '../dropdownEvents';
import {ColumnDropdown} from './columnDropdown';
import {DropdownItem} from '../dropdownItem';

export class ColumnDropdownEvents {
  private static onKeyDown(this: EditableTableComponent, dropdownElement: HTMLElement, event: KeyboardEvent) {
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
    DropdownEvents.itemKeyNavigation(dropdownElement, event);
  }

  public static set(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    dropdownElement.onkeydown = ColumnDropdownEvents.onKeyDown.bind(etc, dropdownElement);
  }
}
