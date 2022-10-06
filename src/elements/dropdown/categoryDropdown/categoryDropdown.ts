import {CategoryDropdownHorizontalScroll} from './categoryDropdownHorizontalScroll';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryCellEvents} from '../../cell/categoryCellEvents';
import {FocusedElements} from '../../../types/focusedElements';
import {CategoryDropdownItem} from './categoryDropdownItem';
import {Categories} from '../../../types/columnDetails';
import {CellDetails} from '../../../types/focusedCell';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

// TO-DO allow dev to control whether additional elements are allowed to be added
export class CategoryDropdown {
  private static readonly CATEGORY_DROPDOWN_CLASS = 'category-dropdown';

  public static hide(categoryDropdown: HTMLElement) {
    GenericElementUtils.hideElements(categoryDropdown);
  }

  private static focusItemOnDropdownOpen(textElement: HTMLElement, categoryDropdown: HTMLElement, categories: Categories) {
    CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(textElement, categoryDropdown, categories);
    if (!categories.categoryDropdownItems.matchingWithCellText) {
      const firstItem = categoryDropdown.children[0] as HTMLElement;
      // firing event as the handler has the hover color binded to it
      firstItem?.dispatchEvent(new MouseEvent('mouseenter'));
    }
  }

  private static setPosition(categoryDropdown: HTMLElement, cellElement: HTMLElement) {
    categoryDropdown.style.left = `${cellElement.offsetLeft + cellElement.offsetWidth}px`;
    categoryDropdown.style.top = `${cellElement.offsetTop}px`;
  }

  // instead of binding click event handlers with the context of current row index to individual item elements every
  // time the dropdown is displayed, click events are handled on the dropdown instead, the reason for this is
  // because it can be expensive to rebind an arbitrary amount of items e.g. 10000+
  // prettier-ignore
  private static click(this: EditableTableComponent, dropdownElement: HTMLElement, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // when user clicks on top/bottom paddding instead of an item
    if (targetElement.classList.contains(Dropdown.DROPDOWN_CLASS)) return;
    CategoryCellEvents.programmaticBlur(this);
    const { rowIndex, columnIndex, element: cellElement } = this.focusedElements.cell as CellDetails;
    const itemElement = targetElement.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS)
      ? targetElement : targetElement.parentElement;
    CategoryDropdownItem.selectExistingCategory(this, itemElement as HTMLElement, rowIndex, columnIndex,
      cellElement.children[0] as HTMLElement, dropdownElement);
  }

  // this is required to record to stop cell blur from closing the dropdown
  // additionally if the user clicks on dropdown scroll or padding, this will
  private static mouseDown(focusedElements: FocusedElements, dropdownElement: HTMLElement) {
    focusedElements.categoryDropdown = dropdownElement;
  }

  // prettier-ignore
  public static display(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const {categories} = etc.columnsDetails[columnIndex];
    const {list, categoryDropdownItems} = categories;
    const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
    if (Object.keys(list).length > 0) {
      categoryDropdown.onmousedown = CategoryDropdown.mouseDown.bind(this, etc.focusedElements, categoryDropdown);
      categoryDropdown.onclick = CategoryDropdown.click.bind(etc, categoryDropdown);
      CategoryDropdown.setPosition(categoryDropdown, cellElement);
      CategoryDropdownItem.blurItemHighlight(categoryDropdownItems, 'hovered');
      CategoryDropdownItem.blurItemHighlight(categoryDropdownItems, 'matchingWithCellText');
      categoryDropdown.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
      categoryDropdown.scrollLeft = 0;
      // REF-4
      CategoryDropdownHorizontalScroll.setPropertiesIfHorizontalScrollPresent(categoryDropdown, categoryDropdownItems);
      const textElement = cellElement.children[0] as HTMLElement;
      CategoryDropdown.focusItemOnDropdownOpen(textElement, categoryDropdown, categories);
    }
  }

  // WORK - will need to populate upfront if user has set a column as category upfront
  public static create() {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.maxHeight = '150px';
    dropdownElement.classList.add(CategoryDropdown.CATEGORY_DROPDOWN_CLASS);
    return dropdownElement;
  }
}
