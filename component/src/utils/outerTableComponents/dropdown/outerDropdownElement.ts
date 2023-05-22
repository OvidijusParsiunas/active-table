import {DropdownItemNavigation} from '../../../elements/dropdown/dropdownItemNavigation';
import {OuterContentPosition} from '../../../types/outerContainer';
import {Dropdown} from '../../../elements/dropdown/dropdown';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {ActiveTable} from '../../../activeTable';

// not used for pagination as that dropdown behaves differently
export class OuterDropdownElement {
  private static hide(dropdownElement: HTMLElement) {
    Dropdown.hide(dropdownElement);
  }

  public static windowOnMouseDown(at: ActiveTable) {
    if (at._activeOverlayElements.outerContainerDropdown) {
      OuterDropdownElement.hide(at._activeOverlayElements.outerContainerDropdown);
    }
  }

  // prettier-ignore
  public static windowOnKeyDown(at: ActiveTable, event: KeyboardEvent) {
    const {shadowRoot, _activeOverlayElements: {outerContainerDropdown: dropdown}} = at;
    if (!dropdown) return;
    if (event.key === KEYBOARD_KEY.ENTER || event.key === KEYBOARD_KEY.ESCAPE) {
      OuterDropdownElement.hide(dropdown);
    } else if (!shadowRoot?.activeElement) {
      if (event.key === KEYBOARD_KEY.TAB || event.key === KEYBOARD_KEY.ARROW_DOWN) {
        event.preventDefault();
        DropdownItemNavigation.focusSiblingItem( dropdown.children[0] as HTMLElement, dropdown, true, true);
      } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
        DropdownItemNavigation.focusSiblingItem(
          dropdown.children[ dropdown.children.length - 1] as HTMLElement, dropdown, false, true);
      }
    }
  }

  private static display(at: ActiveTable, dropdownElement: HTMLElement) {
    Dropdown.display(dropdownElement);
    at._activeOverlayElements.outerContainerDropdown = dropdownElement;
  }

  private static displayTopRight(at: ActiveTable, dropdownElement: HTMLElement) {
    dropdownElement.style.right = '0px';
    dropdownElement.style.top = '100%';
    OuterDropdownElement.display(at, dropdownElement);
  }

  // WORK
  private static getDisplayFunc(position: OuterContentPosition) {
    if (position === 'top-right') {
      return OuterDropdownElement.displayTopRight;
    }
    return OuterDropdownElement.displayTopRight;
  }

  public static create(at: ActiveTable, buttonElement: HTMLElement, position: OuterContentPosition) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.classList.add('outer-container-dropdown', 'filter-rows-dropdown');
    const displayFunc = OuterDropdownElement.getDisplayFunc(position);
    buttonElement.onclick = displayFunc.bind(this, at, dropdownElement);
    return dropdownElement;
  }
}
