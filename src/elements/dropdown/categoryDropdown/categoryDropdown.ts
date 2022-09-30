import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownItems} from '../../../types/columnDetails';
import {CategoryDropdownItem} from './categoryDropdownItem';
import {CellEvents} from '../../cell/cellEvents';
import {Dropdown} from '../dropdown';

// WORK - rename category to categories
// TO-DO allow dev to control whether additional elements are allowed to be added
export class CategoryDropdown extends Dropdown {
  public static hide(categoryDropdown: HTMLElement) {
    GenericElementUtils.hideElements(categoryDropdown);
  }

  // prettier-ignore
  private static focusItemOnDropdownOpen(text: string, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    CategoryDropdownItem.focusMatchingCellCategoryItem(text, categoryDropdown, categoryDropdownItems);
    if (!categoryDropdownItems.matchingWithCellText) {
      const firstItem = categoryDropdown.children[0];
      firstItem?.dispatchEvent(new MouseEvent('mouseenter'));
    }
  }

  // instead of binding click event handlers with the context of current row index to individual item elements every
  // time the dropdown is displayed, click events are handled on the dropdown instead, the reason for this is
  // because it can be expensive to rebind an arbitrary amount of items e.g. 10000+
  private static dropdownClick(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const newText = (event.target as HTMLElement).textContent as string;
    const {contents, columnsDetails} = this;
    const cellElement = columnsDetails[columnIndex].elements[rowIndex];
    if ((contents[rowIndex][columnIndex] as string) !== newText) {
      CellEvents.updateCell(this, newText, rowIndex, columnIndex, {processText: false, element: cellElement});
    }
    CategoryDropdown.hide(this.overlayElementsState.categoryDropdown as HTMLElement);
  }

  private static setPosition(categoryDropdown: HTMLElement, cellElement: HTMLElement) {
    const rect = cellElement.getBoundingClientRect();
    categoryDropdown.style.left = `${rect.right}px`;
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
      categoryDropdown.style.display = 'block';
      CategoryDropdown.focusItemOnDropdownOpen(cellElement.textContent as string, categoryDropdown, categoryDropdownItems);
    } else if (Dropdown.isDisplayed(etc.overlayElementsState.categoryDropdown)) {
      CategoryDropdown.hide(categoryDropdown);
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
