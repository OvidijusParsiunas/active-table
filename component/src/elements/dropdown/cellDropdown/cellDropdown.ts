import {LabelCellTextElement} from '../../cell/cellsWithTextDiv/selectCell/label/labelCellTextElement';
import {CellDropdownStyle, CellDropdownT} from '../../../types/cellDropdown';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {TableBorderDimensions} from '../../../types/tableBorderDimensions';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {OverflowUtils} from '../../../utils/overflow/overflowUtils';
import {_CellDropdown} from '../../../types/cellDropdownInternal';
import {CellDropdownItemEvents} from './cellDropdownItemEvents';
import {CellDropdownScrollbar} from './cellDropdownScrollbar';
import {CellDropdownEvents} from './cellDropdownEvents';
import {CellText} from '../../../types/tableContent';
import {CellDropdownItem} from './cellDropdownItem';
import {CellElement} from '../../cell/cellElement';
import {ActiveTable} from '../../../activeTable';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

export class CellDropdown {
  private static readonly CELL_DROPDOWN_CLASS = 'cell-dropdown';
  private static readonly MAX_HEIGHT_PX = '145px';
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
        dropdown.style.right = CellDropdown.generateRightPosition();
      }
      if (details.blockingSides.has(SIDE.BOTTOM)) {
        dropdown.style.top = '';
        // the reason why bottom property is used instead of top is because the removal of a select/label item
        // reduces the dropdown height and the bottom property keeps the dropdown position close to cell
        dropdown.style.bottom = CellDropdown.generateBottomPosition(
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
    dropdown.style.left = CellDropdown.generateLeftPosition(cellElement, textContainerElement, borderDimensions);
    dropdown.style.top = CellDropdown.generateTopPosition(cellElement, textContainerElement, borderDimensions);
    const tableElement = (dropdown.parentElement as HTMLElement).parentElement as HTMLElement;
    const overflowElement = tableElement.parentElement as HTMLElement;
    if (OverflowUtils.isOverflowElement(overflowElement)) {
      CellDropdown.correctPositionForOverflow(dropdown, tableElement, overflowElement);
    } else {
      CellDropdown.correctPosition(dropdown, cellElement, textContainerElement, borderDimensions);
    }
  }

  // prettier-ignore
  public static updateCellDropdown(textContainerElement: HTMLElement, dropdown: _CellDropdown,
      borderDimensions: TableBorderDimensions, defaultText: CellText, updateCellText: boolean,
      matchingCellElement?: HTMLElement) {
    const textElement = CellElement.getTextElement(textContainerElement);
    CellDropdownItem.attemptHighlightMatchingItemWithCell(textElement,
      dropdown, defaultText, updateCellText, matchingCellElement)
    if (updateCellText) {
      CellDropdown.setPosition(dropdown.element, textElement.parentElement as HTMLElement, borderDimensions);
    }
  }

  private static focusItemOnDropdownOpen(textElement: HTMLElement, dropdown: _CellDropdown, defaultText: CellText) {
    // the updateCellText parameter is set to false for a case where the user clicks on a select/label cell which has
    // its text with a background color but one for a select/label that has been deleted, hence we do not want to
    // highlight it with a new background color
    CellDropdownItem.attemptHighlightMatchingItemWithCell(textElement, dropdown, defaultText, false);
  }

  // prettier-ignore
  private static correctWidthForOverflow(dropdownElement: HTMLElement) {
    if (dropdownElement.clientWidth !== dropdownElement.scrollWidth) {
      const scrollbarPadding = dropdownElement.clientHeight !== dropdownElement.scrollHeight ? 16 : 0;
      const newWidth = dropdownElement.scrollWidth + scrollbarPadding;
      dropdownElement.style.width = `${Math.min(newWidth, CellDropdown.MAX_WIDTH)}px`;
    }
    // the following is a bug fix where display 'grid' property on the dropdown can set the item lengths
    // a couple of decimal places higher than clientWidth, causing an overflow when there shouldn't be
    if (dropdownElement.children.length > 0
        && dropdownElement.scrollWidth < dropdownElement.children[0].getBoundingClientRect().width) {
      dropdownElement.style.width = `${dropdownElement.clientWidth + 1}px`;
    }
  }

  private static getWidth(cellElement: HTMLElement, dropdown: _CellDropdown, dropdownStyle?: CellDropdownStyle) {
    if (dropdownStyle?.width) return Number.parseInt(dropdownStyle.width);
    if (!dropdown.labelDetails) return Math.max(cellElement.offsetWidth - 2, CellDropdown.MIN_WIDTH);
    const textContainerElement = cellElement.children[0] as HTMLElement;
    return Math.max(cellElement.offsetWidth - textContainerElement.offsetLeft * 2, CellDropdown.MIN_WIDTH);
  }

  // prettier-ignore
  public static display(at: ActiveTable, columnIndex: number, cellElement: HTMLElement) {
    const {cellDropdown, settings: {defaultText}, activeType: {cellDropdownProps}} = at._columnsDetails[columnIndex];
    const {element: dropdownEl, itemsDetails} = cellDropdown;
    if (Object.keys(itemsDetails).length > 0 && cellDropdownProps) {
      CellDropdownEvents.set(at, dropdownEl);
      CellDropdownItemEvents.blurItem(cellDropdown, 'hovered');
      CellDropdownItemEvents.blurItem(cellDropdown, 'matchingWithCellText');
      dropdownEl.style.width = `${CellDropdown.getWidth(cellElement, cellDropdown, cellDropdownProps.dropdownStyle)}px`
      Dropdown.display(dropdownEl);
      dropdownEl.scrollLeft = 0;
      CellDropdown.correctWidthForOverflow(dropdownEl);
      CellDropdownScrollbar.setProperties(cellDropdown);
      CellDropdown.setPosition(dropdownEl, cellElement, at._tableDimensions.border);
      const textElement = cellElement.children[0] as HTMLElement;
      CellDropdown.focusItemOnDropdownOpen(textElement, cellDropdown, defaultText);
      return true;
    }
    return false;
  }

  private static setCustomStyle(cellDropdown: _CellDropdown, dropdownStyle: CellDropdownStyle) {
    const {paddingTop, paddingBottom, marginTop, marginLeft, border, textAlign} = dropdownStyle;
    cellDropdown.element.style.paddingTop = paddingTop || Dropdown.DROPDOWN_VERTICAL_PX;
    cellDropdown.element.style.paddingBottom = paddingBottom || Dropdown.DROPDOWN_VERTICAL_PX;
    cellDropdown.element.style.marginTop = marginTop || '0px';
    cellDropdown.element.style.marginLeft = marginLeft || '0px';
    cellDropdown.element.style.border = border || 'none';
    cellDropdown.element.style.textAlign = textAlign || 'left';
  }

  private static setCustomState(cellDropdown: _CellDropdown, cellDropdownType: CellDropdownT) {
    cellDropdown.customDropdownStyle = cellDropdownType.dropdownStyle;
    cellDropdown.customItemStyle = cellDropdownType.optionStyle;
    cellDropdown.canAddMoreOptions = !!cellDropdownType.canAddMoreOptions;
  }

  // prettier-ignore
  public static setUpDropdown(at: ActiveTable, columnIndex: number) {
    const {_columnsDetails, _globalItemColors} = at;
    const {activeType: {cellDropdownProps}, cellDropdown} = _columnsDetails[columnIndex];
    if (!cellDropdownProps) return;
     // REF-34
    cellDropdown.labelDetails = cellDropdownProps.isBasicSelect ? undefined : {globalItemColors: _globalItemColors};
    CellDropdown.setCustomState(cellDropdown, cellDropdownProps)
    CellDropdownItem.populateItems(at, columnIndex);
    if (cellDropdownProps.dropdownStyle) CellDropdown.setCustomStyle(cellDropdown, cellDropdownProps.dropdownStyle);
  }

  // REF-8 - Created for every column
  public static createAndAppend(containerElement: HTMLElement) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.maxHeight = CellDropdown.MAX_HEIGHT_PX;
    dropdownElement.classList.add(CellDropdown.CELL_DROPDOWN_CLASS);
    containerElement.appendChild(dropdownElement);
    return dropdownElement;
  }

  public static getDefaultObj(dropdownElement: HTMLElement): _CellDropdown {
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
