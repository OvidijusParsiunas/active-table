import {DropdownItem} from './dropdownItem';
import {Dropdown} from './dropdown';

export class DropdownItemFocus {
  public static focusInputElement(inputItemElement: HTMLElement) {
    (inputItemElement.children[0] as HTMLElement).dispatchEvent(new MouseEvent('mouseenter'));
  }

  private static focusElementWhenNoNext(element: HTMLElement, dropdownElement: HTMLElement) {
    // when inside an input item
    if (DropdownItem.doesElementContainInputClass(element)) {
      const itemElement = element.parentElement as HTMLElement;
      return DropdownItemFocus.focusNextItem(itemElement, dropdownElement);
    }
    // when at the end of nested dropdown item
    const dropdownParent = element.parentElement?.parentElement as HTMLElement;
    if (dropdownParent.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS)) {
      Dropdown.hide(element.parentElement as HTMLElement);
      return DropdownItemFocus.focusNextItem(dropdownParent, dropdownElement);
    }
    // when on last item
    return DropdownItemFocus.focusNextItem(dropdownElement.children[0] as HTMLElement, dropdownElement, true);
  }

  public static focusNextItem(element: HTMLElement, dropdownElement: HTMLElement, startElement = false): void {
    if (element.classList.contains(DropdownItem.DROPDOWN_NESTED_DROPDOWN_ITEM)) {
      const nestedDropdownElement = element.children[1] as HTMLElement;
      // when on item that has open nested dropdown
      if (Dropdown.isDisplayed(nestedDropdownElement)) {
        (nestedDropdownElement.children[0] as HTMLElement).dispatchEvent(new MouseEvent('mouseenter'));
        return;
      }
    }
    const nextElement = startElement ? element : (element.nextSibling as HTMLElement);
    if (!nextElement) {
      return DropdownItemFocus.focusElementWhenNoNext(element, dropdownElement);
      // when on a title item
    } else if (nextElement.classList.contains(DropdownItem.DROPDOWN_TITLE_ITEM_CLASS)) {
      return DropdownItemFocus.focusNextItem(nextElement, dropdownElement);
      // when on an input item
    } else if (nextElement.classList.contains(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS)) {
      return DropdownItemFocus.focusInputElement(nextElement);
    }
    nextElement.dispatchEvent(new MouseEvent('mouseenter'));
  }
}
