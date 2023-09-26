import {OuterContainerDropdownI} from '../../../types/outerContainerInternal';
import {ActiveOverlayElements} from '../../../types/activeOverlayElements';
import {OuterDropdownElement} from './outerDropdownElement';
import {OuterDropdownItem} from './outerDropdownItem';
import {ActiveTable} from '../../../activeTable';
import {PX} from '../../../types/dimensions';

// this is a utility class that works on top of the outer dropdown files and facilitates functionality for simple
// dropdowns that usually have pre-defined items such as export or rows per page dropdowns
export class OuterDropdownSimpleUtils {
  public static hide(activeOverlayElements: ActiveOverlayElements, dropdownItems?: HTMLElement[]) {
    OuterDropdownElement.hide(activeOverlayElements, {});
    const dropdownElement = activeOverlayElements.outerContainerDropdown?.element;
    if (dropdownElement) {
      const items = dropdownItems || (Array.from(dropdownElement.children) as HTMLElement[]);
      OuterDropdownItem.unsetHoverColors(items);
    }
  }

  private static getDropdownTopPosition(button: HTMLElement): PX {
    return `${button.offsetTop + button.offsetHeight}px`;
  }

  // this is a custom display function used by dropdowns that do not populate items on display (export, rows per page)
  public static display(button: HTMLElement, at: ActiveTable, dropdown: OuterContainerDropdownI) {
    const {element: dropdownElement} = dropdown;
    dropdownElement.style.bottom = '';
    dropdownElement.style.top = OuterDropdownSimpleUtils.getDropdownTopPosition(button);
    // needs to be displayed here to evalute if in view port
    OuterDropdownElement.displayReactToBottomVisibility(at, dropdown);
  }
}
