import {ColumnDetailsT, CategoryDropdownItems, UniqueCategories} from '../../../types/columnDetails';
import {CategoryDropdownHorizontalScroll} from './categoryDropdownHorizontalScroll';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../editable-table-component';
import {TableContents} from '../../../types/tableContents';
import {CellEvents} from '../../cell/cellEvents';
import {Color} from '../../../utils/color/color';
import {DropdownItem} from '../dropdownItem';
import {SIDE} from '../../../types/side';

export class CategoryDropdownItem {
  public static focusOrBlurCellBelow(elements: HTMLElement[], rowIndex: number) {
    const cellBelow = elements[rowIndex + 1];
    if (cellBelow) {
      cellBelow.focus();
    } else {
      // if no cell below - blur as the dropdown will be closed but the cursor would otherwise stay
      elements[rowIndex].blur();
    }
  }

  // WORK - perhaps moving item to top may not be the greatest idea as it just makes the whole thing confusing
  private static moveItemToTop(item: HTMLElement, categoryDropdown: HTMLElement) {
    categoryDropdown.removeChild(item);
    if (categoryDropdown.children.length > 0) {
      categoryDropdown.insertBefore(item, categoryDropdown.children[0]);
    } else {
      categoryDropdown.appendChild(item);
    }
  }

  // prettier-ignore
  private static updateCellElementIfNotUpdated(etc: EditableTableComponent,
      activeItem: HTMLElement, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const newText = activeItem.textContent;
    if ((etc.contents[rowIndex][columnIndex] as string) !== newText) {
      CellEvents.updateCell(etc, activeItem.textContent as string,
        rowIndex, columnIndex, {processText: false, element: cellElement});
    }
  }

  // prettier-ignore
  public static setText(etc: EditableTableComponent,
      columnDetails: ColumnDetailsT, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const { categories: { categoryDropdownItems } } = columnDetails;
    const { hovered, matchingWithCellText } = categoryDropdownItems;
    const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
    const activeItem = hovered || matchingWithCellText;
    if (activeItem?.style.backgroundColor) {
      CategoryDropdownItem.updateCellElementIfNotUpdated(etc, activeItem, rowIndex, columnIndex, cellElement);
      CategoryDropdownItem.moveItemToTop(activeItem, categoryDropdown)
    } else {
      // WORK - not sure if there is much need to maintain this
      columnDetails.categories.list[cellElement.textContent as string] = true;
      CategoryDropdownItem.addItem(cellElement.textContent as string, categoryDropdown, categoryDropdownItems, true);
    }
  }

  // prettier-ignore
  public static blurItemHighlight(categoryDropdownItems: CategoryDropdownItems, typeOfItem: keyof CategoryDropdownItems) {
    const itemElement = categoryDropdownItems[typeOfItem] as HTMLElement;
    if (itemElement !== undefined) {
      if (typeOfItem === 'matchingWithCellText'
          || (typeOfItem === 'hovered' && itemElement !== categoryDropdownItems.matchingWithCellText)) {
        itemElement.style.backgroundColor = '';
        delete categoryDropdownItems[typeOfItem];
      }
    }
  }

  // prettier-ignore
  public static highlightSiblingItem(categoryDropdownItems: CategoryDropdownItems,
      sibling: 'previousSibling' | 'nextSibling') {
    const {hovered, matchingWithCellText} = categoryDropdownItems;
    const currentlyHighlightedItem = hovered || matchingWithCellText as HTMLElement;
    if (currentlyHighlightedItem[sibling]) {
      CategoryDropdownItem.blurItemHighlight(categoryDropdownItems, 'hovered')
      // firing event as the handler has the hover color binded to it
      currentlyHighlightedItem[sibling]?.dispatchEvent(new MouseEvent('mouseenter'));
    }
  }

  // prettier-ignore
  private static scrollToItemIfNeeded(event: MouseEvent,
      itemElement: HTMLElement, isHorizontalScrollPresent: boolean, dropdownElement: HTMLElement) {
    // not automatically scrolling when user hovers their mouse over a partial item as it is bad UX
    if (event.isTrusted) return; 
    const visibilityDetails = ElementVisibility.isVerticallyVisibleInsideParent(itemElement);
    if (!visibilityDetails.isFullyVisible) {
      itemElement.scrollIntoView({block: 'nearest'});
      // REF-4
      if (isHorizontalScrollPresent && visibilityDetails.blockingSide === SIDE.BOTTOM) {
        CategoryDropdownHorizontalScroll.scrollDownFurther(dropdownElement)
      }
    }
  }

  private static highlightItem(color: string, categoryDropdownItems: CategoryDropdownItems, event: MouseEvent) {
    const {hovered, matchingWithCellText, isHorizontalScrollPresent} = categoryDropdownItems;
    // this is used for a case where an item is highlighted via arrow and then mouse hovers over another item
    if (hovered) hovered.style.backgroundColor = '';
    const itemElement = event.target as HTMLElement;
    itemElement.style.backgroundColor = color;
    const dropdownElement = itemElement.parentElement as HTMLElement;
    CategoryDropdownItem.scrollToItemIfNeeded(event, itemElement, isHorizontalScrollPresent, dropdownElement);
    if (itemElement === matchingWithCellText) {
      delete categoryDropdownItems.hovered;
    } else {
      categoryDropdownItems.hovered = itemElement;
    }
  }

  private static hideHoveredItemHighlight(categoryDropdownItems: CategoryDropdownItems) {
    const {hovered, matchingWithCellText} = categoryDropdownItems;
    if (hovered) {
      hovered.style.backgroundColor = '';
    } else {
      categoryDropdownItems.hovered = matchingWithCellText;
    }
  }

  // prettier-ignore
  public static focusMatchingCellCategoryItem(text: string, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    const childrenArr = Array.from(categoryDropdown.children);
    const itemElement = childrenArr.find((itemElement) => itemElement.textContent === text);
    if (!itemElement || categoryDropdownItems.matchingWithCellText !== itemElement) {
      // this is used to preserve the ability for the user to still allow the use of arrow keys to traverse the dropdown
      CategoryDropdownItem.hideHoveredItemHighlight(categoryDropdownItems);
      CategoryDropdownItem.blurItemHighlight(categoryDropdownItems, 'matchingWithCellText');
    }
    if (itemElement) {
      categoryDropdownItems.matchingWithCellText = itemElement as HTMLElement;
      itemElement.dispatchEvent(new MouseEvent('mouseenter'));
    }
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
  private static addItem(text: string,
      categoryDropdown: HTMLElement, categoryDropdownItems: CategoryDropdownItems, atStart = false) {
    const itemElement = DropdownItem.addPlaneButtonItem(categoryDropdown as HTMLElement, text, atStart ? 0 : undefined);
    itemElement.onmouseenter = CategoryDropdownItem.highlightItem.bind(
      this, Color.getRandomPasteleColor(), categoryDropdownItems);
    itemElement.onmouseleave = CategoryDropdownItem.blurItemHighlight.bind(this, categoryDropdownItems, 'hovered');
  }

  // prettier-ignore
  private static addItems(uniqueCategories: UniqueCategories,
      categoryDropdown: HTMLElement, categoryDropdownItems: CategoryDropdownItems) {
    Object.keys(uniqueCategories).forEach((content) => {
      CategoryDropdownItem.addItem(content, categoryDropdown, categoryDropdownItems);
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
