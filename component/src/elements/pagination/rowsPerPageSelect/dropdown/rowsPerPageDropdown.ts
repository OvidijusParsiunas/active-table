import {ElementVisibility} from '../../../../utils/elements/elementVisibility';
import {TableBorderDimensions} from '../../../../types/tableBorderDimensions';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {RowsPerPageDropdownEvents} from './rowsPerPageDropdownEvents';
import {RowsPerPageDropdownItem} from './rowsPerPageDropdownItem';
import {ActiveTable} from '../../../../activeTable';
import {Dropdown} from '../../../dropdown/dropdown';
import {PX} from '../../../../types/dimensions';
import {SIDE} from '../../../../types/side';

export class RowsPerPageDropdown {
  public static hide(dropdownElement: HTMLElement, dropdownItems?: HTMLElement[]) {
    Dropdown.hide(dropdownElement);
    const items = dropdownItems || (Array.from(dropdownElement.children) as HTMLElement[]);
    RowsPerPageDropdownItem.unsetHoverColors(items);
  }

  private static getDropdownTopPosition(buttonElement: HTMLElement): PX {
    return `${buttonElement.offsetTop + buttonElement.offsetHeight}px`;
  }

  private static getLeftPropertyToCenterDropdown(buttonElement: HTMLElement, dropdownWidth: number) {
    const leftOffset = buttonElement.offsetLeft + buttonElement.offsetWidth / 2;
    return `${leftOffset - dropdownWidth / 2}px`;
  }

  // prettier-ignore
  private static displayAndSetDropdownPosition(buttonElement: HTMLElement, dropdownElement: HTMLElement,
      dropdownWidth: number, borderDimensions: TableBorderDimensions) {
    dropdownElement.style.bottom = '';
    dropdownElement.style.left = RowsPerPageDropdown.getLeftPropertyToCenterDropdown(buttonElement, dropdownWidth);
    dropdownElement.style.top = RowsPerPageDropdown.getDropdownTopPosition(buttonElement);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdownElement);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdownElement, borderDimensions, false);
    if (!visibilityDetails.isFullyVisible && visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
      dropdownElement.style.bottom = '0px';
      dropdownElement.style.top = '';
    }
  }

  // prettier-ignore
  public static display(buttonElement: HTMLElement, dropdown: HTMLElement, dropdownWidth: number,
      borderDimensions: TableBorderDimensions) {
    RowsPerPageDropdown.displayAndSetDropdownPosition(buttonElement, dropdown, dropdownWidth, borderDimensions);
  }

  private static setWidth(dropdownElement: HTMLElement, pagination: PaginationInternal) {
    const maxTextCharLength = pagination.rowsPerPageOptionsItemText.reduce((currrentMax, value) => {
      return isNaN(Number(value)) ? currrentMax : Math.max(currrentMax, value.length);
    }, 1);
    const textLength = maxTextCharLength * 8;
    pagination.dropdownWidth = pagination.dropdownWidth + textLength;
    dropdownElement.style.width = `${pagination.dropdownWidth}px`;
  }

  public static create(at: ActiveTable, optionsButton: HTMLElement) {
    const dropdownElement = Dropdown.createBase();
    RowsPerPageDropdown.setWidth(dropdownElement, at.paginationInternal);
    RowsPerPageDropdownItem.populate(at, dropdownElement, optionsButton);
    RowsPerPageDropdownEvents.set(at, dropdownElement);
    return dropdownElement;
  }
}
