import {CategoryDropdownItems, UniqueCategories, ColumnDetailsT} from '../../../types/columnDetails';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
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
    const { categories: { categoryDropdownItems: { hovered } }, elements } = columnDetails;
    if (hovered) {
      CellEvents.updateCell(etc, hovered.textContent as string,
        rowIndex, columnIndex, {processText: false, element: cellElement});
    }
    CategoryDropdown.hide(etc);
    const cellBelow = elements[rowIndex + 1];
    if (cellBelow) {
      cellBelow.focus();
    } else {
      // if no cell below - blur as the dropdown will be closed but the cursor would otherwise stay
      elements[rowIndex].blur();
    }
  }

  private static highlightItem(item: HTMLElement, color: string, categoryDropdownItems: CategoryDropdownItems) {
    const {hovered, matchingWithCellText} = categoryDropdownItems;
    if (hovered) hovered.style.backgroundColor = '';
    item.style.backgroundColor = color;
    if (!ElementVisibility.isVisibleInsideParent(item)) item.scrollIntoView({block: 'nearest'});
    // do not set matching item to hovered item as hovered item background can be unset
    if (matchingWithCellText !== item) categoryDropdownItems.hovered = item;
  }

  // prettier-ignore
  public static highlightSiblingItem(categoryDropdownItems: CategoryDropdownItems,
      sibling: 'previousSibling' | 'nextSibling') {
    const {hovered, matchingWithCellText} = categoryDropdownItems;
    const activeItem = hovered || matchingWithCellText;
    (activeItem?.[sibling] as HTMLElement)?.dispatchEvent(new MouseEvent('mouseenter'));
  }

  private static blurItemHighlight(categoryDropdownItems: CategoryDropdownItems, typeOfItem: keyof CategoryDropdownItems) {
    const itemElement = categoryDropdownItems[typeOfItem];
    if (itemElement !== undefined) {
      itemElement.style.backgroundColor = '';
      delete categoryDropdownItems[typeOfItem];
    }
  }

  private static mouseEnterItem(color: string, categoryDropdownItems: CategoryDropdownItems, event: MouseEvent) {
    const item = event.target as HTMLElement;
    CategoryDropdown.highlightItem(item, color, categoryDropdownItems);
  }

  // prettier-ignore
  private static addItems(uniqueCategories: UniqueCategories, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    Object.keys(uniqueCategories).forEach((content) => {
      const item = DropdownItem.addPlaneButtonItem(categoryDropdown as HTMLElement, content as string);
      item.onmouseenter = CategoryDropdown.mouseEnterItem.bind(
        this, CategoryDropdown.randomPasteleColor(), categoryDropdownItems);
      item.onmouseleave = CategoryDropdown.blurItemHighlight.bind(this, categoryDropdownItems, 'hovered');
    });
  }

  private static aggregateUniqueCategories(contents: TableContents, columnIndex: number, defaultCellValue: string) {
    const uniqueCategories: UniqueCategories = {};
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
    columnsDetails[columnIndex].categories.list = uniqueCategories;
    CategoryDropdown.addItems(
      uniqueCategories, categoryDropdown as HTMLElement, columnsDetails[columnIndex].categories.categoryDropdownItems);
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
    categoryDropdown.style.top = `${cellElement.offsetTop}px`;
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

  // prettier-ignore
  public static focusMatchingCellCategoryItem(text: string, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    categoryDropdown.style.overflow = 'hidden';
    const childrenArr = Array.from(categoryDropdown.children);
    const item = childrenArr.find((item) => item.textContent === text);
    if (!item || categoryDropdownItems.matchingWithCellText !== item) {
      CategoryDropdown.blurItemHighlight(categoryDropdownItems, 'matchingWithCellText');
    }
    if (item) {
      categoryDropdownItems.matchingWithCellText = item as HTMLElement;
      item.dispatchEvent(new MouseEvent('mouseenter'));
    }
    setTimeout(() => (categoryDropdown.style.overflow = 'auto'));
  }

  // prettier-ignore
  private static focusItemOnDropdownOpen(text: string, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    CategoryDropdown.focusMatchingCellCategoryItem(text, categoryDropdown, categoryDropdownItems);
    if (!categoryDropdownItems.matchingWithCellText) {
      const firstItem = categoryDropdown.children[0];
      if (firstItem) {
        firstItem.dispatchEvent(new MouseEvent('mouseenter'));
      }
    }
  }

  public static display(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const {list, categoryDropdownItems} = etc.columnsDetails[columnIndex].categories;
    if (Object.keys(list).length > 0) {
      const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
      CategoryDropdown.setPosition(categoryDropdown, cellElement);
      categoryDropdown.onclick = CategoryDropdown.dropdownClick.bind(etc, rowIndex, columnIndex);
      CategoryDropdown.blurItemHighlight(categoryDropdownItems, 'hovered');
      CategoryDropdown.blurItemHighlight(categoryDropdownItems, 'matchingWithCellText');
      categoryDropdown.style.display = 'block';
      CategoryDropdown.focusItemOnDropdownOpen(cellElement.textContent as string, categoryDropdown, categoryDropdownItems);
    } else if (Dropdown.isDisplayed(etc.overlayElementsState.categoryDropdown)) {
      CategoryDropdown.hide(etc);
    }
  }
}
