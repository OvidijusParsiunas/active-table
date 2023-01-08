import {SelectProperties, CategoriesDropdownStyle} from '../../../types/categoriesProperties';
import {LabelCellElement} from '../../cell/cellsWithTextDiv/selectCell/labelCellElement';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryDropdownItemEvents} from './categoryDropdownItemEvents';
import {CategoryDropdownScrollbar} from './categoryDropdownScrollbar';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {OverflowUtils} from '../../../utils/overflow/overflowUtils';
import {CategoryDropdownEvents} from './categoryDropdownEvents';
import {CategoryDropdownT} from '../../../types/columnDetails';
import {CategoryDropdownItem} from './categoryDropdownItem';
import {TableElement} from '../../table/tableElement';
import {CellText} from '../../../types/tableContents';
import {CellElement} from '../../cell/cellElement';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

export class CategoryDropdown {
  private static readonly CATEGORY_DROPDOWN_CLASS = 'category-dropdown';
  private static readonly MAX_HEIGHT_PX = '150px';
  private static readonly ONE_ACTIVE_COLOR_BACKGROUND_COLOR = '#4a69d4';

  private static generateRightPosition() {
    return `4px`;
  }

  private static generateBottomPosition(cellElement: HTMLElement, textContainerElement: HTMLElement) {
    const tableElement = cellElement.offsetParent as HTMLElement;
    const totalVerticalBorder = TableElement.BORDER_DIMENSIONS.bottomWidth + TableElement.BORDER_DIMENSIONS.topWidth;
    const cellTop = tableElement.offsetHeight - totalVerticalBorder - cellElement.offsetTop;
    const textContainerTop = cellTop - textContainerElement.offsetTop;
    return `${textContainerTop + 6}px`;
  }

  private static generateTopPosition(cellElement: HTMLElement, textContainerElement: HTMLElement) {
    const topPadding = LabelCellElement.isCategoryText(textContainerElement)
      ? textContainerElement.offsetTop + textContainerElement.offsetHeight + 2
      : cellElement.offsetHeight - 8;
    return `${ElementOffset.processTop(cellElement.offsetTop + topPadding)}px`;
  }

  private static generateLeftPosition(cellElement: HTMLElement, textContainerElement: HTMLElement): PX {
    const leftPadding = LabelCellElement.isCategoryText(textContainerElement) ? textContainerElement.offsetLeft : 1;
    return `${ElementOffset.processLeft(cellElement.offsetLeft + leftPadding)}px`;
  }

  private static correctPosition(dropdown: HTMLElement, cellElement: HTMLElement, textContainerElement: HTMLElement) {
    const details = ElementVisibility.getDetailsInWindow(dropdown);
    if (!details.isFullyVisible) {
      if (details.blockingSides.has(SIDE.RIGHT)) {
        dropdown.style.left = '';
        // using right instead of left as it is more convenient to display dropdown beside the right side of the table
        dropdown.style.right = CategoryDropdown.generateRightPosition();
      }
      if (details.blockingSides.has(SIDE.BOTTOM)) {
        dropdown.style.top = '';
        // the reason why bottom property is used instead of top is because the removal of a category item
        // reduces the dropdown height and the bottom property keeps the dropdown position close to cell
        dropdown.style.bottom = CategoryDropdown.generateBottomPosition(cellElement, textContainerElement);
      }
    }
  }

  // prettier-ignore
  private static correctPositionForOverflow(dropdown: HTMLElement, tableElement: HTMLElement,
      overflowElement: HTMLElement) {
    if (tableElement.offsetHeight !== overflowElement.scrollHeight) {
      dropdown.style.top = `${tableElement.offsetHeight - dropdown.offsetHeight}px`;
    }
  }

  private static setPosition(dropdown: HTMLElement, cellElement: HTMLElement) {
    const textContainerElement = cellElement.children[0] as HTMLElement;
    dropdown.style.bottom = '';
    dropdown.style.right = '';
    dropdown.style.left = CategoryDropdown.generateLeftPosition(cellElement, textContainerElement);
    dropdown.style.top = CategoryDropdown.generateTopPosition(cellElement, textContainerElement);
    const tableElement = (dropdown.parentElement as HTMLElement).parentElement as HTMLElement;
    const overflowElement = tableElement.parentElement as HTMLElement;
    if (OverflowUtils.isOverflowElement(overflowElement)) {
      CategoryDropdown.correctPositionForOverflow(dropdown, tableElement, overflowElement);
    } else {
      CategoryDropdown.correctPosition(dropdown, cellElement, textContainerElement);
    }
  }

