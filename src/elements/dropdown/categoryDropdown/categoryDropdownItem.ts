import {Categories, ActiveCategoryItems, UniqueCategories} from '../../../types/columnDetails';
import {CategoryDropdownHorizontalScroll} from './categoryDropdownHorizontalScroll';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryCellElement} from '../../cell/categoryCellElement';
import {TableContents} from '../../../types/tableContents';
import {CellDetails} from '../../../types/focusedCell';
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

  // prettier-ignore
  public static selectExistingCategory(etc: EditableTableComponent, activeItemElement: HTMLElement,
      rowIndex: number, columnIndex: number, textElement: HTMLElement, categoryDropdown: HTMLElement) {
    CategoryDropdownItem.updateCellElementIfNotUpdated(etc, activeItemElement, rowIndex, columnIndex, textElement);
    CategoryDropdownItem.moveItemToTop(activeItemElement, categoryDropdown);
    textElement.style.backgroundColor = activeItemElement?.style.backgroundColor;
  }

  public static addNewCategory(textElement: HTMLElement, categories: Categories) {
    const newCategory = textElement.textContent as string;
    const newColor = Color.getLatestPasteleColorAndSetNew();
    textElement.style.backgroundColor = newColor;
    // WORK - not sure if there is much need to maintain this
    categories.list[newCategory] = newColor;
    CategoryDropdownItem.addItem(newCategory, newColor, categories, true);
    Color.setNewLatestPasteleColor();
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

  // prettier-ignore
  private static updateItemAndTextColorBasedOnMatch(itemElement: HTMLElement | undefined,
      textElement: HTMLElement, categories: Categories) {
    if (itemElement) {
      categories.dropdown.activeItems.matchingWithCellText = itemElement;
      itemElement.dispatchEvent(new MouseEvent('mouseenter'));
      setTimeout(() => (textElement.style.backgroundColor = itemElement.style.backgroundColor));
    } else {
      textElement.style.backgroundColor = Color.getLatestPasteleColor();
    }
    categories.isCellTextNewCategory = !itemElement;
  }

  // prettier-ignore
  public static blurItemHighlight(activeItems: ActiveCategoryItems, typeOfItem: keyof ActiveCategoryItems) {
    const itemElement = activeItems[typeOfItem] as HTMLElement;
    if (itemElement !== undefined) {
      if (typeOfItem === 'matchingWithCellText'
          || (typeOfItem === 'hovered' && itemElement !== activeItems.matchingWithCellText)) {
        itemElement.style.backgroundColor = '';
        delete activeItems[typeOfItem];
      }
    }
  }

  private static hideHoveredItemHighlight(activeItems: ActiveCategoryItems) {
    const {hovered, matchingWithCellText} = activeItems;
    if (hovered) {
      hovered.style.backgroundColor = '';
    } else {
      activeItems.hovered = matchingWithCellText;
    }
  }

  // prettier-ignore
  public static attemptHighlightMatchingCellCategoryItem(textElement: HTMLElement,
      categories: Categories, matchingCellElement?: HTMLElement) {
    const { dropdown: { element, activeItems } } = categories;
    const itemsArr = Array.from(element.children);
    const text = textElement.textContent as string;
    const itemElement = matchingCellElement || itemsArr.find(
      (itemElement) => itemElement.textContent === text) as (HTMLElement | undefined);
    if (!itemElement || activeItems.matchingWithCellText !== itemElement) {
      // this is used to preserve the ability for the user to still allow the use of arrow keys to traverse the dropdown
      CategoryDropdownItem.hideHoveredItemHighlight(activeItems);
      CategoryDropdownItem.blurItemHighlight(activeItems, 'matchingWithCellText');
    }
    CategoryDropdownItem.updateItemAndTextColorBasedOnMatch(itemElement, textElement, categories);
  }

  // prettier-ignore
  public static setSiblingItemOnCell(etc: EditableTableComponent,
      activeItems: ActiveCategoryItems, sibling: 'previousSibling' | 'nextSibling') {
    const {hovered, matchingWithCellText} = activeItems;
    const currentlyHighlightedItem = hovered || matchingWithCellText as HTMLElement;
    const siblingItem = currentlyHighlightedItem[sibling] as HTMLElement;
    if (siblingItem) {
      const {element, rowIndex, columnIndex} = etc.focusedElements.cell as CellDetails;
      const textElement = element.children[0] as HTMLElement;
      CategoryDropdownItem.updateCellElementIfNotUpdated(etc, siblingItem, rowIndex, columnIndex, textElement);
      CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(textElement, 
        etc.columnsDetails[columnIndex].categories, siblingItem);
      CaretPosition.setToEndOfText(etc, textElement);
    }
  }

  // prettier-ignore
  private static highlightItem(color: string, categories: Categories, event: MouseEvent) {
    const {dropdown: {isHorizontalScrollPresent, activeItems}} = categories;
    // this is used for a case where an item is highlighted via arrow and then mouse hovers over another item
    if (activeItems.hovered) activeItems.hovered.style.backgroundColor = '';
    const itemElement = event.target as HTMLElement;
    itemElement.style.backgroundColor = color;
    const dropdownElement = itemElement.parentElement as HTMLElement;
    CategoryDropdownItem.scrollToItemIfNeeded(event, itemElement, isHorizontalScrollPresent, dropdownElement);
    if (itemElement === activeItems.matchingWithCellText) {
      delete activeItems.hovered;
    } else {
      activeItems.hovered = itemElement;
    }
  }

  private static addItem(text: string, color: string, categories: Categories, atStart = false) {
    const {dropdown} = categories;
    const itemElement = DropdownItem.addPlaneButtonItem(dropdown.element, text, atStart ? 0 : undefined);
    itemElement.onmouseenter = CategoryDropdownItem.highlightItem.bind(this, color, categories);
    itemElement.onmouseleave = CategoryDropdownItem.blurItemHighlight.bind(this, dropdown.activeItems, 'hovered');
  }

  private static addItems(uniqueCategories: UniqueCategories, categories: Categories) {
    Object.keys(uniqueCategories).forEach((categoryName) => {
      CategoryDropdownItem.addItem(categoryName, uniqueCategories[categoryName], categories);
    });
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

  public static populateItems(etc: EditableTableComponent, columnIndex: number) {
    const {contents, defaultCellValue, columnsDetails} = etc;
    const uniqueCategories = CategoryDropdownItem.aggregateUniqueCategories(contents, columnIndex, defaultCellValue);
    const {categories} = columnsDetails[columnIndex];
    categories.list = uniqueCategories;
    CategoryCellElement.convertColumnFromDataToCategory(etc, uniqueCategories, columnIndex);
    CategoryDropdownItem.addItems(uniqueCategories, categories);
  }
}
