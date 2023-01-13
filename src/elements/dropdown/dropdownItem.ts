import {DropdownButtonItemSettings, IconSettings} from '../../types/dropdownButtonItem';
import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {SVGIconUtils} from '../../utils/svgIcons/svgIconUtils';
import {DropdownItemEvents} from './dropdownItemEvents';
import {Optional} from '../../types/utilityTypes';

export class DropdownItem {
  public static readonly DROPDOWN_ITEM_CLASS = 'dropdown-item';
  private static readonly DISABLED_ITEM_CLASS = 'dropdown-disabled-item';
  public static readonly ACTIVE_ITEM_CLASS = 'active-dropdown-item';
  public static readonly DROPDOWN_INPUT_CLASS = 'dropdown-input';
  private static readonly DROPDOWN_ITEM_ICON_CONTAINER_CLASS = 'dropdown-item-icon-container';
  public static readonly DROPDOWN_INPUT_ITEM_CLASS = 'dropdown-input-item';
  public static readonly DROPDOWN_TITLE_ITEM_CLASS = 'dropdown-title-item';
  public static readonly DROPDOWN_ITEM_DIVIDER_CLASS = 'dropdown-item-divider';
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

  private static createItem(dropdownElement?: HTMLElement) {
    const itemElement = DropdownItem.createDropdownItemBaseElement('div');
    if (dropdownElement) itemElement.tabIndex = dropdownElement.children.length;
    itemElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS, GenericElementUtils.NOT_SELECTABLE_CLASS);
    return itemElement;
  }

  // no need to sanitize paste as input element already does it
  public static addInputItem(etc: EditableTableComponent, dropdownElement: HTMLElement) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    itemElement.classList.add(DropdownItem.DROPDOWN_INPUT_ITEM_CLASS);
    const inputElement = DropdownItem.createDropdownItemBaseElement('input');
    inputElement.classList.add(DropdownItem.DROPDOWN_INPUT_CLASS);
    itemElement.appendChild(inputElement);
    dropdownElement.appendChild(itemElement);
    DropdownItemEvents.addItemEvents(etc.activeOverlayElements, inputElement);
  }

  // REF-10
  private static insertIcon(buttonElement: HTMLElement, iconSettings: IconSettings) {
    const {svgString, containerStyles} = iconSettings;
    const container = document.createElement('div');
    container.classList.add(DropdownItem.DROPDOWN_ITEM_ICON_CONTAINER_CLASS);
    Object.assign(container.style, containerStyles?.dropdown);
    const svgIconElement = SVGIconUtils.createSVGElement(svgString);
    // using style as the class has no effect on svg
    svgIconElement.style.filter = SVGIconUtils.DARK_GREY_FILTER;
    container.appendChild(svgIconElement);
    buttonElement.insertBefore(container, buttonElement.children[0]);
  }

  public static addPlaneButtonItem(dropdownElement: HTMLElement | undefined, text: string, index?: number) {
    const itemElement = DropdownItem.createItem(dropdownElement);
    const textElement = DropdownItem.createDropdownItemBaseElement('div');
    textElement.innerText = text;
    itemElement.append(textElement);
    if (dropdownElement) {
      if (index !== undefined && dropdownElement.children[index]) {
        dropdownElement.insertBefore(itemElement, dropdownElement.children[index]);
      } else {
        dropdownElement.appendChild(itemElement);
      }
    }
    return itemElement;
  }

  // prettier-ignore
  public static createButtonItemNoEvents(dropdown: HTMLElement | undefined,
      itemSettings: Optional<DropdownButtonItemSettings, 'iconSettings'>, ...classNames: string[]) {
    const buttonElement = DropdownItem.addPlaneButtonItem(dropdown, itemSettings.text);
    if (itemSettings.iconSettings) DropdownItem.insertIcon(buttonElement, itemSettings.iconSettings);
    if (classNames.length > 0) buttonElement.classList.add(...classNames);
    return buttonElement;
  }

  public static addTitle(dropdownElement: HTMLElement, text: string) {
    const titleElement = DropdownItem.createDropdownItemBaseElement('div');
    titleElement.classList.add(DropdownItem.DROPDOWN_ITEM_CLASS, DropdownItem.DROPDOWN_TITLE_ITEM_CLASS);
    titleElement.innerText = text;
    dropdownElement.appendChild(titleElement);
  }

  public static addDivider(dropdownElement: HTMLElement) {
    const dividerElement = DropdownItem.createDropdownItemBaseElement('div');
    dividerElement.classList.add(DropdownItem.DROPDOWN_ITEM_DIVIDER_CLASS);
    dropdownElement.appendChild(dividerElement);
  }

  // prettier-ignore
  public static addButtonItem(etc: EditableTableComponent, dropdown: HTMLElement,
      itemSettings: Optional<DropdownButtonItemSettings, 'iconSettings'>, ...classNames: string[]) {
    const buttonElement = DropdownItem.createButtonItemNoEvents(dropdown, itemSettings, ...classNames);
    DropdownItemEvents.addItemEvents(etc.activeOverlayElements, buttonElement);
    return buttonElement;
  }

  // prettier-ignore
  public static addNewButtonItems(etc: EditableTableComponent, dropdownElement: HTMLElement,
      itemsSettings: DropdownButtonItemSettings[]): HTMLElement[] {
    return itemsSettings.map((item) => {
      return DropdownItem.addButtonItem(etc, dropdownElement, item);
    });
  }

  public static addButtonItemElements(etc: EditableTableComponent, dropdownElement: HTMLElement, elements: HTMLElement[]) {
    elements.forEach((element) => {
      element.tabIndex = dropdownElement.children.length;
      dropdownElement.appendChild(element);
      DropdownItemEvents.addItemEvents(etc.activeOverlayElements, element);
    });
  }

  public static removeItems(dropdown: HTMLElement) {
    Array.from(dropdown.children).forEach((item) => item.remove());
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

  public static toggleUsability(item: HTMLElement, isUsable: boolean) {
    const icon = item.children[0] as HTMLElement;
    if (isUsable) {
      item.classList.remove(DropdownItem.DISABLED_ITEM_CLASS);
      icon.style.filter = '';
    } else {
      item.classList.add(DropdownItem.DISABLED_ITEM_CLASS);
      icon.style.filter = SVGIconUtils.LIGHT_GREY_FILTER;
    }
  }
}
