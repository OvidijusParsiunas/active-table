import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownItemEvents} from './categoryDropdownItemEvents';
import {CategoryDropdownScrollbar} from './categoryDropdownScrollbar';
import {CategoryDropdownEvents} from './categoryDropdownEvents';
import {CategoryDropdownT} from '../../../types/columnDetails';
import {CategoryDropdownItem} from './categoryDropdownItem';
import {TableElement} from '../../table/tableElement';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

// TO-DO allow dev to control whether additional elements are allowed to be added
export class CategoryDropdown {
  private static readonly CATEGORY_DROPDOWN_CLASS = 'category-dropdown';

  private static generateRightPosition() {
    return `4px`;
  }

  private static generateBottomPosition(cellElement: HTMLElement, textContainerElement: HTMLElement) {
    const tableElement = cellElement.offsetParent as HTMLElement;
    const totalVerticalBorder = TableElement.BORDER_DIMENSIONS.bottomWidth + TableElement.BORDER_DIMENSIONS.topWidth;
    const cellTop = tableElement.offsetHeight - totalVerticalBorder - cellElement.offsetTop;
    const textContainerTop = cellTop - textContainerElement.offsetTop;
    return `${textContainerTop + 6}px`;
  }

  private static generateTopPosition(cellElement: HTMLElement, textContainerElement: HTMLElement) {
    const textContainerBottom = textContainerElement.offsetTop + textContainerElement.offsetHeight;
    return `${cellElement.offsetTop + textContainerBottom + 2}px`;
  }

  private static generateLeftPosition(cellElement: HTMLElement, textContainerElement: HTMLElement): PX {
    return `${cellElement.offsetLeft + textContainerElement.offsetLeft}px`;
  }

  public static setPosition(dropdown: HTMLElement, cellElement: HTMLElement) {
    const textContainerElement = cellElement.children[0] as HTMLElement;
    dropdown.style.bottom = '';
    dropdown.style.right = '';
    dropdown.style.left = CategoryDropdown.generateLeftPosition(cellElement, textContainerElement);
    dropdown.style.top = CategoryDropdown.generateTopPosition(cellElement, textContainerElement);
    const details = ElementVisibility.getDetailsInWindow(dropdown);
    if (!details.isFullyVisible) {
      if (details.blockingSides.has(SIDE.RIGHT)) {
        dropdown.style.left = '';
        // using right instead of left as it is more convenient to display dropdown beside the right side of the table
        dropdown.style.right = CategoryDropdown.generateRightPosition();
      }
      if (details.blockingSides.has(SIDE.BOTTOM)) {
        dropdown.style.top = '';
        // the reason why bottom property is used instead of top is because the removal of a category item
        // reduces the dropdown height and the bottom property keeps the dropdown position close to cell
        dropdown.style.bottom = CategoryDropdown.generateBottomPosition(cellElement, textContainerElement);
      }
    }
  }

  // prettier-ignore
  public static updateCategoryDropdown(cellElement: HTMLElement, dropdown: CategoryDropdownT,
      defaultCellValue: string, updateCellText: boolean, matchingCellElement?: HTMLElement) {
    CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(cellElement.children[0] as HTMLElement,
      dropdown, defaultCellValue, updateCellText, matchingCellElement)
    if (updateCellText) {
      CategoryDropdown.setPosition(dropdown.element, cellElement);
    }
  }

  private static focusItemOnDropdownOpen(textElement: HTMLElement, dropdown: CategoryDropdownT, defaultCellValue: string) {
    // the updateCellText parameter is set to false for a case where the user clicks on a category cell which has
    // its text with a background color but one for a category that has been deleted, hence we do not want to
    // highlight it with a new background color
    CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(textElement, dropdown, defaultCellValue, false);
  }

  public static display(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const {categoryDropdown} = etc.columnsDetails[columnIndex];
    const {element: dropdownEl, categoryToItem} = categoryDropdown;
    if (Object.keys(categoryToItem).length > 0) {
      CategoryDropdownEvents.set(etc, dropdownEl);
      CategoryDropdownItemEvents.blurItem(categoryDropdown, 'hovered');
      CategoryDropdownItemEvents.blurItem(categoryDropdown, 'matchingWithCellText');
      Dropdown.display(dropdownEl);
      dropdownEl.scrollLeft = 0;
      CategoryDropdownScrollbar.setProperties(categoryDropdown);
      CategoryDropdown.setPosition(dropdownEl, cellElement);
      const textElement = cellElement.children[0] as HTMLElement;
      CategoryDropdown.focusItemOnDropdownOpen(textElement, categoryDropdown, etc.defaultCellValue);
    }
  }

  // WORK - will need to populate upfront if user has set a column as category upfront
  // WORK - potentially allow custom column width px or %
  public static createAndAppend(containerElement: HTMLElement) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.maxHeight = '150px';
    dropdownElement.classList.add(CategoryDropdown.CATEGORY_DROPDOWN_CLASS);
    containerElement.appendChild(dropdownElement);
    return dropdownElement;
  }

  public static createContainerElement() {
    return document.createElement('div');
  }
}