  // prettier-ignore
  public static updateCategoryDropdown(textContainerElement: HTMLElement, dropdown: CategoryDropdownT,
      defaultText: CellText, updateCellText: boolean, matchingCellElement?: HTMLElement) {
    const textElement = CellElement.getTextElement(textContainerElement);
    CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(textElement,
      dropdown, defaultText, updateCellText, matchingCellElement)
    if (updateCellText) {
      CategoryDropdown.setPosition(dropdown.element, textElement.parentElement as HTMLElement);
    }
  }

  private static focusItemOnDropdownOpen(textElement: HTMLElement, dropdown: CategoryDropdownT, defaultText: CellText) {
    // the updateCellText parameter is set to false for a case where the user clicks on a category cell which has
    // its text with a background color but one for a category that has been deleted, hence we do not want to
    // highlight it with a new background color
    CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(textElement, dropdown, defaultText, false);
  }

  private static getWidth(cellElement: HTMLElement, dropdown: CategoryDropdownT, dropdownStyle?: CategoriesDropdownStyle) {
    if (dropdownStyle?.width) {
      return dropdownStyle.width;
    }
    if (dropdown.oneActiveColor) {
      return cellElement.offsetWidth - 2;
    }
    const textContainerElement = cellElement.children[0] as HTMLElement;
    return Dropdown.DROPDOWN_WIDTH - textContainerElement.offsetLeft;
  }

  // prettier-ignore
  public static display(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const {categoryDropdown, settings: {defaultText}, activeType: {categories}} = etc.columnsDetails[columnIndex];
    const {element: dropdownEl, categoryToItem} = categoryDropdown;
    if (Object.keys(categoryToItem).length > 0 && categories) {
      CategoryDropdownEvents.set(etc, dropdownEl);
      CategoryDropdownItemEvents.blurItem(categoryDropdown, 'hovered');
      CategoryDropdownItemEvents.blurItem(categoryDropdown, 'matchingWithCellText');
      dropdownEl.style.width = `${CategoryDropdown.getWidth(cellElement, categoryDropdown, categories.dropdownStyle)}px`
      Dropdown.display(dropdownEl);
      dropdownEl.scrollLeft = 0;
      CategoryDropdownScrollbar.setProperties(categoryDropdown);
      CategoryDropdown.setPosition(dropdownEl, cellElement);
      const textElement = cellElement.children[0] as HTMLElement;
      CategoryDropdown.focusItemOnDropdownOpen(textElement, categoryDropdown, defaultText);
    }
  }

  private static setCustomStyle(categoryDropdown: CategoryDropdownT, dropdownStyle: CategoriesDropdownStyle) {
    const {textAlign, paddingTop, paddingBottom, border} = dropdownStyle;
    categoryDropdown.element.style.textAlign = textAlign || 'left';
    categoryDropdown.element.style.paddingTop = paddingTop || Dropdown.DROPDOWN_VERTICAL_PX;
    categoryDropdown.element.style.paddingBottom = paddingBottom || Dropdown.DROPDOWN_VERTICAL_PX;
    categoryDropdown.element.style.border = border || 'none';
  }

  private static setCustomState(categoryDropdown: CategoryDropdownT, categories: SelectProperties) {
    categoryDropdown.customDropdownStyle = categories.dropdownStyle;
    categoryDropdown.customItemStyle = categories.optionStyle;
    categoryDropdown.staticItems = categories.options;
  }

  // prettier-ignore
  public static setUpDropdown(etc: EditableTableComponent, columnIndex: number) {
    const {activeType: {categories}, categoryDropdown} = etc.columnsDetails[columnIndex];
    if (!categories) return;
    categoryDropdown.oneActiveColor = etc.columnsDetails[columnIndex].activeType.isSelect ?
      CategoryDropdown.ONE_ACTIVE_COLOR_BACKGROUND_COLOR : undefined;
    CategoryDropdown.setCustomState(categoryDropdown, categories)
    CategoryDropdownItem.populateItems(etc, columnIndex);
    if (categories.dropdownStyle) CategoryDropdown.setCustomStyle(categoryDropdown, categories.dropdownStyle);
  }

  // REF-8 - Created for every column
  public static createAndAppend(containerElement: HTMLElement) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.maxHeight = CategoryDropdown.MAX_HEIGHT_PX;
    dropdownElement.classList.add(CategoryDropdown.CATEGORY_DROPDOWN_CLASS);
    containerElement.appendChild(dropdownElement);
    return dropdownElement;
  }

  public static getDefaultObj(dropdownElement: HTMLElement): CategoryDropdownT {
    return {
      categoryToItem: {},
      activeItems: {},
      element: dropdownElement,
      scrollbarPresence: {
        horizontal: false,
        vertical: false,
      },
    };
  }

  public static createContainerElement() {
    return document.createElement('div');
  }
}
