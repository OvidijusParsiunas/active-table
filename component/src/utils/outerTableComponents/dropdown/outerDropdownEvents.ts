import {DropdownItemNavigation} from '../../../elements/dropdown/dropdownItemNavigation';
import {OuterContainerDropdownI} from '../../../types/outerContainerInternal';
import {DropdownEvents} from '../../../elements/dropdown/dropdownEvents';
import {DropdownItem} from '../../../elements/dropdown/dropdownItem';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {ActiveTable} from '../../../activeTable';

export class OuterDropdownEvents {
  public static windowOnMouseDown(at: ActiveTable) {
    if (at._activeOverlayElements.outerContainerDropdown) {
      at._activeOverlayElements.outerContainerDropdown.hide();
    }
  }

  private static focusSiblingItem(dropdownEl: HTMLElement, item: HTMLElement, sibling: 'previousSibling' | 'nextSibling') {
    const siblingItem = item?.[sibling] as HTMLElement;
    if (siblingItem) {
      DropdownItemNavigation.focusSiblingItem(siblingItem, dropdownEl, true, true);
    } else {
      if (sibling === 'nextSibling') {
        const firstItem = dropdownEl.children[0] as HTMLElement;
        if (firstItem) DropdownItemNavigation.focusSiblingItem(firstItem, dropdownEl, true, true);
      } else {
        const lastItem = dropdownEl.children[dropdownEl.children.length - 1] as HTMLElement;
        if (lastItem) DropdownItemNavigation.focusSiblingItem(lastItem, dropdownEl, false, true);
      }
    }
  }

  // prettier-ignore
  private static windowOnKeyDownNavigation(dropdownEl: HTMLElement, key: string) {
    const activeItem = dropdownEl.getElementsByClassName(DropdownItem.ACTIVE_ITEM_CLASS)[0] as HTMLElement;
    if (key === KEYBOARD_KEY.TAB || key === KEYBOARD_KEY.ARROW_DOWN) {
      if (activeItem) {
        OuterDropdownEvents.focusSiblingItem(dropdownEl, activeItem, 'nextSibling');
      } else {
        DropdownItemNavigation.focusSiblingItem(dropdownEl.children[0] as HTMLElement, dropdownEl, true, true);          
      }
    } else if (key === KEYBOARD_KEY.ARROW_UP) {
      if (activeItem) {
        OuterDropdownEvents.focusSiblingItem(dropdownEl, activeItem, 'previousSibling');
      } else {
        DropdownItemNavigation.focusSiblingItem(
          dropdownEl.children[dropdownEl.children.length - 1] as HTMLElement, dropdownEl, false, true);       
      }
    }
  }

  // the reason why we track window key events is because the table is not actually focused when it is displayed,
  // (unlike column dropdown which has an input), hence initially clicking tab does not focus the dropdown and
  // instead we need to focus it programmatically here. Once focused, the actual dropdown events can take over.
  // prettier-ignore
  public static windowOnKeyDown(at: ActiveTable, event: KeyboardEvent) {
    const {shadowRoot, _activeOverlayElements: {outerContainerDropdown: dropdown}} = at;
    if (!dropdown) return;
    event.preventDefault();
    const {element, hide} = dropdown;
    if (event.key === KEYBOARD_KEY.ENTER || event.key === KEYBOARD_KEY.ESCAPE) {
      hide();
    } else if (!shadowRoot?.activeElement) {
      OuterDropdownEvents.windowOnKeyDownNavigation(element, event.key)
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
