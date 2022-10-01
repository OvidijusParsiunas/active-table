import {CategoryDropdownHorizontalScroll} from './categoryDropdownHorizontalScroll';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownItems, ColumnDetailsT} from '../../../types/columnDetails';
import {CategoryDropdownItem} from './categoryDropdownItem';
import {Dropdown} from '../dropdown';

// WORK - rename category to categories
// TO-DO allow dev to control whether additional elements are allowed to be added
export class CategoryDropdown extends Dropdown {
  // WORK - set to private if esc is not going to use it
  public static hide(categoryDropdown: HTMLElement) {
    GenericElementUtils.hideElements(categoryDropdown);
  }

  // prettier-ignore
  public static hideAndSetText(etc: EditableTableComponent, columnDetails: ColumnDetailsT,
      rowIndex: number, columnIndex: number, cellElement: HTMLElement, categoryDropdown: HTMLElement) {
    CategoryDropdownItem.setText(etc, columnDetails, rowIndex, columnIndex, cellElement);
      if (Dropdown.isDisplayed(categoryDropdown)) {
      CategoryDropdown.hide(categoryDropdown);
    }
  }

  // prettier-ignore
  private static focusItemOnDropdownOpen(text: string, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    categoryDropdown.style.overflow = 'hidden';
    CategoryDropdownItem.focusMatchingCellCategoryItem(text, categoryDropdown, categoryDropdownItems);
    if (!categoryDropdownItems.matchingWithCellText) {
      const firstItem = categoryDropdown.children[0] as HTMLElement;
      // firing event as the handler has the hover color binded to it
      firstItem?.dispatchEvent(new MouseEvent('mouseenter'));
    }
    setTimeout(() => (categoryDropdown.style.overflow = 'auto'));
  }

  // instead of binding click event handlers with the context of current row index to individual item elements every
  // time the dropdown is displayed, click events are handled on the dropdown instead, the reason for this is
  // because it can be expensive to rebind an arbitrary amount of items e.g. 10000+
  // prettier-ignore
  private static dropdownClick(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    // when user clicks on top/bottom paddding - it is dropdown element not item element
    if ((event.target as HTMLElement).classList.contains(Dropdown.DROPDOWN_CLASS)) return;
    const {columnsDetails, overlayElementsState: { categoryDropdown }} = this;
    const cellElement = columnsDetails[columnIndex].elements[rowIndex];
    CategoryDropdown.hideAndSetText(this,
      columnsDetails[columnIndex], rowIndex, columnIndex, cellElement, categoryDropdown as HTMLElement);
  }

  private static setPosition(categoryDropdown: HTMLElement, cellElement: HTMLElement) {
    categoryDropdown.style.left = `${cellElement.offsetLeft + cellElement.offsetWidth}px`;
    categoryDropdown.style.top = `${cellElement.offsetTop}px`;
  }

  public static display(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const {list, categoryDropdownItems} = etc.columnsDetails[columnIndex].categories;
    const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
    if (Object.keys(list).length > 0) {
      CategoryDropdown.setPosition(categoryDropdown, cellElement);
      categoryDropdown.onclick = CategoryDropdown.dropdownClick.bind(etc, rowIndex, columnIndex);
      CategoryDropdownItem.blurItemHighlight(categoryDropdownItems, 'hovered');
      CategoryDropdownItem.blurItemHighlight(categoryDropdownItems, 'matchingWithCellText');
      categoryDropdown.scrollLeft = 0;
      categoryDropdown.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
      // REF-4
      CategoryDropdownHorizontalScroll.setPropertiesIfHorizontalScrollPresent(categoryDropdown, categoryDropdownItems);
      CategoryDropdown.focusItemOnDropdownOpen(cellElement.textContent as string, categoryDropdown, categoryDropdownItems);
    }
  }

  // WORK - will need to populate upfront if user has set a column as category upfront
  public static create() {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.maxHeight = '150px';
    dropdownElement.style.overflow = 'auto';
    return dropdownElement;
  }
}
