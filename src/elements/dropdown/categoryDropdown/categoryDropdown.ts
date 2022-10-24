import {CellWithTextEvents} from '../../cell/cellsWithTextDiv/cellWithTextEvents';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownScrollbar} from './categoryDropdownScrollbar';
import {FocusedElements} from '../../../types/focusedElements';
import {CategoryDropdownT} from '../../../types/columnDetails';
import {CategoryDropdownItem} from './categoryDropdownItem';
import {CategoryDeleteButton} from './categoryDeleteButton';
import {CellDetails} from '../../../types/focusedCell';
import {DropdownItem} from '../dropdownItem';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

// TO-DO allow dev to control whether additional elements are allowed to be added
export class CategoryDropdown {
  private static readonly CATEGORY_DROPDOWN_CLASS = 'category-dropdown';

  public static hide(dropdown: HTMLElement) {
    GenericElementUtils.hideElements(dropdown);
  }

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

  // instead of binding click event handlers with the context of current row index to individual item elements every
  // time the dropdown is displayed, click events are handled on the dropdown instead, the reason for this is
  // because it can be expensive to rebind an arbitrary amount of items e.g. 10000+
  // prettier-ignore
  private static click(this: EditableTableComponent, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // target is dropdown when clicked on top/bottom paddding
    if (targetElement.classList.contains(Dropdown.DROPDOWN_CLASS)
      || targetElement.classList.contains(CategoryDeleteButton.CATEGORY_DELETE_BUTTON_CLASS)) return;
    const { rowIndex, columnIndex, element: cellElement } = this.focusedElements.cell as CellDetails;
    const itemElement = targetElement.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS)
      ? targetElement : targetElement.parentElement;
    CategoryDropdownItem.selectExistingCategory(this, itemElement as HTMLElement, rowIndex, columnIndex,
      cellElement.children[0] as HTMLElement);
    CellWithTextEvents.programmaticBlur(this);
  }

  // this is required to record to stop cell blur from closing the dropdown
  // additionally if the user clicks on dropdown scroll or padding, this will record it
  private static mouseDown(focusedElements: FocusedElements, dropdownElement: HTMLElement) {
    focusedElements.categoryDropdown = dropdownElement;
  }

  public static display(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const {categoryDropdown} = etc.columnsDetails[columnIndex];
    const {element: dropdownEl, categoryToItem} = categoryDropdown;
    if (Object.keys(categoryToItem).length > 0) {
      dropdownEl.onmousedown = CategoryDropdown.mouseDown.bind(this, etc.focusedElements, dropdownEl);
      dropdownEl.onclick = CategoryDropdown.click.bind(etc);
      CategoryDropdownItem.blurItem(categoryDropdown, 'hovered');
      CategoryDropdownItem.blurItem(categoryDropdown, 'matchingWithCellText');
      dropdownEl.style.display = Dropdown.CSS_DISPLAY_VISIBLE;
      CategoryDropdown.setPosition(dropdownEl, cellElement);
      dropdownEl.scrollLeft = 0;
      CategoryDropdownScrollbar.setProperties(categoryDropdown);
      const textElement = cellElement.children[0] as HTMLElement;
      CategoryDropdown.focusItemOnDropdownOpen(textElement, categoryDropdown, etc.defaultCellValue);
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
