import {CategoryDropdownItems, ColumnDetailsT, UniqueCategories} from '../../../types/columnDetails';
import {CategoryDropdownHorizontalScroll} from './categoryDropdownHorizontalScroll';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../editable-table-component';
import {CaretPosition} from '../../../utils/cellFocus/caretPosition';
import {CellDetails, FocusedCell} from '../../../types/focusedCell';
import {CategoryCellElement} from '../../cell/categoryCellElement';
import {TableContents} from '../../../types/tableContents';
import {CellEvents} from '../../cell/cellEvents';
import {Color} from '../../../utils/color/color';
import {DropdownItem} from '../dropdownItem';
import {SIDE} from '../../../types/side';

export class CategoryDropdownItem {
  public static focusOrBlurNextColumnCell(elements: HTMLElement[], rowIndex: number) {
    const nextColumnCell = elements[rowIndex + 1];
    if (nextColumnCell) {
      // needs to be mousedown in order to set focusedCell
      nextColumnCell.dispatchEvent(new Event('mousedown'));
    } else {
      // if no next cell - blur it as the dropdown will be closed but the cursor would otherwise stay
      (elements[rowIndex].children[0] as HTMLElement).blur();
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
      activeItem: HTMLElement, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const newText = activeItem.textContent as string;
    if ((etc.contents[rowIndex][columnIndex] as string) !== newText) {
      CellEvents.updateCell(etc, newText, rowIndex, columnIndex, {processText: false, element: textElement});
    }
  }

  // upon clicking on dropdown - the focused cell is blurred, hence tcellDetailsOnDropdownClick is an alternative
  private static getCellDetails(focusedCell: FocusedCell, cellDetailsOnDropdownClick?: CellDetails) {
    return (focusedCell.element ? focusedCell : cellDetailsOnDropdownClick) as CellDetails;
  }

  // prettier-ignore
  private static selectExistingCategory(etc: EditableTableComponent, activeItemElement: HTMLElement,
      rowIndex: number, columnIndex: number, textElement: HTMLElement, categoryDropdown: HTMLElement) {
    CategoryDropdownItem.updateCellElementIfNotUpdated(etc, activeItemElement, rowIndex, columnIndex, textElement);
    CategoryDropdownItem.moveItemToTop(activeItemElement, categoryDropdown);
    textElement.style.backgroundColor = activeItemElement?.style.backgroundColor;
  }

  // prettier-ignore
  private static addNewCategory(textElement: HTMLElement, columnDetails: ColumnDetailsT,
      categoryDropdown: HTMLElement, categoryDropdownItems: CategoryDropdownItems) {
    const newCategory = textElement.textContent as string;
    const newColor = Color.getLatestPasteleColorAndSetNew();
    textElement.style.backgroundColor = newColor;
    // WORK - not sure if there is much need to maintain this
    columnDetails.categories.list[newCategory] = newColor;
    CategoryDropdownItem.addItem(newCategory, newColor, categoryDropdown, categoryDropdownItems, true);
    Color.setNewLatestPasteleColor();
  }

  // prettier-ignore
  public static confirmCategorySelection(etc: EditableTableComponent, cellDetailsOnDropdownClick?: CellDetails) {
    const { rowIndex, columnIndex, element: cellElement} = CategoryDropdownItem
      .getCellDetails(etc.focusedCell, cellDetailsOnDropdownClick);
    const textElement = cellElement.children[0] as HTMLElement;
    const columnDetails = etc.columnsDetails[columnIndex];
    const { categories: { categoryDropdownItems } } = columnDetails;
    const { hovered, matchingWithCellText } = categoryDropdownItems;
    const activeItem = hovered || matchingWithCellText;
    const categoryDropdown = etc.overlayElementsState.categoryDropdown as HTMLElement;
    if (activeItem?.style.backgroundColor) {
      CategoryDropdownItem.selectExistingCategory(etc, activeItem, rowIndex, columnIndex, textElement, categoryDropdown);
    } else {
      CategoryDropdownItem.addNewCategory(textElement, columnDetails, categoryDropdown, categoryDropdownItems);
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

  private static updateFocusedCellWithHighlightedItem(etc: EditableTableComponent, highlightedItem: HTMLElement) {
    const {element, rowIndex, columnIndex} = etc.focusedCell as CellDetails;
    const textElement = element?.children[0] as HTMLElement;
    textElement.textContent = highlightedItem.textContent;
    textElement.style.backgroundColor = highlightedItem.style.backgroundColor;
    CaretPosition.setToEndOfText(etc, textElement);
    CategoryDropdownItem.updateCellElementIfNotUpdated(etc, highlightedItem, rowIndex, columnIndex, textElement);
  }

  // prettier-ignore
  public static highlightSiblingItem(etc: EditableTableComponent,
      categoryDropdownItems: CategoryDropdownItems, sibling: 'previousSibling' | 'nextSibling') {
    const {hovered, matchingWithCellText} = categoryDropdownItems;
    const currentlyHighlightedItem = hovered || matchingWithCellText as HTMLElement;
    const siblingElement = currentlyHighlightedItem[sibling] as HTMLElement;
    if (siblingElement) {
      CategoryDropdownItem.blurItemHighlight(categoryDropdownItems, 'hovered')
      // firing event as the handler has the hover color binded to it
      siblingElement.dispatchEvent(new MouseEvent('mouseenter'));
      // need to wait for mouseenter to trigger to get highlight color
      setTimeout(() => CategoryDropdownItem.updateFocusedCellWithHighlightedItem(etc, siblingElement));
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
  private static updateItemAndTextBasedOnCellText(itemElement: HTMLElement,
      textContainerElement: HTMLElement, categoryDropdownItems: CategoryDropdownItems) {
    if (itemElement) {
      categoryDropdownItems.matchingWithCellText = itemElement;
      itemElement.dispatchEvent(new MouseEvent('mouseenter'));
      setTimeout(() => (textContainerElement.style.backgroundColor = itemElement.style.backgroundColor));
    } else {
      textContainerElement.style.backgroundColor = Color.getLatestNewPasteleColor();
    }
  }

  // prettier-ignore
  public static highlightMatchingCellCategoryItem(textContainerElement: HTMLElement, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    const childrenArr = Array.from(categoryDropdown.children);
    const text = textContainerElement.textContent as string;
    const itemElement = childrenArr.find((itemElement) => itemElement.textContent === text) as HTMLElement || undefined;
    if (!itemElement || categoryDropdownItems.matchingWithCellText !== itemElement) {
      // this is used to preserve the ability for the user to still allow the use of arrow keys to traverse the dropdown
      CategoryDropdownItem.hideHoveredItemHighlight(categoryDropdownItems);
      CategoryDropdownItem.blurItemHighlight(categoryDropdownItems, 'matchingWithCellText');
    }
    CategoryDropdownItem.updateItemAndTextBasedOnCellText(itemElement, textContainerElement, categoryDropdownItems);
  }

  private static aggregateUniqueCategories(contents: TableContents, columnIndex: number, defaultCellValue: string) {
    const uniqueCategories: UniqueCategories = {};
    contents.slice(1).forEach((row) => {
      const cellText = row[columnIndex] as string;
      uniqueCategories[cellText] = Color.getLatestPasteleColorAndSetNew();
    });
    delete uniqueCategories[defaultCellValue];
    return uniqueCategories;
  }

  // prettier-ignore
  private static convertColumnCellsToCategories(etc: EditableTableComponent, elements: HTMLElement[],
      uniqueCategories: UniqueCategories, columnIndex: number) {
    elements.slice(1).forEach((cellElement: HTMLElement, dataIndex: number) => {
      const relativeIndex = dataIndex + 1;
      CategoryCellElement.convertFromDataToCategory(etc, relativeIndex, columnIndex,
        cellElement, uniqueCategories[cellElement.textContent as string]);
    });
  }

  // prettier-ignore
  private static addItem(text: string,
      color: string, categoryDropdown: HTMLElement, categoryDropdownItems: CategoryDropdownItems, atStart = false) {
    const itemElement = DropdownItem.addPlaneButtonItem(categoryDropdown as HTMLElement, text, atStart ? 0 : undefined);
    itemElement.onmouseenter = CategoryDropdownItem.highlightItem.bind(this, color, categoryDropdownItems);
    itemElement.onmouseleave = CategoryDropdownItem.blurItemHighlight.bind(this, categoryDropdownItems, 'hovered');
  }

  // prettier-ignore
  private static addItems(uniqueCategories: UniqueCategories,
      categoryDropdown: HTMLElement, categoryDropdownItems: CategoryDropdownItems) {
    Object.keys(uniqueCategories).forEach((categoryName) => {
      CategoryDropdownItem.addItem(categoryName, uniqueCategories[categoryName], categoryDropdown, categoryDropdownItems);
    });
  }

  // prettier-ignore
  public static populateItems(etc: EditableTableComponent, columnIndex: number) {
    const { overlayElementsState: { categoryDropdown }, contents, defaultCellValue, columnsDetails } = etc;
    const uniqueCategories = CategoryDropdownItem.aggregateUniqueCategories(contents, columnIndex, defaultCellValue);
    columnsDetails[columnIndex].categories.list = uniqueCategories;
    CategoryDropdownItem.convertColumnCellsToCategories(
      etc, columnsDetails[columnIndex].elements, uniqueCategories, columnIndex);
    CategoryDropdownItem.addItems(
      uniqueCategories, categoryDropdown as HTMLElement, columnsDetails[columnIndex].categories.categoryDropdownItems);
  }
}
