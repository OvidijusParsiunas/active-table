import {ColumnDetailsT, CategoryDropdownItems, UniqueCategories} from '../../../types/columnDetails';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../editable-table-component';
import {TableContents} from '../../../types/tableContents';
import {CellEvents} from '../../cell/cellEvents';
import {Color} from '../../../utils/color/color';
import {DropdownItem} from '../dropdownItem';

export class CategoryDropdownItem {
  private static focusOrBlurCellBelow(elements: HTMLElement[], rowIndex: number) {
    const cellBelow = elements[rowIndex + 1];
    if (cellBelow) {
      cellBelow.focus();
    } else {
      // if no cell below - blur as the dropdown will be closed but the cursor would otherwise stay
      elements[rowIndex].blur();
    }
  }

  // prettier-ignore
  public static setTextAndFocusCellBelow(etc: EditableTableComponent,
      columnDetails: ColumnDetailsT, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const { categories: { categoryDropdownItems: { hovered } }, elements } = columnDetails;
    if (hovered) {
      CellEvents.updateCell(etc, hovered.textContent as string,
        rowIndex, columnIndex, {processText: false, element: cellElement});
    }
    CategoryDropdownItem.focusOrBlurCellBelow(elements, rowIndex);
  }

  public static blurItemHighlight(categoryDropdownItems: CategoryDropdownItems, typeOfItem: keyof CategoryDropdownItems) {
    const itemElement = categoryDropdownItems[typeOfItem];
    if (itemElement !== undefined) {
      itemElement.style.backgroundColor = '';
      delete categoryDropdownItems[typeOfItem];
    }
  }

  // prettier-ignore
  public static highlightSiblingItem(categoryDropdownItems: CategoryDropdownItems,
      sibling: 'previousSibling' | 'nextSibling') {
    const {hovered, matchingWithCellText} = categoryDropdownItems;
    const activeItem = hovered || matchingWithCellText;
    // firing event as the handler has the hover color binded to it
    (activeItem?.[sibling] as HTMLElement)?.dispatchEvent(new MouseEvent('mouseenter'));
  }

  private static highlightItem(color: string, categoryDropdownItems: CategoryDropdownItems, event: MouseEvent) {
    const item = event.target as HTMLElement;
    const {hovered, matchingWithCellText} = categoryDropdownItems;
    if (hovered) hovered.style.backgroundColor = '';
    item.style.backgroundColor = color;
    if (!ElementVisibility.isVisibleInsideParent(item)) item.scrollIntoView({block: 'nearest'});
    // do not set matching item to hovered item as hovered item background can be unset
    if (matchingWithCellText !== item) categoryDropdownItems.hovered = item;
  }

  // prettier-ignore
  public static focusMatchingCellCategoryItem(text: string, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    categoryDropdown.style.overflow = 'hidden';
    const childrenArr = Array.from(categoryDropdown.children);
    const item = childrenArr.find((item) => item.textContent === text);
    if (!item || categoryDropdownItems.matchingWithCellText !== item) {
      CategoryDropdownItem.blurItemHighlight(categoryDropdownItems, 'matchingWithCellText');
    }
    if (item) {
      categoryDropdownItems.matchingWithCellText = item as HTMLElement;
      item.dispatchEvent(new MouseEvent('mouseenter'));
    }
    setTimeout(() => (categoryDropdown.style.overflow = 'auto'));
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
  private static addItems(uniqueCategories: UniqueCategories, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    Object.keys(uniqueCategories).forEach((content) => {
      const item = DropdownItem.addPlaneButtonItem(categoryDropdown as HTMLElement, content as string);
      item.onmouseenter = CategoryDropdownItem.highlightItem.bind(
        this, Color.getRandomPasteleColor(), categoryDropdownItems);
      item.onmouseleave = CategoryDropdownItem.blurItemHighlight.bind(this, categoryDropdownItems, 'hovered');
    });
  }

  // prettier-ignore
  public static populateItems(etc: EditableTableComponent, columnIndex: number) {
    const { overlayElementsState: { categoryDropdown }, contents, defaultCellValue, columnsDetails } = etc;
    const uniqueCategories = CategoryDropdownItem.aggregateUniqueCategories(contents, columnIndex, defaultCellValue);
    columnsDetails[columnIndex].categories.list = uniqueCategories;
    CategoryDropdownItem.addItems(
      uniqueCategories, categoryDropdown as HTMLElement, columnsDetails[columnIndex].categories.categoryDropdownItems);
  }
}
