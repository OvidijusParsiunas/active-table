import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {ActiveTable} from '../../../activeTable';
import {DropdownEvents} from '../dropdownEvents';
import {ColumnDropdown} from './columnDropdown';
import {DropdownItem} from '../dropdownItem';

export class ColumnDropdownEvents {
  private static focusNextColumnDropdown(at: ActiveTable, event: KeyboardEvent) {
    event.preventDefault();
    ColumnDropdown.processTextAndHide(at);
    let columnIndex = at._focusedElements.cell.columnIndex as number;
    if (columnIndex === at._columnsDetails.length - 1) columnIndex = -1;
    const columnDetails = at._columnsDetails[columnIndex + 1];
    if (at._defaultColumnsSettings.columnDropdown?.displaySettings?.openMethod?.cellClick) {
      columnDetails.elements[0].click();
    } else {
      columnDetails.columnDropdownCellOverlay.click();
    }
  }

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
    } else if (event.key === KEYBOARD_KEY.TAB && this._columnsDetails.length > 0) {
      ColumnDropdownEvents.focusNextColumnDropdown(this, event);
    } else {
      DropdownEvents.itemKeyNavigation(this.shadowRoot as ShadowRoot, dropdownElement, event);
    }
  }

  public static set(at: ActiveTable, dropdownElement: HTMLElement) {
    dropdownElement.onkeydown = ColumnDropdownEvents.onKeyDown.bind(at, dropdownElement);
  }
}
