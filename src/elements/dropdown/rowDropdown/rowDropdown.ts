import {AuxiliaryTableContentColors} from '../../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {FullTableOverlayElement} from '../../fullTableOverlay/fullTableOverlayElement';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {Browser} from '../../../utils/browser/browser';
import {RowDropdownEvents} from './rowDropdownEvents';
import {TableElement} from '../../table/tableElement';
import {CellElement} from '../../cell/cellElement';
import {RowDropdownItem} from './rowDropdownItem';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

export class RowDropdown {
  // prettier-ignore
  public static hide(etc: EditableTableComponent) {
    const {activeOverlayElements: {rowDropdown, fullTableOverlay}, focusedElements: {cell: {element, rowIndex}}} = etc;
    if (!rowDropdown || !fullTableOverlay || !element) return
    Dropdown.hide(rowDropdown, fullTableOverlay);
    const cellColors = AuxiliaryTableContentColors.getColorsBasedOnParam(rowIndex as number);
    if (etc.auxiliaryTableContentInternal.displayIndexColumn) CellHighlightUtils.fade(element, cellColors.default);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(etc.activeOverlayElements);
    setTimeout(() => {
      // in a timeout because upon pressing esc/enter key on dropdown, the window event is fired after which checks it
      delete etc.focusedElements.rowDropdown;
      FocusedCellUtils.purge(etc.focusedElements.cell);
    });
  }

  private static focusCell(etc: EditableTableComponent, rowIndex: number, cellElement: HTMLElement) {
    const {auxiliaryTableContentInternal, focusedElements, columnsDetails} = etc;
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

  private static getLeft(cellElement: HTMLElement, cellClick: boolean) {
    return `${ElementOffset.processWidth(cellClick ? cellElement.offsetWidth : 5)}px`;
  }

  // prettier-ignore
  private static displayAndSetPosition(cellElement: HTMLElement, dropdown: HTMLElement, cellClick: boolean,
      isHeaderSticky: boolean) {
    const initialTopValue: PX = `${ElementOffset.processTop(cellElement.offsetTop)}px`;
    dropdown.style.top = initialTopValue;
    dropdown.style.left = RowDropdown.getLeft(cellElement, cellClick);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdown);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdown);
    if (!visibilityDetails.isFullyVisible) {
      if (visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
        RowDropdown.correctPositionWhenBottomOverflow(dropdown, initialTopValue);
      } else if (visibilityDetails.blockingSides.has(SIDE.TOP) && cellElement.tagName === CellElement.HEADER_TAG
          && isHeaderSticky) {
        Dropdown.correctTopPositionForStickyHeader(cellElement, dropdown, false);
      }
    }
  }

  // prettier-ignore
  private static displayAndSetPositionOverflow(etc: EditableTableComponent, cellElement: HTMLElement,
      dropdown: HTMLElement, cellClick: boolean) {
    const {tableElementRef, overflowInternal, stickyProps} = etc;
    if (!tableElementRef || !overflowInternal?.overflowContainer) return;
    const isStickyCell = stickyProps.header && cellElement.tagName === CellElement.HEADER_TAG;
    dropdown.style.top = isStickyCell ?
      `${overflowInternal.overflowContainer.scrollTop}px` : `${ElementOffset.processTop(cellElement.offsetTop)}px`;
    dropdown.style.left = RowDropdown.getLeft(cellElement, cellClick);
    // needs to be displayed here to evalute if overflow
    Dropdown.display(dropdown);
    if (tableElementRef.offsetHeight !== overflowInternal.overflowContainer.scrollHeight && !isStickyCell) {
      dropdown.style.top = `${tableElementRef.offsetHeight - dropdown.offsetHeight}px`;
    }
  }

  public static display(this: EditableTableComponent, rowIndex: number, cellElement: HTMLElement) {
    const dropdownElement = this.activeOverlayElements.rowDropdown as HTMLElement;
    RowDropdownItem.update(this, dropdownElement, rowIndex);
    const cellClick = this.rowDropdownSettings.displaySettings.openMethod?.cellClick as boolean;
    if (this.overflowInternal?.overflowContainer) {
      RowDropdown.displayAndSetPositionOverflow(this, cellElement, dropdownElement, cellClick);
    } else {
      RowDropdown.displayAndSetPosition(cellElement, dropdownElement, cellClick, this.stickyProps.header);
    }
    FullTableOverlayElement.display(this);
    setTimeout(() => RowDropdown.focusCell(this, rowIndex, cellElement));
  }

  public static create(etc: EditableTableComponent) {
    const dropdownElement = Dropdown.createBase();
    RowDropdownEvents.set(etc, dropdownElement);
    RowDropdownItem.setUpItems(etc, dropdownElement);
    return dropdownElement;
  }
}
