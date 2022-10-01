import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {DropdownItem} from './dropdownItem';

export class Dropdown {
  protected static readonly DROPDOWN_CLASS = 'editable-table-component-dropdown';
  // when there is a horizontal overflow (categories) - this automatically stretches all items to the dropdown width
  protected static readonly CSS_DISPLAY_VISIBLE = 'grid';
  protected static readonly DROPDOWN_WIDTH = 176;
  private static readonly DROPDOWN_PADDING_TOP_BOTTOM_PX = '4px';

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
