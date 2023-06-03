import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {FullTableOverlayElement} from '../../fullTableOverlay/fullTableOverlayElement';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {TableBorderDimensions} from '../../../types/tableBorderDimensions';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {HeaderText} from '../../../utils/columnDetails/headerText';
import {DropdownItemNavigation} from '../dropdownItemNavigation';
import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';
import {ColumnDropdownEvents} from './columnDropdownEvents';
import {ColumnDropdownItem} from './columnDropdownItem';
import {Browser} from '../../../utils/browser/browser';
import {ActiveTable} from '../../../activeTable';
import {CellEvents} from '../../cell/cellEvents';
import {DropdownItem} from '../dropdownItem';
import {PX} from '../../../types/dimensions';
import {SIDE} from '../../../types/side';
import {Dropdown} from '../dropdown';

export class ColumnDropdown {
  private static resetDropdownPosition(dropdownElement: HTMLElement) {
    dropdownElement.style.left = '';
  }

  // prettier-ignore
  public static processTextAndHide(at: ActiveTable) {
    const {_activeOverlayElements, _columnsDetails, _focusedElements: {cell: {element: cellElement, columnIndex}}} = at;
    const {columnDropdown, columnTypeDropdown, fullTableOverlay} = _activeOverlayElements;
    if (!columnDropdown || !fullTableOverlay || !columnTypeDropdown || !cellElement) return;
    if (GenericElementUtils.doesElementExistInDom(cellElement)) {
      const wasSetToDefault = CellEvents.setCellToDefaultIfNeeded(at, 0, columnIndex as number, cellElement);
      if (wasSetToDefault) HeaderText.onChange(at, cellElement, columnIndex as number);
    }
    CellHighlightUtils.fade(cellElement, _columnsDetails[columnIndex as number]?.headerStateColors.default);
    Dropdown.hide(columnDropdown, fullTableOverlay, columnTypeDropdown);
    ColumnTypeDropdownItem.reset(columnTypeDropdown);
    ColumnDropdown.resetDropdownPosition(columnDropdown);
    ColumnDropdownItem.resetItems(columnDropdown);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(_activeOverlayElements);
  }

  public static create(at: ActiveTable) {
    const dropdownElement = Dropdown.createBase();
    ColumnDropdownEvents.set(at, dropdownElement);
    DropdownItem.addInputItem(at, dropdownElement);
    ColumnDropdownItem.addItems(at, dropdownElement);
    return dropdownElement;
  }

  // prettier-ignore
  private static getDefaultDropdownTopPosition(cellElement: HTMLElement, borderDimensions: TableBorderDimensions,
      openedViaOverlayClick?: boolean): PX {
    if (openedViaOverlayClick) {
      const offsetTop = 1;
      return `${Browser.IS_FIREFOX ? offsetTop + borderDimensions.topWidth : offsetTop}px`;
    }
    return `${ElementOffset.processTop(cellElement.offsetTop + cellElement.offsetHeight, borderDimensions)}px`;
  }

  public static getTopPosition(at: ActiveTable, cellElement: HTMLElement) {
    const isOverlayClick = at._defaultColumnsSettings.columnDropdown?.displaySettings?.openMethod?.overlayClick;
    if (at._overflow) {
      const overflowElement = at._overflow.overflowContainer;
      return `${isOverlayClick ? overflowElement.scrollTop + 1 : overflowElement.scrollTop + cellElement.offsetHeight}px`;
    } else if (at._stickyProps.header) {
      const rowOffset = (cellElement.parentElement as HTMLElement).offsetTop;
      const padding = isOverlayClick ? 1 : cellElement.offsetHeight;
      return `${padding + rowOffset}px`;
    }
    return ColumnDropdown.getDefaultDropdownTopPosition(cellElement, at._tableDimensions.border, isOverlayClick);
  }

  private static getLeftPropertyToCenterDropdown(cellElement: HTMLElement, borderDimensions: TableBorderDimensions) {
    const leftOffset = ElementOffset.processLeft(cellElement.offsetLeft + cellElement.offsetWidth / 2, borderDimensions);
    return `${leftOffset - Dropdown.DROPDOWN_WIDTH / 2}px`;
  }

  private static displayAndSetDropdownPosition(at: ActiveTable, cellElement: HTMLElement, dropdownElement: HTMLElement) {
    dropdownElement.style.left = ColumnDropdown.getLeftPropertyToCenterDropdown(cellElement, at._tableDimensions.border);
    dropdownElement.style.top = ColumnDropdown.getTopPosition(at, cellElement);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdownElement);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdownElement, at._tableDimensions.border);
    if (!visibilityDetails.isFullyVisible) {
      if (visibilityDetails.blockingSides.has(SIDE.LEFT)) {
        dropdownElement.style.left = '0px';
      } else if (visibilityDetails.blockingSides.has(SIDE.RIGHT)) {
        dropdownElement.style.left = `${cellElement.offsetLeft + cellElement.offsetWidth - Dropdown.DROPDOWN_WIDTH}px`;
      }
    }
  }

  // no active table based overflow - REF-37
  private static displayAndSetPositionForSticky(at: ActiveTable, cellElement: HTMLElement, dropdownElement: HTMLElement) {
    dropdownElement.style.left = ColumnDropdown.getLeftPropertyToCenterDropdown(cellElement, at._tableDimensions.border);
    dropdownElement.style.top = ColumnDropdown.getTopPosition(at, cellElement);
    Dropdown.display(dropdownElement);
  }

  // prettier-ignore
  private static displayAndSetPositionForOverflow(at: ActiveTable, cellElement: HTMLElement,
      dropdownElement: HTMLElement) {
    const {_tableElementRef, _overflow, _tableDimensions} = at;
    if (!_tableElementRef || !_overflow?.overflowContainer) return;
    const overflowElement = _overflow.overflowContainer;
    dropdownElement.style.left = ColumnDropdown.getLeftPropertyToCenterDropdown(cellElement, _tableDimensions.border);
    dropdownElement.style.top = ColumnDropdown.getTopPosition(at, cellElement);
    // needs to be displayed here to evalute if scrollwidth has appeared
    Dropdown.display(dropdownElement);
    if (_tableElementRef.offsetWidth !== overflowElement.scrollWidth) {
      dropdownElement.style.left = `${_tableElementRef.offsetWidth - dropdownElement.offsetWidth}px`;
    } else if (dropdownElement.offsetLeft < 0) {
      dropdownElement.style.left = '0px';
    }
  }

  public static display(at: ActiveTable, columnIndex: number) {
    const dropdownElement = at._activeOverlayElements.columnDropdown as HTMLElement;
    const cellElement = at._columnsDetails[columnIndex].elements[0];
    ColumnDropdownItem.setUp(at, dropdownElement, columnIndex, cellElement);
    if (at._overflow) {
      ColumnDropdown.displayAndSetPositionForOverflow(at, cellElement, dropdownElement);
    } else if (at._stickyProps.header) {
      ColumnDropdown.displayAndSetPositionForSticky(at, cellElement, dropdownElement);
    } else {
      ColumnDropdown.displayAndSetDropdownPosition(at, cellElement, dropdownElement);
    }
    const inputElement = DropdownItem.getInputElement(dropdownElement);
    if (inputElement) DropdownItemNavigation.focusInputElement(inputElement as HTMLElement);
    FullTableOverlayElement.display(at);
  }
}
