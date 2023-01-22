import {AuxiliaryTableContentColors} from '../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {FullTableOverlayElement} from '../../fullTableOverlay/fullTableOverlayElement';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {Browser} from '../../../utils/browser/browser';
import {RowDropdownEvents} from './rowDropdownEvents';
import {TableElement} from '../../table/tableElement';
import {CellElement} from '../../cell/cellElement';
import {RowDropdownItem} from './rowDropdownItem';
import {ActiveTable} from '../../../activeTable';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

export class RowDropdown {
  // prettier-ignore
  public static hide(at: ActiveTable) {
    const {activeOverlayElements: {rowDropdown, fullTableOverlay}, focusedElements: {cell: {element, rowIndex}}} = at;
    if (!rowDropdown || !fullTableOverlay || !element) return
    Dropdown.hide(rowDropdown, fullTableOverlay);
    const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex as number);
    if (at.auxiliaryTableContentInternal.displayIndexColumn) CellHighlightUtils.fade(element, cellColors.default);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(at.activeOverlayElements);
    setTimeout(() => {
      // in a timeout because upon pressing esc/enter key on dropdown, the window event is fired after which checks it
      delete at.focusedElements.rowDropdown;
      FocusedCellUtils.purge(at.focusedElements.cell);
    });
  }

  private static focusCell(at: ActiveTable, rowIndex: number, cellElement: HTMLElement) {
    const {auxiliaryTableContentInternal, focusedElements, columnsDetails} = at;
    if (auxiliaryTableContentInternal.displayIndexColumn) {
      FocusedCellUtils.setIndexCell(focusedElements.cell, cellElement, rowIndex);
    } else {
      FocusedCellUtils.set(focusedElements.cell, cellElement, rowIndex, 0, columnsDetails[0].types);
    }
  }

  private static correctPositionWhenBottomOverflow(dropdown: HTMLElement, initialTopValue: PX) {
    const tableTopOffset = (dropdown.parentElement as HTMLElement).offsetTop + TableElement.BORDER_DIMENSIONS.topWidth;
    let newTopValue = window.pageYOffset + window.innerHeight - tableTopOffset - dropdown.offsetHeight;
    if (Browser.IS_FIREFOX) newTopValue += TableElement.BORDER_DIMENSIONS.topWidth;
    dropdown.style.top = `${newTopValue}px`;
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdown);
    if (!visibilityDetails.isFullyVisible && visibilityDetails.blockingSides.has(SIDE.TOP)) {
      dropdown.style.top = initialTopValue;
    }
  }

  private static getLeft(at: ActiveTable, cellElement: HTMLElement) {
    const cellClick = at.rowDropdownSettings.displaySettings.openMethod?.cellClick as boolean;
    return `${ElementOffset.processWidth(cellClick ? cellElement.offsetWidth : 5)}px`;
  }

  // prettier-ignore
  private static displayAndSetPosition(at: ActiveTable, cellElement: HTMLElement, dropdown: HTMLElement,
      stickyHeader: boolean) {
    const initialTopValue: PX = `${ElementOffset.processTop(cellElement.offsetTop)}px`;
    dropdown.style.top = initialTopValue;
    dropdown.style.left = RowDropdown.getLeft(at, cellElement);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdown);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdown);
    if (!visibilityDetails.isFullyVisible) {
      if (visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
        RowDropdown.correctPositionWhenBottomOverflow(dropdown, initialTopValue);
      } else if (visibilityDetails.blockingSides.has(SIDE.TOP) && cellElement.tagName === CellElement.HEADER_TAG
          && stickyHeader) {
        Dropdown.correctTopPositionForStickyHeader(cellElement, dropdown, false);
      }
    }
  }

  // prettier-ignore
  private static setOverflowPosition(at: ActiveTable, cellElement: HTMLElement, dropdown: HTMLElement,
      overflowElement: HTMLElement) {
    if (at.stickyProps.header && cellElement.tagName === CellElement.HEADER_TAG) {
      if (at.overflowInternal) {
        dropdown.style.top = `${overflowElement.scrollTop}px`;
      } else {
        const rowOffset = (cellElement.parentElement as HTMLElement).offsetTop;
        const borderTopWidth = Number.parseInt(getComputedStyle(cellElement).borderTopWidth);
        dropdown.style.top = `${rowOffset + borderTopWidth}px`; // REF-37
      }
    } else {
      dropdown.style.top = `${ElementOffset.processTop(cellElement.offsetTop)}px`;
    }
    dropdown.style.left = RowDropdown.getLeft(at, cellElement);
  }

  // no active table based overflow
  private static displayAndSetPositionForSticky(at: ActiveTable, cellElement: HTMLElement, dropdown: HTMLElement) {
    const overflowElement = at.parentElement as HTMLElement;
    RowDropdown.setOverflowPosition(at, cellElement, dropdown, overflowElement);
    Dropdown.display(dropdown);
  }

  private static displayAndSetPositionOverflow(at: ActiveTable, cellElement: HTMLElement, dropdown: HTMLElement) {
    const {tableElementRef, overflowInternal, stickyProps} = at;
    if (!tableElementRef || !overflowInternal?.overflowContainer) return;
    RowDropdown.setOverflowPosition(at, cellElement, dropdown, overflowInternal.overflowContainer);
    // needs to be displayed here to evalute if overflow
    Dropdown.display(dropdown);
    const isStickyCell = stickyProps.header && cellElement.tagName === CellElement.HEADER_TAG;
    if (tableElementRef.offsetHeight !== overflowInternal.overflowContainer.scrollHeight && !isStickyCell) {
      dropdown.style.top = `${tableElementRef.offsetHeight - dropdown.offsetHeight}px`;
    }
  }

  public static display(this: ActiveTable, rowIndex: number, cellElement: HTMLElement) {
    const dropdownElement = this.activeOverlayElements.rowDropdown as HTMLElement;
    RowDropdownItem.update(this, dropdownElement, rowIndex);
    if (this.overflowInternal?.overflowContainer) {
      RowDropdown.displayAndSetPositionOverflow(this, cellElement, dropdownElement);
    } else if (this.stickyHeader) {
      RowDropdown.displayAndSetPositionForSticky(this, cellElement, dropdownElement);
    } else {
      RowDropdown.displayAndSetPosition(this, cellElement, dropdownElement, this.stickyProps.header);
    }
    FullTableOverlayElement.display(this);
    setTimeout(() => RowDropdown.focusCell(this, rowIndex, cellElement));
  }

  public static create(at: ActiveTable) {
    const dropdownElement = Dropdown.createBase();
    RowDropdownEvents.set(at, dropdownElement);
    RowDropdownItem.setUpItems(at, dropdownElement);
    return dropdownElement;
  }
}
