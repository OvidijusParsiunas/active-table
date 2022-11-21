import {ActiveCategoryItems, CategoryDropdownT} from '../../../types/columnDetails';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownItemEvents} from './categoryDropdownItemEvents';
import {CategoryDeleteButton} from './categoryDeleteButton';
import {TableContents} from '../../../types/tableContents';
import {CellDetails} from '../../../types/focusedCell';
import {CellEvents} from '../../cell/cellEvents';
import {Color} from '../../../utils/color/color';
import {DropdownItem} from '../dropdownItem';

interface CategoryToColor {
  [cellText: string]: string;
}

export class CategoryDropdownItem {
  // prettier-ignore
  private static updateCellElementIfNotUpdated(etc: EditableTableComponent,
      activeItem: HTMLElement, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const newText = (activeItem.children[0] as HTMLElement).textContent as string;
    if ((etc.contents[rowIndex][columnIndex] as string) !== newText) {
      CellEvents.updateCell(etc, newText, rowIndex, columnIndex, {processText: false, element: textElement});
    }
  }

  // prettier-ignore
  public static selectExistingCategory(etc: EditableTableComponent,
      activeItemElement: HTMLElement, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    CategoryDropdownItem.updateCellElementIfNotUpdated(etc, activeItemElement, rowIndex, columnIndex, textElement);
    textElement.style.backgroundColor = activeItemElement?.style.backgroundColor;
  }

  // prettier-ignore
  public static addNewCategory(etc: EditableTableComponent, textElement: HTMLElement, dropdown: CategoryDropdownT,
      color?: string) {
    const newCategory = textElement.textContent as string;
    const newColor = color || Color.getLatestPasteleColorAndSetNew();
    textElement.style.backgroundColor = newColor;
    CategoryDropdownItem.addCategoryItem(etc, newCategory, newColor, dropdown);
    Color.setNewLatestPasteleColor();
  }

  // prettier-ignore
  private static updateCellTextBgColor(itemElement: HTMLElement | undefined, textElement: HTMLElement,
      dropdown: CategoryDropdownT, defaultCellValue: string) {
    if (itemElement) {
      textElement.style.backgroundColor = dropdown.categoryToItem[textElement.textContent as string].color;
    } else if (textElement.textContent === '' || textElement.textContent === defaultCellValue) {
      textElement.style.backgroundColor = '';
    } else {
      textElement.style.backgroundColor = Color.getLatestPasteleColor();
    }
  }

  private static updateItemColor(itemElement: HTMLElement | undefined, activeItems: ActiveCategoryItems) {
    if (itemElement) {
      activeItems.matchingWithCellText = itemElement;
      itemElement.dispatchEvent(new MouseEvent('mouseenter'));
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
  public static attemptHighlightMatchingCellCategoryItem(textElement: HTMLElement, dropdown: CategoryDropdownT,
      defaultCellValue: string, updateCellText: boolean, matchingCellElement?: HTMLElement) {
    const {activeItems, categoryToItem} = dropdown;
    const targetText = textElement.textContent as string;
    const itemElement = matchingCellElement || categoryToItem[targetText]?.element;
    if (!itemElement || activeItems.matchingWithCellText !== itemElement) {
      // this is used to preserve the ability for the user to still allow the use of arrow keys to traverse the dropdown
      CategoryDropdownItem.hideHoveredItemHighlight(activeItems);
      CategoryDropdownItemEvents.blurItem(dropdown, 'matchingWithCellText');
    }
    CategoryDropdownItem.updateItemColor(itemElement, activeItems);
    if (updateCellText) CategoryDropdownItem.updateCellTextBgColor(itemElement, textElement, dropdown, defaultCellValue);
  }

  // prettier-ignore
  private static setItemOnCell(etc: EditableTableComponent, item: HTMLElement) {
    const {element, rowIndex, columnIndex} = etc.focusedElements.cell as CellDetails;
    const textElement = element.children[0] as HTMLElement;
    CategoryDropdownItem.updateCellElementIfNotUpdated(etc, item, rowIndex, columnIndex, textElement);
    CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(textElement, 
      etc.columnsDetails[columnIndex].categoryDropdown, etc.defaultCellValue, true, item);
    CaretPosition.setToEndOfText(etc, textElement);
  }

  // prettier-ignore
  public static setSiblingItemOnCell(etc: EditableTableComponent,
      activeItems: ActiveCategoryItems, sibling: 'previousSibling' | 'nextSibling') {
    const {hovered, matchingWithCellText} = activeItems;
    const currentlyHighlightedItem = hovered || matchingWithCellText as HTMLElement;
    const siblingItem = currentlyHighlightedItem?.[sibling] as HTMLElement;
    if (siblingItem) {
      CategoryDropdownItem.setItemOnCell(etc, siblingItem);
    } else {
      const {columnIndex} = etc.focusedElements.cell as CellDetails;
      const dropdownElement = etc.columnsDetails[columnIndex].categoryDropdown.element as HTMLElement;
      if (sibling === 'nextSibling') {
        const firstItem = dropdownElement.children[0] as HTMLElement;
        if (firstItem) CategoryDropdownItem.setItemOnCell(etc, firstItem);
      } else {
        const lastItem = dropdownElement.children[dropdownElement.children.length - 1] as HTMLElement;
        if (lastItem) CategoryDropdownItem.setItemOnCell(etc, lastItem);
      }
    }
  }

  // prettier-ignore
  private static addItemElement(etc: EditableTableComponent,
      text: string, color: string, dropdown: CategoryDropdownT, atStart = false) {
    const itemElement = DropdownItem.addPlaneButtonItem(dropdown.element, text, atStart ? 0 : undefined);
    const deleteButtonElement = CategoryDeleteButton.create(etc, dropdown);
    itemElement.appendChild(deleteButtonElement);
    CategoryDropdownItemEvents.set(itemElement, color, dropdown);
    return itemElement;
  }

  // prettier-ignore
  private static addCategoryItem(etc: EditableTableComponent, categoryName: string, color: string,
     dropdown: CategoryDropdownT) {
    dropdown.categoryToItem[categoryName] = {
      color,
      element: CategoryDropdownItem.addItemElement(etc, categoryName, color, dropdown),
    };
  }

  // prettier-ignore
  private static addCategoryItems(etc: EditableTableComponent, categoryToColor: CategoryToColor,
      dropdown: CategoryDropdownT) {
    Object.keys(categoryToColor).forEach((categoryName) => {
      CategoryDropdownItem.addCategoryItem(etc, categoryName, categoryToColor[categoryName], dropdown);
    });
  }

  private static aggregateCategoryToColor(contents: TableContents, columnIndex: number, defaultCellValue: string) {
    const categoryToColor: CategoryToColor = {};
    contents.slice(1).forEach((row) => {
      const cellText = row[columnIndex] as string;
      categoryToColor[cellText] = Color.getLatestPasteleColorAndSetNew();
    });
    delete categoryToColor[defaultCellValue];
    return categoryToColor;
  }

  public static populateItems(etc: EditableTableComponent, columnIndex: number) {
    const {contents, defaultCellValue, columnsDetails} = etc;
    const categoryToColor = CategoryDropdownItem.aggregateCategoryToColor(contents, columnIndex, defaultCellValue);
    const {categoryDropdown} = columnsDetails[columnIndex];
    CategoryDropdownItem.addCategoryItems(etc, categoryToColor, categoryDropdown);
  }
}
