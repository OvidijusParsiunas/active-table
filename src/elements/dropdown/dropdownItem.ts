import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {ElementViewPort} from '../../utils/elements/elementViewPort';
import {Dropdown} from './dropdown';

export class DropdownItem {
  protected static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  protected static readonly DROPDOWN_INPUT_CLASS = 'dropdown-input';
  private static readonly DROPDOWN_INPUT_ITEM_CLASS = 'dropdown-input-item';
  private static readonly DROPDOWN_TITLE_ITEM_CLASS = 'dropdown-title-item';
  private static readonly DROPDOWN_HOVERABLE_ITEM = 'dropdown-hoverable-item';
  private static readonly DROPDOWN_NESTED_DROPDOWN_ITEM = 'dropdown-nested-dropdown-item';

  private static createItem(dropdownElement: HTMLElement) {
    const itemElement = document.createElement('div');
    itemElement.tabIndex = dropdownElement.children.length;
    itemElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS);
    return itemElement;
  }

  public static addInputItem(dropdownElement: HTMLElement) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS);
    const inputElement = document.createElement('input');
    inputElement.classList.add(DropdownItem.DROPDOWN_INPUT_CLASS);
    // TO-DO hook up with the parent API
    inputElement.spellcheck = false;
    itemElement.appendChild(inputElement);
    dropdownElement.appendChild(itemElement);
  }

  public static addButtonItem(dropdownElement: HTMLElement, text: string, className?: string) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_HOVERABLE_ITEM);
    if (className) itemElement.classList.add(className);
    const textElement = document.createElement('div');
    textElement.textContent = text;
    itemElement.append(textElement);
    dropdownElement.appendChild(itemElement);
  }

  public static addTitle(dropdownElement: HTMLElement, text: string) {
    const title = document.createElement('div');
    title.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS, DropdownItem.DROPDOWN_TITLE_ITEM_CLASS);
    title.textContent = text;
    dropdownElement.appendChild(title);
  }

  private static displayAndSetChildDropdownPosition(event: MouseEvent) {
    const childDropdownElement = (event.target as HTMLElement).children[1] as HTMLElement;
    const parentDropdownElement = (event.target as HTMLElement).parentElement as HTMLElement;
    childDropdownElement.style.left = parentDropdownElement.style.width;
    childDropdownElement.style.display = parentDropdownElement.style.display;
    const visibilityDetails = ElementViewPort.getVisibilityDetails(childDropdownElement);
    if (!visibilityDetails.isFullyVisible) {
      childDropdownElement.style.left = `-${parentDropdownElement.style.width}`;
      const visibilityDetails = ElementViewPort.getVisibilityDetails(childDropdownElement);
      if (!visibilityDetails.isFullyVisible) {
        childDropdownElement.style.left = '';
      }
    }
  }

  private static resetDropdownPosition(childDropdownElement: HTMLElement) {
    childDropdownElement.style.left = '';
  }

  private static hideChildDropdown(event: MouseEvent) {
    const childDropdownElement = (event.target as HTMLElement).children[1] as HTMLElement;
    childDropdownElement.style.display = 'none';
    DropdownItem.resetDropdownPosition(childDropdownElement);
  }

  private static createChildDropdown(itemNames: string[]) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.left = dropdownElement.style.width;
    dropdownElement.style.top = `-${dropdownElement.style.paddingTop}`;
    itemNames.forEach((itemName) => {
      DropdownItem.addButtonItem(dropdownElement, itemName);
    });
    return dropdownElement;
  }

  // prettier-ignore
  public static addNestedDropdownItem(dropdownElement: HTMLElement, text: string, nestedItemNames: string[],
      className?: string) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_HOVERABLE_ITEM, DropdownItem.DROPDOWN_NESTED_DROPDOWN_ITEM);
    if (className) itemElement.classList.add(className);
    const textElement = document.createElement('div');
    textElement.textContent = text;
    itemElement.appendChild(textElement);
    const nestedDropdown = DropdownItem.createChildDropdown(nestedItemNames);
    itemElement.appendChild(nestedDropdown);
    itemElement.onmouseenter = DropdownItem.displayAndSetChildDropdownPosition;
    itemElement.onmouseleave = DropdownItem.hideChildDropdown;
    dropdownElement.appendChild(itemElement);
    return nestedDropdown;
  }

  public static doesElementContainItemClass(element: HTMLElement) {
    return element.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS);
  }

  public static doesElementContainInputClass(element: HTMLElement) {
    return element.classList.contains(DropdownItem.DROPDOWN_INPUT_CLASS);
  }

  public static focusInputElement(inputItemElement: HTMLElement) {
    (inputItemElement.children[0] as HTMLElement).focus();
  }

  public static getInputElement(dropdownElement: HTMLElement) {
    return dropdownElement.getElementsByClassName(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS)[0];
  }

  private static focusElementWhenNoNext(element: HTMLElement, dropdownElement: HTMLElement) {
    // when inside an input item
    if (DropdownItem.doesElementContainInputClass(element)) {
      const itemElement = element.parentElement as HTMLElement;
      return DropdownItem.focusNextItem(itemElement, dropdownElement);
    }
    // when at the end of nested dropdown item
    const dropdownParent = element.parentElement?.parentElement as HTMLElement;
    if (dropdownParent.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS)) {
      GenericElementUtils.hideElements(element.parentElement as HTMLElement);
      return DropdownItem.focusNextItem(dropdownParent, dropdownElement);
    }
    // when on last item
    return DropdownItem.focusNextItem(dropdownElement.children[0] as HTMLElement, dropdownElement, true);
  }

  public static focusNextItem(element: HTMLElement, dropdownElement: HTMLElement, startElement = false): void {
    if (element.classList.contains(DropdownItem.DROPDOWN_NESTED_DROPDOWN_ITEM)) {
      const childDropdownElement = element.children[1] as HTMLElement;
      // when on item that has open nested dropdown
      if (childDropdownElement.style.display === 'block') {
        return (childDropdownElement.children[0] as HTMLElement).focus();
      }
    }
    const nextElement = startElement ? element : (element.nextSibling as HTMLElement);
    if (!nextElement) {
      return DropdownItem.focusElementWhenNoNext(element, dropdownElement);
      // when on a title item
    } else if (nextElement.classList.contains(DropdownItem.DROPDOWN_TITLE_ITEM_CLASS)) {
      return DropdownItem.focusNextItem(nextElement, dropdownElement);
      // when on an input item
    } else if (nextElement.classList.contains(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS)) {
      return DropdownItem.focusInputElement(nextElement);
    }
    return nextElement.focus();
  }
}
