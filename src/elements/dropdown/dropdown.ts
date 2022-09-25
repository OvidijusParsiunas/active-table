import {DropdownItem} from './dropdownItem';

export class Dropdown {
  protected static readonly ENTER_KEY = 'Enter';
  protected static readonly ESCAPE_KEY = 'Escape';
  protected static readonly TAB_KEY = 'Tab';
  protected static readonly DROPDOWN_CLASS = 'editable-table-component-dropdown';
  protected static readonly CSS_DISPLAY_VISIBLE = 'block';
  protected static readonly DROPDOWN_WIDTH = 176;
  private static readonly DROPDOWN_PADDING_TOP_BOTTOM_PX = '4px';

  public static createBase() {
    const dropdownElement = document.createElement('div');
    dropdownElement.classList.add(Dropdown.DROPDOWN_CLASS);
    // using width to be able to center the dropdown relative to the cell
    // alternative approach is to use a parent div for the dropdown which would be centered relativer to the cell
    // and there would be no need for an equation to center the dropdown using its width, but this is simpler
    dropdownElement.style.width = `${Dropdown.DROPDOWN_WIDTH}px`;
    dropdownElement.style.paddingTop = Dropdown.DROPDOWN_PADDING_TOP_BOTTOM_PX;
    dropdownElement.style.paddingBottom = Dropdown.DROPDOWN_PADDING_TOP_BOTTOM_PX;
    Dropdown.hideElements(dropdownElement);
    return dropdownElement;
  }

  public static isDisplayed(columnDropdown?: HTMLElement) {
    return columnDropdown?.style.display === Dropdown.CSS_DISPLAY_VISIBLE;
  }

  public static isPartOfDropdownElement(element: HTMLElement) {
    return element.classList.contains(Dropdown.DROPDOWN_CLASS) || DropdownItem.doesElementContainItemClass(element);
  }

  public static hideElements(...elements: HTMLElement[]) {
    elements.forEach((element: HTMLElement) => (element.style.display = 'none'));
  }
}
