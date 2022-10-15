import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {DropdownItem} from './dropdownItem';

export class Dropdown {
  public static readonly DROPDOWN_CLASS = 'editable-table-component-dropdown';
  // when there is a horizontal overflow (categories) - this automatically stretches all items to the dropdown width
  public static readonly CSS_DISPLAY_VISIBLE = 'grid';
  public static readonly DROPDOWN_WIDTH = 176;
  private static readonly DROPDOWN_PADDING_TOP_BOTTOM_PX = '4px';

  // TO-DO - dropdowns could potentially be placed inside the tbody which has relative positioning so that we wouldn't need
  // to use getBoundClientRect to set their position (cannot have table with relative positioning as it jumps when the
  // dropdown is not fully visible on the right side) Have not done this yet as it may not work correctly with scroll
  public static createBase() {
    const dropdownElement = document.createElement('div');
    dropdownElement.classList.add(Dropdown.DROPDOWN_CLASS);
    // using width to be able to center the dropdown relative to the cell
    // alternative approach is to use a parent div for the dropdown which would be centered relativer to the cell
    // and there would be no need for an equation to center the dropdown using its width, but this is simpler
    dropdownElement.style.width = `${Dropdown.DROPDOWN_WIDTH}px`;
    // padding specified to allow use of element style before displaying it
    dropdownElement.style.paddingTop = Dropdown.DROPDOWN_PADDING_TOP_BOTTOM_PX;
    dropdownElement.style.paddingBottom = Dropdown.DROPDOWN_PADDING_TOP_BOTTOM_PX;
    GenericElementUtils.hideElements(dropdownElement);
    return dropdownElement;
  }

  public static isDisplayed(columnDropdown?: HTMLElement) {
    return columnDropdown?.style.display === Dropdown.CSS_DISPLAY_VISIBLE;
  }

  public static isPartOfDropdownElement(element: HTMLElement) {
    return element.classList.contains(Dropdown.DROPDOWN_CLASS) || DropdownItem.doesElementContainItemClass(element);
  }
}
