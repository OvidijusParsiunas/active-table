import {DropdownItemHighlightUtil} from '../../utils/color/dropdownItemHighlightUtil';
import {ElementVisibility} from '../../utils/elements/elementVisibility';
import {Dropdown} from './dropdown';

export class DropdownItem {
  public static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  public static readonly DROPDOWN_INPUT_CLASS = 'dropdown-input';
  private static readonly DROPDOWN_INPUT_ITEM_CLASS = 'dropdown-input-item';
  private static readonly DROPDOWN_TITLE_ITEM_CLASS = 'dropdown-title-item';
  private static readonly DROPDOWN_NESTED_DROPDOWN_ITEM = 'dropdown-nested-dropdown-item';
  // this is used to identify if a mouse event is currently on a dropdown item
  public static readonly DROPDOWN_ITEM_IDENTIFIER = 'dropdown-item-identifier';

  private static createDropdownItemBaseElement(tag: keyof HTMLElementTagNameMap) {
    const dropdownItemBaseDiv = document.createElement(tag);
    dropdownItemBaseDiv.classList.add(DropdownItem.DROPDOWN_ITEM_IDENTIFIER);
    return dropdownItemBaseDiv;
  }

  private static createItem(dropdownElement: HTMLElement) {
    const itemElement = DropdownItem.createDropdownItemBaseElement('div');
    itemElement.tabIndex = dropdownElement.children.length;
    itemElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS);
    return itemElement;
  }

  // no need to sanitize paste as input element already does it
  public static addInputItem(sRoot: ShadowRoot | null, dropdownElement: HTMLElement) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS);
    const inputElement = DropdownItem.createDropdownItemBaseElement('input');
    inputElement.classList.add(DropdownItem.DROPDOWN_INPUT_CLASS);
    // TO-DO hook up with the parent API
    inputElement.spellcheck = false;
    itemElement.appendChild(inputElement);
    dropdownElement.appendChild(itemElement);
    DropdownItem.addEvents(sRoot, inputElement);
  }

  public static addPlaneButtonItem(dropdownElement: HTMLElement, text: string, index?: number) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    const textElement = DropdownItem.createDropdownItemBaseElement('div');
    textElement.textContent = text;
    itemElement.append(textElement);
    if (index !== undefined && dropdownElement.children[index]) {
      dropdownElement.insertBefore(itemElement, dropdownElement.children[index]);
    } else {
      dropdownElement.appendChild(itemElement);
    }
    return itemElement;
  }

  private static addEvents(sRoot: ShadowRoot | null, buttonElement: HTMLElement) {
    buttonElement.addEventListener('mouseenter', DropdownItemHighlightUtil.highlightNew.bind(sRoot, buttonElement));
    // the reason why we need mouse leave on the item as well as on mouse enter is because the mouse can leave the dropdown
    // without entering another item
    buttonElement.addEventListener('mouseleave', DropdownItemHighlightUtil.fadeCurrentlyHighlighted.bind(this, sRoot));
  }

  public static addButtonItem(sRoot: ShadowRoot | null, dropdown: HTMLElement, text: string, ...classNames: string[]) {
    const buttonElement = DropdownItem.addPlaneButtonItem(dropdown, text);
    DropdownItem.addEvents(sRoot, buttonElement);
    if (classNames.length > 0) buttonElement.classList.add(...classNames);
    return buttonElement;
  }

  public static addTitle(dropdownElement: HTMLElement, text: string) {
    const titleElement = DropdownItem.createDropdownItemBaseElement('div');
    titleElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS, DropdownItem.DROPDOWN_TITLE_ITEM_CLASS);
    titleElement.textContent = text;
    dropdownElement.appendChild(titleElement);
  }

  private static displayAndSetNestedDropdownPosition(event: Event) {
    const nestedDropdownElement = (event.target as HTMLElement).children[1] as HTMLElement;
    const parentDropdownElement = (event.target as HTMLElement).parentElement as HTMLElement;
    nestedDropdownElement.style.left = parentDropdownElement.style.width;
    nestedDropdownElement.style.display = parentDropdownElement.style.display;
    const visibilityDetails = ElementVisibility.getDetailsInWindow(nestedDropdownElement);
    if (!visibilityDetails.isFullyVisible) {
      nestedDropdownElement.style.left = `-${parentDropdownElement.style.width}`;
      const visibilityDetails = ElementVisibility.getDetailsInWindow(nestedDropdownElement);
      if (!visibilityDetails.isFullyVisible) {
        nestedDropdownElement.style.left = '';
      }
    }
  }

  private static resetDropdownPosition(nestedDropdownElement: HTMLElement) {
    nestedDropdownElement.style.left = '';
  }

  private static hideNestedDropdown(event: Event) {
    const nestedDropdownElement = (event.target as HTMLElement).children[1] as HTMLElement;
    nestedDropdownElement.style.display = 'none';
    DropdownItem.resetDropdownPosition(nestedDropdownElement);
  }

  private static createNestedDropdown(sRoot: ShadowRoot | null, itemText: string[]) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.top = `-${Number.parseInt(dropdownElement.style.paddingTop) + 22}px`;
    itemText.forEach((text) => DropdownItem.addButtonItem(sRoot, dropdownElement, text));
    return dropdownElement;
  }

  public static resetNestedDropdownItemStyle(nestedDropdown: HTMLElement) {
    Array.from(nestedDropdown.children).forEach((item) => {
      const itemElement = item as HTMLElement;
      itemElement.style.backgroundColor = '';
      itemElement.style.color = '';
    });
  }

  // prettier-ignore
  public static addNestedDropdownItem(sRoot: ShadowRoot | null, dropdownElement: HTMLElement, text: string,
      itemsText: string[], className?: string) {
    const buttonElement = DropdownItem.addButtonItem(
      sRoot, dropdownElement, text, DropdownItem.DROPDOWN_NESTED_DROPDOWN_ITEM, className || '');
    const nestedDropdown = DropdownItem.createNestedDropdown(sRoot, itemsText);
    buttonElement.appendChild(nestedDropdown);
    buttonElement.addEventListener('mouseenter', DropdownItem.displayAndSetNestedDropdownPosition);
    buttonElement.addEventListener('mouseleave', DropdownItem.hideNestedDropdown);
    return nestedDropdown;
  }

  public static doesElementContainItemClass(element: HTMLElement) {
    return element.classList.contains(DropdownItem.DROPDOWN_ITEM_IDENTIFIER);
  }

  public static doesElementContainInputClass(element: HTMLElement) {
    return element.classList.contains(DropdownItem.DROPDOWN_INPUT_CLASS);
  }

  public static focusInputElement(inputItemElement: HTMLElement) {
    (inputItemElement.children[0] as HTMLElement).dispatchEvent(new MouseEvent('mouseenter'));
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
      Dropdown.hide(element.parentElement as HTMLElement);
      return DropdownItem.focusNextItem(dropdownParent, dropdownElement);
    }
    // when on last item
    return DropdownItem.focusNextItem(dropdownElement.children[0] as HTMLElement, dropdownElement, true);
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
      return DropdownItem.focusElementWhenNoNext(element, dropdownElement);
      // when on a title item
    } else if (nextElement.classList.contains(DropdownItem.DROPDOWN_TITLE_ITEM_CLASS)) {
      return DropdownItem.focusNextItem(nextElement, dropdownElement);
      // when on an input item
    } else if (nextElement.classList.contains(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS)) {
      return DropdownItem.focusInputElement(nextElement);
    }
    nextElement.dispatchEvent(new MouseEvent('mouseenter'));
  }
}
