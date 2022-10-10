import {CategoryDropdownHorizontalScroll} from './categoryDropdownHorizontalScroll';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryCellEvents} from '../../cell/categoryCellEvents';
import {FocusedElements} from '../../../types/focusedElements';
import {CategoryDropdownItem} from './categoryDropdownItem';
import {CategoryDeleteButton} from './categoryDeleteButton';
import {Categories} from '../../../types/columnDetails';
import {CellDetails} from '../../../types/focusedCell';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

// TO-DO allow dev to control whether additional elements are allowed to be added
export class CategoryDropdown {
  private static readonly CATEGORY_DROPDOWN_CLASS = 'category-dropdown';

  public static hide(dropdown: HTMLElement) {
    GenericElementUtils.hideElements(dropdown);
  }

  // prettier-ignore
  private static focusItemOnDropdownOpen(textElement: HTMLElement,
      dropdown: HTMLElement, categories: Categories, defaultCellValue: string) {
    // the updateCellText parameter is set to false for a case where the user clicks on a category cell which has
    // its text with a background color but one for a category that has been deleted, hence we do not want to
    // highlight it with a new background color
    CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(textElement, categories, defaultCellValue, false);
    // WORK - probably no need here
    if (!categories.dropdown.activeItems.matchingWithCellText) {
      const firstItem = dropdown.children[0] as HTMLElement;
      firstItem?.dispatchEvent(new MouseEvent('mouseenter'));
    }
  }

  private static setPosition(dropdown: HTMLElement, cellElement: HTMLElement) {
    dropdown.style.left = `${cellElement.offsetLeft + cellElement.offsetWidth}px`;
    dropdown.style.top = `${cellElement.offsetTop}px`;
  }

  // instead of binding click event handlers with the context of current row index to individual item elements every
  // time the dropdown is displayed, click events are handled on the dropdown instead, the reason for this is
  // because it can be expensive to rebind an arbitrary amount of items e.g. 10000+
  // prettier-ignore
  private static click(this: EditableTableComponent, dropdownElement: HTMLElement, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // target is dropdown when clicked on top/bottom paddding
    if (targetElement.classList.contains(Dropdown.DROPDOWN_CLASS)
      || targetElement.classList.contains(CategoryDeleteButton.CATEGORY_DELETE_BUTTON_CLASS)) return;
    const { rowIndex, columnIndex, element: cellElement } = this.focusedElements.cell as CellDetails;
    const itemElement = targetElement.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS)
      ? targetElement : targetElement.parentElement;
    CategoryDropdownItem.selectExistingCategory(this, itemElement as HTMLElement, rowIndex, columnIndex,
      cellElement.children[0] as HTMLElement, dropdownElement);
    CategoryCellEvents.programmaticBlur(this);
  }

  // this is required to record to stop cell blur from closing the dropdown
  // additionally if the user clicks on dropdown scroll or padding, this will
  private static mouseDown(focusedElements: FocusedElements, dropdownElement: HTMLElement) {
    focusedElements.categoryDropdown = dropdownElement;
  }

  // prettier-ignore
  public static display(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const {categories} = etc.columnsDetails[columnIndex];
    const {dropdown: {element: dropdown, activeItems, categoryToItem}} = categories;
    if (Object.keys(categoryToItem).length > 0) {
      dropdown.onmousedown = CategoryDropdown.mouseDown.bind(this, etc.focusedElements, dropdown);
      dropdown.onclick = CategoryDropdown.click.bind(etc, dropdown);
      CategoryDropdown.setPosition(dropdown, cellElement);
      CategoryDropdownItem.blurItem(activeItems, 'hovered');
      CategoryDropdownItem.blurItem(activeItems, 'matchingWithCellText');
      dropdown.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
      dropdown.scrollLeft = 0;
      // REF-4
      CategoryDropdownHorizontalScroll.setPropertiesIfHorizontalScrollPresent(categories.dropdown);
      const textElement = cellElement.children[0] as HTMLElement;
      CategoryDropdown.focusItemOnDropdownOpen(textElement, dropdown, categories, etc.defaultCellValue);
    }
  }

  // WORK - will need to populate upfront if user has set a column as category upfront
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
