import {Dropdown} from './dropdown';

export class DropdownItem {
  protected static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  protected static readonly DROPDOWN_INPUT_CLASS = 'dropdown-input';
  private static readonly DROPDOWN_INPUT_ITEM_CLASS = 'dropdown-input-item';
  private static readonly DROPDOWN_TITLE_ITEM_CLASS = 'dropdown-title-item';
  private static readonly DROPDOWN_HOVERABLE_ITEM = 'dropdown-hoverable-item';

  private static createItem(dropdownElement: HTMLElement) {
    const itemElement = document.createElement('div');
    itemElement.tabIndex = dropdownElement.children.length;
    itemElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS);
    return itemElement;
  }

  public static addInputItem(dropdownElement: HTMLElement, className?: string) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS);
    if (className) itemElement.classList.add(className);
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

  private static createChildDropdown(itemNames: string[]) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.left = dropdownElement.style.width;
    dropdownElement.style.top = `-${dropdownElement.style.paddingTop}`;
    itemNames.forEach((itemName) => {
      DropdownItem.addButtonItem(dropdownElement, itemName);
    });
    return dropdownElement;
  }

  private static displayChildDropdown(event: MouseEvent) {
    const childDropdownElement = (event.target as HTMLElement).children[1] as HTMLElement;
    childDropdownElement.style.display = 'block';
  }

  private static hideChildDropdown(event: MouseEvent) {
    const childDropdownElement = (event.target as HTMLElement).children[1] as HTMLElement;
    childDropdownElement.style.display = 'none';
  }

  // prettier-ignore
  public static addNestedDropdownItem(dropdownElement: HTMLElement, text: string, nestedItemNames: string[],
      className?: string) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_HOVERABLE_ITEM);
    if (className) itemElement.classList.add(className);
    const textElement = document.createElement('div');
    textElement.textContent = text;
    itemElement.appendChild(textElement);
    const nestedDropdown = DropdownItem.createChildDropdown(nestedItemNames);
    itemElement.appendChild(nestedDropdown);
    itemElement.onmouseenter = DropdownItem.displayChildDropdown;
    itemElement.onmouseleave = DropdownItem.hideChildDropdown;
    dropdownElement.appendChild(itemElement);
  }

  public static doesElementContainItemClasses(element: HTMLElement) {
    return element.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS);
  }
}
