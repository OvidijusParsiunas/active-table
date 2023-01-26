import {LabelCellTextElement} from '../../cell/cellsWithTextDiv/selectCell/label/labelCellTextElement';
import {SelectDropdownStyle, SelectDropdownT} from '../../../types/selectDropdown';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {TableBorderDimensions} from '../../../types/tableBorderDimensions';
import {LabelColorUtils} from '../../../utils/color/labelColorUtils';
import {SelectDropdownItemEvents} from './selectDropdownItemEvents';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {OverflowUtils} from '../../../utils/overflow/overflowUtils';
import {SelectDropdownScrollbar} from './selectDropdownScrollbar';
import {SelectDropdownI} from '../../../types/columnDetails';
import {SelectDropdownEvents} from './selectDropdownEvents';
import {SelectDropdownItem} from './selectDropdownItem';
import {CellText} from '../../../types/tableContent';
import {CellElement} from '../../cell/cellElement';
import {ActiveTable} from '../../../activeTable';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

export class SelectDropdown {
  private static readonly SELECT_DROPDOWN_CLASS = 'select-dropdown';
  private static readonly MAX_HEIGHT_PX = '150px';
  private static readonly MIN_WIDTH = 70;
  private static readonly MAX_WIDTH = 200;

  private static generateRightPosition() {
    return `4px`;
  }

  // prettier-ignore
  private static generateBottomPosition(cellElement: HTMLElement, textContainerElement: HTMLElement,
      borderDimensions: TableBorderDimensions) {
    const tableElement = cellElement.offsetParent as HTMLElement;
    const totalVerticalBorder = borderDimensions.bottomWidth + borderDimensions.topWidth;
    const cellTop = tableElement.offsetHeight - totalVerticalBorder - cellElement.offsetTop;
    const textContainerTop = cellTop - textContainerElement.offsetTop;
    return `${textContainerTop + 6}px`;
  }

  // prettier-ignore
  private static generateTopPosition(cellElement: HTMLElement, textContainerElement: HTMLElement,
      borderDimensions: TableBorderDimensions) {
    const topPadding = LabelCellTextElement.isLabelText(textContainerElement)
      ? textContainerElement.offsetTop + textContainerElement.offsetHeight + 2
      : cellElement.offsetHeight - 8;
    return `${ElementOffset.processTop(cellElement.offsetTop + topPadding, borderDimensions)}px`;
  }

  // prettier-ignore
  private static generateLeftPosition(cellElement: HTMLElement, textContainerElement: HTMLElement,
      borderDimensions: TableBorderDimensions): PX {
    const leftPadding = LabelCellTextElement.isLabelText(textContainerElement) ? textContainerElement.offsetLeft : 1;
    return `${ElementOffset.processLeft(cellElement.offsetLeft + leftPadding, borderDimensions)}px`;
  }

