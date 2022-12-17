import {EditableTableComponent} from '../../editable-table-component';
import {DropdownItemEvents} from './dropdownItemEvents';
import {CellElement} from '../cell/cellElement';
import {Dropdown} from './dropdown';

export class DropdownItem {
  public static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  public static readonly DISABLED_ITEM_CLASS = 'dropdown-disabled-item';
  public static readonly DROPDOWN_INPUT_CLASS = 'dropdown-input';
  public static readonly DROPDOWN_INPUT_ITEM_CLASS = 'dropdown-input-item';
  public static readonly DROPDOWN_TITLE_ITEM_CLASS = 'dropdown-title-item';
  public static readonly DROPDOWN_NESTED_DROPDOWN_ITEM = 'dropdown-nested-dropdown-item';
  // this is used to identify if a mouse event is currently on a dropdown item
  public static readonly DROPDOWN_ITEM_IDENTIFIER = 'dropdown-item-identifier';
  private static readonly HIDDEN = 'none';
  private static readonly DISPLAY = '';

  public static toggleItem(item: HTMLElement, isDisplay: boolean) {
    item.style.display = isDisplay ? DropdownItem.DISPLAY : DropdownItem.HIDDEN;
  }

  public static isDisplayed(item: HTMLElement) {
    return item.style.display === DropdownItem.DISPLAY;
  }

  private static createDropdownItemBaseElement(tag: keyof HTMLElementTagNameMap) {
    const dropdownItemBaseDiv = document.createElement(tag);
    dropdownItemBaseDiv.classList.add(DropdownItem.DROPDOWN_ITEM_IDENTIFIER);
    return dropdownItemBaseDiv;
  }

  private static createItem(dropdownElement: HTMLElement) {
    const itemElement = DropdownItem.createDropdownItemBaseElement('div');
    itemElement.tabIndex = dropdownElement.children.length;
    itemElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS, CellElement.NOT_SELECTABLE_CLASS);
    return itemElement;
  }

  // no need to sanitize paste as input element already does it
  public static addInputItem(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS);
    const inputElement = DropdownItem.createDropdownItemBaseElement('input');
    inputElement.classList.add(DropdownItem.DROPDOWN_INPUT_CLASS);
    // TO-DO hook up with the parent API
    inputElement.spellcheck = false;
    itemElement.appendChild(inputElement);
    dropdownElement.appendChild(itemElement);
    DropdownItemEvents.addItemEvents(etc.activeOverlayElements, inputElement);
  }

  public static addPlaneButtonItem(dropdownElement: HTMLElement, text: string, index?: number) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    const textElement = DropdownItem.createDropdownItemBaseElement('div');
    textElement.innerText = text;
    itemElement.append(textElement);
    if (index !== undefined && dropdownElement.children[index]) {
      dropdownElement.insertBefore(itemElement, dropdownElement.children[index]);
    } else {
      dropdownElement.appendChild(itemElement);
    }
    return itemElement;
  }

  public static addButtonItem(etc: EditableTableComponent, dropdown: HTMLElement, text: string, ...classNames: string[]) {
    const buttonElement = DropdownItem.addPlaneButtonItem(dropdown, text);
    DropdownItemEvents.addItemEvents(etc.activeOverlayElements, buttonElement);
    if (classNames.length > 0) buttonElement.classList.add(...classNames);
    return buttonElement;
  }

  public static addTitle(dropdownElement: HTMLElement, text: string) {
    const titleElement = DropdownItem.createDropdownItemBaseElement('div');
    titleElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS, DropdownItem.DROPDOWN_TITLE_ITEM_CLASS);
    titleElement.innerText = text;
    dropdownElement.appendChild(titleElement);
  }

  public static addItems(etc: EditableTableComponent, dropdownElement: HTMLElement, itemText: string[]): HTMLElement[] {
    return itemText.map((text) => DropdownItem.addButtonItem(etc, dropdownElement, text));
  }

  public static createNestedDropdown(etc: EditableTableComponent, itemText: string[]) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.top = `-${Number.parseInt(dropdownElement.style.paddingTop) + 22}px`;
    DropdownItem.addItems(etc, dropdownElement, itemText);
    return dropdownElement;
  }

  public static resetNestedDropdownItemStyle(nestedDropdown: HTMLElement) {
    Array.from(nestedDropdown.children).forEach((item) => {
      const itemElement = item as HTMLElement;
      itemElement.style.backgroundColor = '';
      itemElement.style.color = '';
    });
  }

  public static removeItems(nestedDropdown: HTMLElement) {
    Array.from(nestedDropdown.children).forEach((item) => item.remove());
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
