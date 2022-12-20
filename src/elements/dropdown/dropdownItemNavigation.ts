import {DropdownItem} from './dropdownItem';
import {Dropdown} from './dropdown';

export class DropdownItemNavigation {
  public static focusInputElement(inputItemElement: HTMLElement) {
    (inputItemElement.children[0] as HTMLElement).dispatchEvent(new MouseEvent('mouseenter'));
  }

  // either at the end when isNext is true or the start when isNext is false
  private static focusItemWhenOnEdge(focusedItem: HTMLElement, dropdownElement: HTMLElement, isNext: boolean) {
    // when inside an input item
    if (DropdownItem.doesElementContainInputClass(focusedItem)) {
      const itemElement = focusedItem.parentElement as HTMLElement;
      return DropdownItemNavigation.focusSiblingItem(itemElement, dropdownElement, isNext);
    }
    // when at the end of nested dropdown item
    const dropdownParent = focusedItem.parentElement?.parentElement as HTMLElement;
    if (dropdownParent.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS)) {
      dropdownElement = focusedItem.parentElement as HTMLElement;
    }
    // when on last item/item
    const lastItem = isNext ? dropdownElement.children[0] : dropdownElement.children[dropdownElement.children.length - 1];
    return DropdownItemNavigation.focusSiblingItem(lastItem as HTMLElement, dropdownElement, isNext, true);
  }

  // isEdgeItem means is it a start/end or inside item
  // prettier-ignore
  public static focusSiblingItem(focusedItem: HTMLElement,
      dropdownElement: HTMLElement, isNext: boolean, isEdgeItem = false): void {
    if (focusedItem.classList.contains(DropdownItem.DROPDOWN_NESTED_DROPDOWN_ITEM)) {
      const nestedDropdownElement = focusedItem.children[1] as HTMLElement;
      // when on item that has open nested dropdown
      if (Dropdown.isDisplayed(nestedDropdownElement)) Dropdown.hide(nestedDropdownElement);
    }
    const siblingElement = isEdgeItem
      ? focusedItem : (focusedItem[isNext ? 'nextSibling' : 'previousSibling'] as HTMLElement);
    if (!siblingElement) {
      return DropdownItemNavigation.focusItemWhenOnEdge(focusedItem, dropdownElement, isNext);
      // when item is a title, divider or not displayed
    } else if (!DropdownItem.isDisplayed(siblingElement)
        || siblingElement.classList.contains(DropdownItem.DROPDOWN_TITLE_ITEM_CLASS)
        || siblingElement.classList.contains(DropdownItem.DROPDOWN_ITEM_DIVIDER_CLASS)) {
      return DropdownItemNavigation.focusSiblingItem(siblingElement, dropdownElement, isNext);
      // when on an input item
    } else if (siblingElement.classList.contains(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS)) {
      return DropdownItemNavigation.focusInputElement(siblingElement);
    }
    siblingElement.dispatchEvent(new MouseEvent('mouseenter'));
  }

  public static focusFirstNestedDropdownItem(focusedItem: HTMLElement) {
    if (focusedItem.classList.contains(DropdownItem.DROPDOWN_NESTED_DROPDOWN_ITEM)) {
      const nestedDropdownElement = focusedItem.children[2] as HTMLElement;
      // when on item that has open nested dropdown
      if (Dropdown.isDisplayed(nestedDropdownElement)) {
        const lastNestedDropdownElement = nestedDropdownElement.children[0] as HTMLElement;
        lastNestedDropdownElement.dispatchEvent(new MouseEvent('mouseenter'));
      }
    }
  }

  public static focusNestedDropdownParentItem(focusedItem: HTMLElement) {
    const dropdownParentItem = focusedItem.parentElement?.parentElement as HTMLElement;
    if (dropdownParentItem.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS)) {
      Dropdown.hide(focusedItem.parentElement as HTMLElement);
      dropdownParentItem.dispatchEvent(new MouseEvent('mouseenter'));
    }
  }
}
