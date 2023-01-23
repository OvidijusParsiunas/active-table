import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {FullTableOverlayElement} from '../../fullTableOverlay/fullTableOverlayElement';
import {ColumnSettingsUtils} from '../../../utils/columnSettings/columnSettingsUtils';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {CellHighlightUtils} from '../../../utils/color/cellHighlightUtils';
import {ElementOffset} from '../../../utils/elements/elementOffset';
import {DropdownItemNavigation} from '../dropdownItemNavigation';
import {ColumnTypeDropdownItem} from './columnTypeDropdownItem';
import {ColumnDropdownEvents} from './columnDropdownEvents';
import {ColumnDropdownItem} from './columnDropdownItem';
import {Browser} from '../../../utils/browser/browser';
import {TableElement} from '../../table/tableElement';
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
    const {activeOverlayElements, columnsDetails, focusedElements: {cell: {element: cellElement, columnIndex}}} = at;
    const {columnDropdown, columnTypeDropdown, fullTableOverlay} = activeOverlayElements;
    if (!columnDropdown || !fullTableOverlay || !columnTypeDropdown || !cellElement) return;
    if (GenericElementUtils.doesElementExistInDom(cellElement)) {
      CellEvents.setCellToDefaultIfNeeded(at, 0, columnIndex as number, cellElement);
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(at, cellElement, columnIndex as number);
    }
    CellHighlightUtils.fade(cellElement, columnsDetails[columnIndex as number]?.headerStateColors.default);
    Dropdown.hide(columnDropdown, fullTableOverlay, columnTypeDropdown);
    ColumnTypeDropdownItem.reset(columnTypeDropdown);
    ColumnDropdown.resetDropdownPosition(columnDropdown);
    ColumnDropdownItem.resetItems(columnDropdown);
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(activeOverlayElements);
  }

  public static create(at: ActiveTable) {
    const dropdownElement = Dropdown.createBase();
    ColumnDropdownEvents.set(at, dropdownElement);
    DropdownItem.addInputItem(at, dropdownElement);
    ColumnDropdownItem.addItems(at, dropdownElement);
    return dropdownElement;
  }

  private static getDefaultDropdownTopPosition(cellElement: HTMLElement, openedViaOverlayClick?: boolean): PX {
    if (openedViaOverlayClick) {
      const offsetTop = 1;
      return `${Browser.IS_FIREFOX ? offsetTop + TableElement.BORDER_DIMENSIONS.topWidth : offsetTop}px`;
    }
    return `${ElementOffset.processTop(cellElement.offsetTop + cellElement.offsetHeight)}px`;
  }

  public static getTopPosition(at: ActiveTable, cellElement: HTMLElement) {
    const isOverlayClick = at.columnsSettings.dropdown?.displaySettings.openMethod?.overlayClick;
    if (at.overflowInternal) {
      const overflowElement = at.overflowInternal.overflowContainer;
      return `${isOverlayClick ? overflowElement.scrollTop + 1 : overflowElement.scrollTop + cellElement.offsetHeight}px`;
    } else if (at.stickyProps.header) {
      const rowOffset = (cellElement.parentElement as HTMLElement).offsetTop;
      const padding = isOverlayClick ? 1 : cellElement.offsetHeight;
      return `${padding + rowOffset}px`;
    }
    return ColumnDropdown.getDefaultDropdownTopPosition(cellElement, isOverlayClick);
  }

  private static getLeftPropertyToCenterDropdown(cellElement: HTMLElement) {
    const leftOffset = ElementOffset.processLeft(cellElement.offsetLeft + cellElement.offsetWidth / 2);
    return `${leftOffset - Dropdown.DROPDOWN_WIDTH / 2}px`;
  }

  private static displayAndSetDropdownPosition(at: ActiveTable, cellElement: HTMLElement, dropdownElement: HTMLElement) {
    dropdownElement.style.left = ColumnDropdown.getLeftPropertyToCenterDropdown(cellElement);
    dropdownElement.style.top = ColumnDropdown.getTopPosition(at, cellElement);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdownElement);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdownElement);
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
    dropdownElement.style.left = ColumnDropdown.getLeftPropertyToCenterDropdown(cellElement);
    dropdownElement.style.top = ColumnDropdown.getTopPosition(at, cellElement);
    Dropdown.display(dropdownElement);
  }

  // prettier-ignore
  private static displayAndSetPositionForOverflow(at: ActiveTable, cellElement: HTMLElement,
      dropdownElement: HTMLElement) {
    const {tableElementRef, overflowInternal} = at;
    if (!tableElementRef || !overflowInternal?.overflowContainer) return;
    const overflowElement = overflowInternal.overflowContainer;
    dropdownElement.style.left = ColumnDropdown.getLeftPropertyToCenterDropdown(cellElement);
    dropdownElement.style.top = ColumnDropdown.getTopPosition(at, cellElement);
    // needs to be displayed here to evalute if scrollwidth has appeared
    Dropdown.display(dropdownElement);
    if (tableElementRef.offsetWidth !== overflowElement.scrollWidth) {
      dropdownElement.style.left = `${tableElementRef.offsetWidth - dropdownElement.offsetWidth}px`;
    } else if (dropdownElement.offsetLeft < 0) {
      dropdownElement.style.left = '0px';
    }
  }

  public static display(at: ActiveTable, columnIndex: number) {
    const dropdownElement = at.activeOverlayElements.columnDropdown as HTMLElement;
    const cellElement = at.columnsDetails[columnIndex].elements[0];
    ColumnDropdownItem.setUp(at, dropdownElement, columnIndex, cellElement);
    if (at.overflowInternal) {
      ColumnDropdown.displayAndSetPositionForOverflow(at, cellElement, dropdownElement);
    } else if (at.stickyProps.header) {
      ColumnDropdown.displayAndSetPositionForSticky(at, cellElement, dropdownElement);
    } else {
      ColumnDropdown.displayAndSetDropdownPosition(at, cellElement, dropdownElement);
    }
    const inputElement = DropdownItem.getInputElement(dropdownElement);
    if (inputElement) DropdownItemNavigation.focusInputElement(inputElement as HTMLElement);
    FullTableOverlayElement.display(at);
  }
}
