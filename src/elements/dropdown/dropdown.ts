import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {DropdownItem} from './dropdownItem';

export class Dropdown {
  public static readonly DROPDOWN_CLASS = 'editable-table-component-dropdown';
  public static readonly DISABLED_ITEM_CLASS = 'dropdown-disabled-item';
  // when there is a horizontal overflow (categories) - this automatically stretches all items to the dropdown width
  private static readonly CSS_DISPLAY_VISIBLE = 'grid';
  public static readonly DROPDOWN_WIDTH = 176;
  public static readonly DROPDOWN_VERTICAL_PX = '4px';

  public static createBase() {
    const dropdownElement = document.createElement('div');
    dropdownElement.classList.add(Dropdown.DROPDOWN_CLASS);
    // using width to be able to center the dropdown relative to the cell
    // alternative approach is to use a parent div for the dropdown which would be centered relativer to the cell
    // and there would be no need for an equation to center the dropdown using its width, but this is simpler
    dropdownElement.style.width = `${Dropdown.DROPDOWN_WIDTH}px`;
    // padding specified to allow use of element style before displaying it
    dropdownElement.style.paddingTop = Dropdown.DROPDOWN_VERTICAL_PX;
    dropdownElement.style.paddingBottom = Dropdown.DROPDOWN_VERTICAL_PX;
    Dropdown.hide(dropdownElement);
    return dropdownElement;
  }

  public static isDisplayed(element?: HTMLElement) {
    return element?.style.display === Dropdown.CSS_DISPLAY_VISIBLE;
  }

  public static display(...elements: HTMLElement[]) {
    elements.forEach((element) => {
      element.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
    });
  }

  public static hide(...elements: HTMLElement[]) {
    GenericElementUtils.hideElements(...elements);
  }

  public static isPartOfDropdownElement(element: HTMLElement) {
    return element.classList.contains(Dropdown.DROPDOWN_CLASS) || DropdownItem.doesElementContainItemClass(element);
  }
}
