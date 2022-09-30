import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {ColumnCategories, ColumnDetailsT} from '../../../types/columnDetails';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../editable-table-component';
import {TableContents} from '../../../types/tableContents';
import {CellEvents} from '../../cell/cellEvents';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

// WORK - rename category to categories
// TO-DO allow dev to control whether additional elements are allowed to be added
// WORK - refactor here
export class CategoryDropdown extends Dropdown {
  // open with first one focused, if enter - use that key
  // if user starts typing - no focus is needed

  private static randomPasteleColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
  }

  // prettier-ignore
  public static setTextAndFocusCellBelow(etc: EditableTableComponent,
      columnDetails: ColumnDetailsT, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const { hoveredCategoryItem } = columnDetails;
    if (hoveredCategoryItem) {
      CellEvents.updateCell(etc, hoveredCategoryItem.textContent as string,
        rowIndex, columnIndex, {processText: false, element: cellElement});
    }
    CategoryDropdown.hide(etc);
    columnDetails.elements[rowIndex + 1]?.focus();
  }

  public static highlightItem(item: HTMLElement, color: string, columnDetails: ColumnDetailsT) {
    if (columnDetails.hoveredCategoryItem) columnDetails.hoveredCategoryItem.style.backgroundColor = '';
    item.style.backgroundColor = color;
    if (!ElementVisibility.isVisibleInsideParent(item)) {
      item.scrollIntoView({block: 'nearest'});
    }
    columnDetails.hoveredCategoryItem = item;
  }

  public static highlightSiblingItem(columnDetails: ColumnDetailsT, sibling: 'previousSibling' | 'nextSibling') {
    const {hoveredCategoryItem} = columnDetails;
    if (hoveredCategoryItem?.[sibling]) {
      (hoveredCategoryItem[sibling] as HTMLElement).dispatchEvent(new MouseEvent('mouseenter'));
    }
  }

  private static mouseLeaveItem(columnDetails: ColumnDetailsT, event: MouseEvent) {
    const item = event.target as HTMLElement;
    item.style.backgroundColor = '';
    delete columnDetails.hoveredCategoryItem;
  }

  private static mouseEnterItem(color: string, columnDetails: ColumnDetailsT, event: MouseEvent) {
    const item = event.target as HTMLElement;
    CategoryDropdown.highlightItem(item, color, columnDetails);
  }

  // prettier-ignore
  private static addItems(uniqueCategories: ColumnCategories, categoryDropdown: HTMLElement,
      columnDetails: ColumnDetailsT) {
    Object.keys(uniqueCategories).forEach((content) => {
      const item = DropdownItem.addPlaneButtonItem(categoryDropdown as HTMLElement, content as string);
      item.onmouseenter = CategoryDropdown.mouseEnterItem.bind(this, CategoryDropdown.randomPasteleColor(), columnDetails);
      item.onmouseleave = CategoryDropdown.mouseLeaveItem.bind(this, columnDetails);
    });
  }

  private static aggregateUniqueCategories(contents: TableContents, columnIndex: number, defaultCellValue: string) {
    const uniqueCategories: ColumnCategories = {};
    contents.slice(1).forEach((row) => {
      const cellText = row[columnIndex] as string;
      uniqueCategories[cellText] = true;
    });
    delete uniqueCategories[defaultCellValue];
    return uniqueCategories;
  }

  // prettier-ignore
  public static populateItems(etc: EditableTableComponent, columnIndex: number) {
    const { overlayElementsState: { categoryDropdown }, contents, defaultCellValue, columnsDetails } = etc;
    const uniqueCategories = CategoryDropdown.aggregateUniqueCategories(contents, columnIndex, defaultCellValue);
    columnsDetails[columnIndex].categories = uniqueCategories;
    CategoryDropdown.addItems(uniqueCategories, categoryDropdown as HTMLElement, columnsDetails[columnIndex]);
  }

  // Will need to populate upfront if user has set a column as category upfront
  public static create() {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.maxHeight = '150px';
    dropdownElement.style.overflow = 'auto';
    return dropdownElement;
  }

  // WORK - probably can change param to categoryDropdown;
  // might need closable elements function
  public static hide(etc: EditableTableComponent) {
    const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
    GenericElementUtils.hideElements(categoryDropdown);
  }

  private static setPosition(categoryDropdown: HTMLElement, cellElement: HTMLElement) {
    const rect = cellElement.getBoundingClientRect();
    categoryDropdown.style.left = `${rect.right}px`;
    categoryDropdown.style.top = `${rect.top}px`;
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
    CategoryDropdown.hide(this);
  }

  public static display(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const columnDetails = etc.columnsDetails[columnIndex];
    if (Object.keys(columnDetails.categories).length > 0) {
      const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
      CategoryDropdown.setPosition(categoryDropdown, cellElement);
      categoryDropdown.onclick = CategoryDropdown.dropdownClick.bind(etc, rowIndex, columnIndex);
      // WORK - should focus the one that it is on - if not, enter the first one
      const firstItem = categoryDropdown.children[0] as HTMLElement;
      firstItem.dispatchEvent(new MouseEvent('mouseenter'));
      categoryDropdown.style.display = 'block';
    } else if (Dropdown.isDisplayed(etc.overlayElementsState.categoryDropdown)) {
      CategoryDropdown.hide(etc);
    }
  }
}
