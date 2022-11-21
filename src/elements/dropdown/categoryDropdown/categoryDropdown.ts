import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownItemEvents} from './categoryDropdownItemEvents';
import {CategoryDropdownScrollbar} from './categoryDropdownScrollbar';
import {CategoryDropdownEvents} from './categoryDropdownEvents';
import {CategoryDropdownT} from '../../../types/columnDetails';
import {CategoryDropdownItem} from './categoryDropdownItem';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

// TO-DO allow dev to control whether additional elements are allowed to be added
export class CategoryDropdown {
  private static readonly CATEGORY_DROPDOWN_CLASS = 'category-dropdown';

  private static focusItemOnDropdownOpen(textElement: HTMLElement, dropdown: CategoryDropdownT, defaultCellValue: string) {
    // the updateCellText parameter is set to false for a case where the user clicks on a category cell which has
    // its text with a background color but one for a category that has been deleted, hence we do not want to
    // highlight it with a new background color
    CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(textElement, dropdown, defaultCellValue, false);
  }

  private static setPosition(dropdown: HTMLElement, cellElement: HTMLElement) {
    dropdown.style.left = `${cellElement.offsetLeft + cellElement.offsetWidth}px`;
    dropdown.style.top = `${cellElement.offsetTop}px`;
    const details = ElementVisibility.getDetailsInWindow(dropdown);
    if (!details.isFullyVisible) {
      if (details.blockingSides.has(SIDE.RIGHT)) {
        dropdown.style.left = `${cellElement.offsetLeft - Dropdown.DROPDOWN_WIDTH}px`;
      }
      if (details.blockingSides.has(SIDE.BOTTOM)) {
        dropdown.style.top = `${cellElement.offsetTop - dropdown.offsetHeight + 10}px`;
      }
    }
  }

  public static display(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const {categoryDropdown} = etc.columnsDetails[columnIndex];
    const {element: dropdownEl, categoryToItem} = categoryDropdown;
    if (Object.keys(categoryToItem).length > 0) {
      CategoryDropdownEvents.set(etc, dropdownEl);
      CategoryDropdownItemEvents.blurItem(categoryDropdown, 'hovered');
      CategoryDropdownItemEvents.blurItem(categoryDropdown, 'matchingWithCellText');
      Dropdown.display(dropdownEl);
      CategoryDropdown.setPosition(dropdownEl, cellElement);
      dropdownEl.scrollLeft = 0;
      CategoryDropdownScrollbar.setProperties(categoryDropdown);
      const textElement = cellElement.children[0] as HTMLElement;
      CategoryDropdown.focusItemOnDropdownOpen(textElement, categoryDropdown, etc.defaultCellValue);
    }
  }

  // WORK - will need to populate upfront if user has set a column as category upfront
  // WORK - potentially allow custom column width px or %
  public static createAndAppend(tableElement: HTMLElement) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.maxHeight = '150px';
    dropdownElement.classList.add(CategoryDropdown.CATEGORY_DROPDOWN_CLASS);
    tableElement.appendChild(dropdownElement);
    return dropdownElement;
  }

  public static remove(tableElement: HTMLElement, dropdown: HTMLElement) {
    tableElement.removeChild(dropdown);
  }
}
