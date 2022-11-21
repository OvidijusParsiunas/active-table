import {DropdownItemEvents} from './dropdownItemEvents';
import {Dropdown} from './dropdown';

export class DropdownItem {
  public static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  public static readonly DROPDOWN_INPUT_CLASS = 'dropdown-input';
  public static readonly DROPDOWN_INPUT_ITEM_CLASS = 'dropdown-input-item';
  public static readonly DROPDOWN_TITLE_ITEM_CLASS = 'dropdown-title-item';
  public static readonly DROPDOWN_NESTED_DROPDOWN_ITEM = 'dropdown-nested-dropdown-item';
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
    DropdownItemEvents.addItemEvents(sRoot, inputElement);
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

  public static addButtonItem(sRoot: ShadowRoot | null, dropdown: HTMLElement, text: string, ...classNames: string[]) {
    const buttonElement = DropdownItem.addPlaneButtonItem(dropdown, text);
    DropdownItemEvents.addItemEvents(sRoot, buttonElement);
    if (classNames.length > 0) buttonElement.classList.add(...classNames);
    return buttonElement;
  }

  public static addTitle(dropdownElement: HTMLElement, text: string) {
    const titleElement = DropdownItem.createDropdownItemBaseElement('div');
    titleElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS, DropdownItem.DROPDOWN_TITLE_ITEM_CLASS);
    titleElement.textContent = text;
    dropdownElement.appendChild(titleElement);
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
    DropdownItemEvents.addNestedItemEvents(buttonElement);
    return nestedDropdown;
  }

  public static doesElementContainItemClass(element: HTMLElement) {
    return element.classList.contains(DropdownItem.DROPDOWN_ITEM_IDENTIFIER);
  }

  public static doesElementContainInputClass(element: HTMLElement) {
    return element.classList.contains(DropdownItem.DROPDOWN_INPUT_CLASS);
  }

  public static getInputElement(dropdownElement: HTMLElement) {
    return dropdownElement.getElementsByClassName(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS)[0];
  }
}