  // prettier-ignore
  private static correctPosition(dropdown: HTMLElement, cellElement: HTMLElement, textContainerElement: HTMLElement,
      borderDimensions: TableBorderDimensions) {
    const details = ElementVisibility.getDetailsInWindow(dropdown, borderDimensions);
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
        dropdown.style.bottom = SelectDropdown.generateBottomPosition(
          cellElement, textContainerElement, borderDimensions);
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

  private static setPosition(dropdown: HTMLElement, cellElement: HTMLElement, borderDimensions: TableBorderDimensions) {
    const textContainerElement = cellElement.children[0] as HTMLElement;
    dropdown.style.bottom = '';
    dropdown.style.right = '';
    dropdown.style.left = SelectDropdown.generateLeftPosition(cellElement, textContainerElement, borderDimensions);
    dropdown.style.top = SelectDropdown.generateTopPosition(cellElement, textContainerElement, borderDimensions);
    const tableElement = (dropdown.parentElement as HTMLElement).parentElement as HTMLElement;
    const overflowElement = tableElement.parentElement as HTMLElement;
    if (OverflowUtils.isOverflowElement(overflowElement)) {
      SelectDropdown.correctPositionForOverflow(dropdown, tableElement, overflowElement);
    } else {
      SelectDropdown.correctPosition(dropdown, cellElement, textContainerElement, borderDimensions);
    }
  }

  // prettier-ignore
  public static updateSelectDropdown(textContainerElement: HTMLElement, dropdown: SelectDropdownI,
      borderDimensions: TableBorderDimensions, defaultText: CellText, updateCellText: boolean,
      matchingCellElement?: HTMLElement) {
    const textElement = CellElement.getTextElement(textContainerElement);
    SelectDropdownItem.attemptHighlightMatchingItemWithCell(textElement,
      dropdown, defaultText, updateCellText, matchingCellElement)
    if (updateCellText) {
      SelectDropdown.setPosition(dropdown.element, textElement.parentElement as HTMLElement, borderDimensions);
    }
  }

  private static focusItemOnDropdownOpen(textElement: HTMLElement, dropdown: SelectDropdownI, defaultText: CellText) {
    // the updateCellText parameter is set to false for a case where the user clicks on a select cell which has
    // its text with a background color but one for a select that has been deleted, hence we do not want to
    // highlight it with a new background color
    SelectDropdownItem.attemptHighlightMatchingItemWithCell(textElement, dropdown, defaultText, false);
  }

  // prettier-ignore
  private static correctWidthForOverflow(dropdownElement: HTMLElement) {
    if (dropdownElement.clientWidth !== dropdownElement.scrollWidth) {
      const scrollbarPadding = dropdownElement.clientHeight !== dropdownElement.scrollHeight ? 16 : 0;
      const newWidth = dropdownElement.scrollWidth + scrollbarPadding;
      dropdownElement.style.width = `${Math.min(newWidth, SelectDropdown.MAX_WIDTH)}px`;
    }
    // the following is a bug fix where display 'grid' property on the dropdown can set the item lengths
    // a couple of decimal places higher than clientWidth, causing an overflow when there shouldn't be
    if (dropdownElement.children.length > 0
        && dropdownElement.scrollWidth < dropdownElement.children[0].getBoundingClientRect().width) {
      dropdownElement.style.width = `${dropdownElement.clientWidth + 1}px`;
    }
  }

  private static getWidth(cellElement: HTMLElement, dropdown: SelectDropdownI, dropdownStyle?: SelectDropdownStyle) {
    if (dropdownStyle?.width) return Number.parseInt(dropdownStyle.width);
    if (!dropdown.labelDetails) return Math.max(cellElement.offsetWidth - 2, SelectDropdown.MIN_WIDTH);
    const textContainerElement = cellElement.children[0] as HTMLElement;
    return Math.max(cellElement.offsetWidth - textContainerElement.offsetLeft * 2, SelectDropdown.MIN_WIDTH);
  }

  // prettier-ignore
  public static display(at: ActiveTable, columnIndex: number, cellElement: HTMLElement) {
    const {selectDropdown, settings: {defaultText}, activeType: {selectProps}} = at.columnsDetails[columnIndex];
    const {element: dropdownEl, itemsDetails} = selectDropdown;
    if (Object.keys(itemsDetails).length > 0 && selectProps) {
      SelectDropdownEvents.set(at, dropdownEl);
      SelectDropdownItemEvents.blurItem(selectDropdown, 'hovered');
      SelectDropdownItemEvents.blurItem(selectDropdown, 'matchingWithCellText');
      dropdownEl.style.width = `${SelectDropdown.getWidth(cellElement, selectDropdown, selectProps.dropdownStyle)}px`
      Dropdown.display(dropdownEl);
      dropdownEl.scrollLeft = 0;
      SelectDropdown.correctWidthForOverflow(dropdownEl);
      SelectDropdownScrollbar.setProperties(selectDropdown);
      SelectDropdown.setPosition(dropdownEl, cellElement, at.tableDimensions.border);
      const textElement = cellElement.children[0] as HTMLElement;
      SelectDropdown.focusItemOnDropdownOpen(textElement, selectDropdown, defaultText);
      return true;
    }
    return false;
  }

  private static setCustomStyle(selectDropdown: SelectDropdownI, dropdownStyle: SelectDropdownStyle) {
    const {paddingTop, paddingBottom, marginTop, marginLeft, border, textAlign} = dropdownStyle;
    selectDropdown.element.style.paddingTop = paddingTop || Dropdown.DROPDOWN_VERTICAL_PX;
    selectDropdown.element.style.paddingBottom = paddingBottom || Dropdown.DROPDOWN_VERTICAL_PX;
    selectDropdown.element.style.marginTop = marginTop || '0px';
    selectDropdown.element.style.marginLeft = marginLeft || '0px';
    selectDropdown.element.style.border = border || 'none';
    selectDropdown.element.style.textAlign = textAlign || 'left';
  }

  private static setCustomState(selectDropdown: SelectDropdownI, select: SelectDropdownT) {
    selectDropdown.customDropdownStyle = select.dropdownStyle;
    selectDropdown.customItemStyle = select.optionStyle;
    selectDropdown.canAddMoreOptions = !!select.canAddMoreOptions;
  }

  // prettier-ignore
  public static setUpDropdown(at: ActiveTable, columnIndex: number) {
    const {activeType: {selectProps}, selectDropdown} = at.columnsDetails[columnIndex];
    if (!selectProps) return;
    selectDropdown.labelDetails = selectProps.isBasicSelect ?
      undefined : {newItemColors: LabelColorUtils.generateDefaultColors()}; // REF-34
    SelectDropdown.setCustomState(selectDropdown, selectProps)
    SelectDropdownItem.populateItems(at, columnIndex);
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

  public static getDefaultObj(dropdownElement: HTMLElement): SelectDropdownI {
    return {
      itemsDetails: {},
      activeItems: {},
      element: dropdownElement,
      canAddMoreOptions: true,
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
