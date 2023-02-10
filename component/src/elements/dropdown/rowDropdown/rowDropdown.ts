import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {FrameComponentsColors} from '../../../utils/frameComponents/frameComponentsColors';
import {FullTableOverlayElement} from '../../fullTableOverlay/fullTableOverlayElement';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {TableDimensions} from '../../../types/tableDimensions';
import {Browser} from '../../../utils/browser/browser';
import {RowDropdownEvents} from './rowDropdownEvents';
import {CellElement} from '../../cell/cellElement';
import {RowDropdownItem} from './rowDropdownItem';
import {ActiveTable} from '../../../activeTable';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

export class RowDropdown {
  // prettier-ignore
  public static hide(at: ActiveTable) {
    const {_activeOverlayElements: {rowDropdown, fullTableOverlay}, _focusedElements: {cell: {element, rowIndex}},
      _frameComponents: {cellColors, displayIndexColumn}} = at;
    if (!rowDropdown || !fullTableOverlay || !element) return
    Dropdown.hide(rowDropdown, fullTableOverlay);
    const colors = FrameComponentsColors.getColorsBasedOnParam(cellColors, rowIndex as number);
    if (displayIndexColumn) CellHighlightUtils.fade(element, colors.default);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(at._activeOverlayElements);
    setTimeout(() => {
      // in a timeout because upon pressing esc/enter key on dropdown, the window event is fired after which checks it
      delete at._focusedElements.rowDropdown;
      FocusedCellUtils.purge(at._focusedElements.cell);
    });
  }

  private static focusCell(at: ActiveTable, rowIndex: number, cellElement: HTMLElement) {
    const {_frameComponents, _focusedElements} = at;
    if (_frameComponents.displayIndexColumn) {
      FocusedCellUtils.setIndexCell(_focusedElements.cell, cellElement, rowIndex);
    } else {
      FocusedCellUtils.set(_focusedElements.cell, cellElement, rowIndex, 0);
    }
  }

  // prettier-ignore
  private static correctPositionWhenBottomOverflow(tableDimensions: TableDimensions, dropdown: HTMLElement,
      initialTopValue: PX) {
    const tableTopOffset = (dropdown.parentElement as HTMLElement).offsetTop + tableDimensions.border.topWidth;
    let newTopValue = window.pageYOffset + window.innerHeight - tableTopOffset - dropdown.offsetHeight;
    if (Browser.IS_FIREFOX) newTopValue += tableDimensions.border.topWidth;
    dropdown.style.top = `${newTopValue}px`;
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdown, tableDimensions.border);
    if (!visibilityDetails.isFullyVisible && visibilityDetails.blockingSides.has(SIDE.TOP)) {
      dropdown.style.top = initialTopValue;
    }
  }

  private static getLeft(at: ActiveTable, cellElement: HTMLElement) {
    const cellClick = at.rowDropdown.displaySettings.openMethod?.cellClick as boolean;
    return `${ElementOffset.processWidth(cellClick ? cellElement.offsetWidth : 5, at._tableDimensions.border)}px`;
  }

  private static displayAndSetPosition(at: ActiveTable, cellElement: HTMLElement, dropdown: HTMLElement) {
    const initialTopValue: PX = `${ElementOffset.processTop(cellElement.offsetTop, at._tableDimensions.border)}px`;
    dropdown.style.top = initialTopValue;
    dropdown.style.left = RowDropdown.getLeft(at, cellElement);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdown);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdown, at._tableDimensions.border);
    if (!visibilityDetails.isFullyVisible) {
      if (visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
        RowDropdown.correctPositionWhenBottomOverflow(at._tableDimensions, dropdown, initialTopValue);
      }
    }
  }

  // prettier-ignore
  private static setOverflowPosition(at: ActiveTable, cellElement: HTMLElement, dropdown: HTMLElement,
      overflowElement: HTMLElement) {
    if (at._stickyProps.header && cellElement.tagName === CellElement.HEADER_TAG) {
      if (at._overflow) {
        dropdown.style.top = `${overflowElement.scrollTop}px`;
      } else {
        const rowOffset = (cellElement.parentElement as HTMLElement).offsetTop;
        const borderTopWidth = Number.parseInt(getComputedStyle(cellElement).borderTopWidth);
        dropdown.style.top = `${rowOffset + borderTopWidth}px`; // REF-37
      }
    } else {
      dropdown.style.top = `${ElementOffset.processTop(cellElement.offsetTop, at._tableDimensions.border)}px`;
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
    const {_tableElementRef, _overflow, _stickyProps} = at;
    if (!_tableElementRef || !_overflow?.overflowContainer) return;
    RowDropdown.setOverflowPosition(at, cellElement, dropdown, _overflow.overflowContainer);
    // needs to be displayed here to evalute if overflow
    Dropdown.display(dropdown);
    const isStickyCell = _stickyProps.header && cellElement.tagName === CellElement.HEADER_TAG;
    if (_tableElementRef.offsetHeight !== _overflow.overflowContainer.scrollHeight && !isStickyCell) {
      dropdown.style.top = `${_tableElementRef.offsetHeight - dropdown.offsetHeight}px`;
    }
  }

  public static display(this: ActiveTable, rowIndex: number, cellElement: HTMLElement) {
    const dropdownElement = this._activeOverlayElements.rowDropdown as HTMLElement;
    RowDropdownItem.update(this, dropdownElement, rowIndex);
    if (this._overflow?.overflowContainer) {
      RowDropdown.displayAndSetPositionOverflow(this, cellElement, dropdownElement);
    } else if (this._stickyProps.header) {
      RowDropdown.displayAndSetPositionForSticky(this, cellElement, dropdownElement);
    } else {
      RowDropdown.displayAndSetPosition(this, cellElement, dropdownElement);
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
