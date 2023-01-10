import {LabelCellTextElement} from '../../cell/cellsWithTextDiv/selectCell/label/labelCellTextElement';
import {SelectProperties, SelectDropdownStyle} from '../../../types/selectProperties';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../editable-table-component';
import {SelectDropdownItemEvents} from './selectDropdownItemEvents';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {OverflowUtils} from '../../../utils/overflow/overflowUtils';
import {SelectDropdownScrollbar} from './selectDropdownScrollbar';
import {SelectDropdownT} from '../../../types/columnDetails';
import {SelectDropdownEvents} from './selectDropdownEvents';
import {SelectDropdownItem} from './selectDropdownItem';
import {TableElement} from '../../table/tableElement';
import {CellText} from '../../../types/tableContents';
import {CellElement} from '../../cell/cellElement';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

export class SelectDropdown {
  private static readonly SELECT_DROPDOWN_CLASS = 'select-dropdown';
  private static readonly MAX_HEIGHT_PX = '150px';
  private static readonly MIN_WIDTH = 70;
  private static readonly MAX_WIDTH = 200;
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
    const topPadding = LabelCellTextElement.isLabelText(textContainerElement)
      ? textContainerElement.offsetTop + textContainerElement.offsetHeight + 2
      : cellElement.offsetHeight - 8;
    return `${ElementOffset.processTop(cellElement.offsetTop + topPadding)}px`;
  }

  private static generateLeftPosition(cellElement: HTMLElement, textContainerElement: HTMLElement): PX {
    const leftPadding = LabelCellTextElement.isLabelText(textContainerElement) ? textContainerElement.offsetLeft : 1;
    return `${ElementOffset.processLeft(cellElement.offsetLeft + leftPadding)}px`;
  }

  private static correctPosition(dropdown: HTMLElement, cellElement: HTMLElement, textContainerElement: HTMLElement) {
    const details = ElementVisibility.getDetailsInWindow(dropdown);
    if (!details.isFullyVisible) {
      if (details.blockingSides.has(SIDE.RIGHT)) {
        dropdown.style.left = '';
        // using right instead of left as it is more convenient to display dropdown beside the right side of the table
        dropdown.style.right = SelectDropdown.generateRightPosition();
      }
      if (details.blockingSides.has(SIDE.BOTTOM)) {
        dropdown.style.top = '';
        // the reason why bottom property is used instead of top is because the removal of a select item
        // reduces the dropdown height and the bottom property keeps the dropdown position close to cell
        dropdown.style.bottom = SelectDropdown.generateBottomPosition(cellElement, textContainerElement);
      }
    }
  }

  // prettier-ignore
  private static correctPositionForOverflow(dropdown: HTMLElement, tableElement: HTMLElement,
      overflowElement: HTMLElement) {
    if (tableElement.offsetHeight !== overflowElement.scrollHeight) {
      dropdown.style.top = `${tableElement.offsetHeight - dropdown.offsetHeight}px`;
    }
    if (tableElement.offsetWidth !== overflowElement.scrollWidth) {
      dropdown.style.left = `${tableElement.offsetWidth - dropdown.offsetWidth}px`;
    }
  }

  private static setPosition(dropdown: HTMLElement, cellElement: HTMLElement) {
    const textContainerElement = cellElement.children[0] as HTMLElement;
    dropdown.style.bottom = '';
    dropdown.style.right = '';
    dropdown.style.left = SelectDropdown.generateLeftPosition(cellElement, textContainerElement);
    dropdown.style.top = SelectDropdown.generateTopPosition(cellElement, textContainerElement);
    const tableElement = (dropdown.parentElement as HTMLElement).parentElement as HTMLElement;
    const overflowElement = tableElement.parentElement as HTMLElement;
    if (OverflowUtils.isOverflowElement(overflowElement)) {
      SelectDropdown.correctPositionForOverflow(dropdown, tableElement, overflowElement);
    } else {
      SelectDropdown.correctPosition(dropdown, cellElement, textContainerElement);
    }
  }

  // prettier-ignore
  public static updateSelectDropdown(textContainerElement: HTMLElement, dropdown: SelectDropdownT,
      defaultText: CellText, updateCellText: boolean, matchingCellElement?: HTMLElement) {
    const textElement = CellElement.getTextElement(textContainerElement);
    SelectDropdownItem.attemptHighlightMatchingItemWithCell(textElement,
      dropdown, defaultText, updateCellText, matchingCellElement)
    if (updateCellText) {
      SelectDropdown.setPosition(dropdown.element, textElement.parentElement as HTMLElement);
    }
  }

  private static focusItemOnDropdownOpen(textElement: HTMLElement, dropdown: SelectDropdownT, defaultText: CellText) {
    // the updateCellText parameter is set to false for a case where the user clicks on a select cell which has
    // its text with a background color but one for a select that has been deleted, hence we do not want to
    // highlight it with a new background color
    SelectDropdownItem.attemptHighlightMatchingItemWithCell(textElement, dropdown, defaultText, false);
  }

  private static correctWidthForOverflow(dropdownElement: HTMLElement) {
    if (dropdownElement.offsetWidth !== dropdownElement.scrollWidth) {
      dropdownElement.style.width = `${Math.min(dropdownElement.scrollWidth, SelectDropdown.MAX_WIDTH)}px`;
    }
  }

  private static getWidth(cellElement: HTMLElement, dropdown: SelectDropdownT, dropdownStyle?: SelectDropdownStyle) {
    if (dropdownStyle?.width) return dropdownStyle.width;
    if (dropdown.oneActiveColor) return Math.max(cellElement.offsetWidth - 2, SelectDropdown.MIN_WIDTH);
    const textContainerElement = cellElement.children[0] as HTMLElement;
    return Math.max(cellElement.offsetWidth - textContainerElement.offsetLeft * 2, SelectDropdown.MIN_WIDTH);
  }

  // prettier-ignore
  public static display(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const {selectDropdown, settings: {defaultText}, activeType: {selectProps}} = etc.columnsDetails[columnIndex];
    const {element: dropdownEl, selectItem} = selectDropdown;
    if (Object.keys(selectItem).length > 0 && selectProps) {
      SelectDropdownEvents.set(etc, dropdownEl);
      SelectDropdownItemEvents.blurItem(selectDropdown, 'hovered');
      SelectDropdownItemEvents.blurItem(selectDropdown, 'matchingWithCellText');
      dropdownEl.style.width = `${SelectDropdown.getWidth(cellElement, selectDropdown, selectProps.dropdownStyle)}px`
      Dropdown.display(dropdownEl);
      dropdownEl.scrollLeft = 0;
      SelectDropdown.correctWidthForOverflow(dropdownEl);
      SelectDropdownScrollbar.setProperties(selectDropdown);
      SelectDropdown.setPosition(dropdownEl, cellElement);
      const textElement = cellElement.children[0] as HTMLElement;
      SelectDropdown.focusItemOnDropdownOpen(textElement, selectDropdown, defaultText);
      return true;
    }
    return false;
  }

  private static setCustomStyle(selectDropdown: SelectDropdownT, dropdownStyle: SelectDropdownStyle) {
    const {textAlign, paddingTop, paddingBottom, border} = dropdownStyle;
    selectDropdown.element.style.textAlign = textAlign || 'left';
    selectDropdown.element.style.paddingTop = paddingTop || Dropdown.DROPDOWN_VERTICAL_PX;
    selectDropdown.element.style.paddingBottom = paddingBottom || Dropdown.DROPDOWN_VERTICAL_PX;
    selectDropdown.element.style.border = border || 'none';
  }

  private static setCustomState(selectDropdown: SelectDropdownT, select: SelectProperties) {
    selectDropdown.customDropdownStyle = select.dropdownStyle;
    selectDropdown.customItemStyle = select.optionStyle;
    selectDropdown.staticItems = select.options;
  }

  // prettier-ignore
  public static setUpDropdown(etc: EditableTableComponent, columnIndex: number) {
    const {activeType: {selectProps}, selectDropdown} = etc.columnsDetails[columnIndex];
    if (!selectProps) return;
    selectDropdown.oneActiveColor = etc.columnsDetails[columnIndex].activeType.selectProps?.isBasicSelect ?
      SelectDropdown.ONE_ACTIVE_COLOR_BACKGROUND_COLOR : undefined;
    SelectDropdown.setCustomState(selectDropdown, selectProps)
    SelectDropdownItem.populateItems(etc, columnIndex);
    if (selectProps.dropdownStyle) SelectDropdown.setCustomStyle(selectDropdown, selectProps.dropdownStyle);
  }

  // REF-8 - Created for every column
  public static createAndAppend(containerElement: HTMLElement) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.maxHeight = SelectDropdown.MAX_HEIGHT_PX;
    dropdownElement.classList.add(SelectDropdown.SELECT_DROPDOWN_CLASS);
    containerElement.appendChild(dropdownElement);
    return dropdownElement;
  }

  public static getDefaultObj(dropdownElement: HTMLElement): SelectDropdownT {
    return {
      selectItem: {},
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
