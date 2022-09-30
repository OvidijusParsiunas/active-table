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

  private static blurTempFirstItem(categoryDropdownItems: CategoryDropdownItems, itemToBeHighlighted?: HTMLElement) {
    if (categoryDropdownItems.tempFirstItem) {
      if (!itemToBeHighlighted || itemToBeHighlighted !== categoryDropdownItems.tempFirstItem) {
        categoryDropdownItems.tempFirstItem.style.backgroundColor = '';
      }
      delete categoryDropdownItems.tempFirstItem;
    }
  }

  // prettier-ignore
  public static blurItemHighlight(categoryDropdownItems: CategoryDropdownItems, typeOfItem: keyof CategoryDropdownItems) {
    CategoryDropdownItem.blurTempFirstItem(categoryDropdownItems);
    const itemElement = categoryDropdownItems[typeOfItem];
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

  private static highlightItem(color: string, categoryDropdownItems: CategoryDropdownItems, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    targetElement.style.backgroundColor = color;
    CategoryDropdownItem.blurTempFirstItem(categoryDropdownItems, targetElement);
    if (!ElementVisibility.isVisibleInsideParent(targetElement)) targetElement.scrollIntoView({block: 'nearest'});
    if (targetElement === categoryDropdownItems.matchingWithCellText) {
      delete categoryDropdownItems.hovered;
    } else {
      categoryDropdownItems.hovered = targetElement;
    }
  }

  // prettier-ignore
  public static focusMatchingCellCategoryItem(text: string, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    const childrenArr = Array.from(categoryDropdown.children);
    const itemElement = childrenArr.find((itemElement) => itemElement.textContent === text);
    if (!itemElement || categoryDropdownItems.matchingWithCellText !== itemElement) {
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
  private static addItems(uniqueCategories: UniqueCategories, categoryDropdown: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    Object.keys(uniqueCategories).forEach((content) => {
      const itemElement = DropdownItem.addPlaneButtonItem(categoryDropdown as HTMLElement, content as string);
      itemElement.onmouseenter = CategoryDropdownItem.highlightItem.bind(
        this, Color.getRandomPasteleColor(), categoryDropdownItems);
      itemElement.onmouseleave = CategoryDropdownItem.blurItemHighlight.bind(this, categoryDropdownItems, 'hovered');
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
