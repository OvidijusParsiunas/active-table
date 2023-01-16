import {DropdownItemHighlightUtils} from '../../../utils/color/dropdownItemHighlightUtils';
import {FullTableOverlayElement} from '../../fullTableOverlay/fullTableOverlayElement';
import {ColumnSettingsUtils} from '../../../utils/columnSettings/columnSettingsUtils';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {DropdownDisplaySettings} from '../../../types/dropdownDisplaySettings';
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

  public static getDropdownTopPosition(cellElement: HTMLElement, openedViaOverlayClick?: boolean): PX {
    if (openedViaOverlayClick) {
      const offsetTop = 1;
      return `${Browser.IS_FIREFOX ? offsetTop + TableElement.BORDER_DIMENSIONS.topWidth : offsetTop}px`;
    }
    return `${ElementOffset.processTop(cellElement.offsetTop + cellElement.offsetHeight)}px`;
  }

  private static getLeftPropertyToCenterDropdown(cellElement: HTMLElement) {
    const leftOffset = ElementOffset.processLeft(cellElement.offsetLeft + cellElement.offsetWidth / 2);
    return `${leftOffset - Dropdown.DROPDOWN_WIDTH / 2}px`;
  }

  // prettier-ignore
  private static displayAndSetDropdownPosition(cellElement: HTMLElement, dropdownElement: HTMLElement,
      openMethod: DropdownDisplaySettings['openMethod'], isHeaderSticky: boolean) {
    dropdownElement.style.left = ColumnDropdown.getLeftPropertyToCenterDropdown(cellElement);
    dropdownElement.style.top = ColumnDropdown.getDropdownTopPosition(cellElement, openMethod?.overlayClick);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdownElement);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdownElement);
    if (!visibilityDetails.isFullyVisible) {
      if (visibilityDetails.blockingSides.has(SIDE.LEFT)) {
        dropdownElement.style.left = '0px';
      } else if (visibilityDetails.blockingSides.has(SIDE.RIGHT)) {
        dropdownElement.style.left = `${cellElement.offsetLeft + cellElement.offsetWidth - Dropdown.DROPDOWN_WIDTH}px`;
      } else if (visibilityDetails.blockingSides.has(SIDE.TOP) && isHeaderSticky) {
        Dropdown.correctTopPositionForStickyHeader(cellElement, dropdownElement, !!openMethod?.cellClick);
      }
    }
  }

  // prettier-ignore
  private static displayAndSetPositionForOverflow(at: ActiveTable, cellElement: HTMLElement,
      dropdownElement: HTMLElement) {
    const {tableElementRef, overflowInternal} = at;
    if (!tableElementRef || !overflowInternal?.overflowContainer) return;
    const overflowElement = overflowInternal.overflowContainer;
    dropdownElement.style.left = ColumnDropdown.getLeftPropertyToCenterDropdown(cellElement);
    dropdownElement.style.top = `${at.columnDropdownDisplaySettings.openMethod?.overlayClick
      ? overflowElement.scrollTop + 1 : overflowElement.scrollTop + cellElement.offsetHeight}px`;
    // needs to be displayed here to evalute if scrollwidth has appeared
    Dropdown.display(dropdownElement);
    if (tableElementRef.offsetWidth !== overflowElement.scrollWidth) {
      dropdownElement.style.left = `${tableElementRef.offsetWidth - dropdownElement.offsetWidth}px`;
    } else if (dropdownElement.offsetLeft < 0) {
      dropdownElement.style.left = '0px';
    }
  }

  // prettier-ignore
  public static display(at: ActiveTable, columnIndex: number) {
    const dropdownElement = at.activeOverlayElements.columnDropdown as HTMLElement;
    const cellElement = at.columnsDetails[columnIndex].elements[0];
    ColumnDropdownItem.setUp(at, dropdownElement, columnIndex, cellElement);
    if (at.overflowInternal) {
      ColumnDropdown.displayAndSetPositionForOverflow(at, cellElement, dropdownElement);
    } else {
      ColumnDropdown.displayAndSetDropdownPosition(cellElement, dropdownElement,
        at.columnDropdownDisplaySettings.openMethod, at.stickyProps.header); 
    }
    const inputElement = DropdownItem.getInputElement(dropdownElement);
    if (inputElement) DropdownItemNavigation.focusInputElement(inputElement as HTMLElement);
    FullTableOverlayElement.display(at);
  }
}
