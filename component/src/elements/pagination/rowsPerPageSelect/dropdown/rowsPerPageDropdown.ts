import {ElementVisibility} from '../../../../utils/elements/elementVisibility';
import {TableBorderDimensions} from '../../../../types/tableBorderDimensions';
import {RowsPerPageDropdownEvents} from './rowsPerPageDropdownEvents';
import {RowsPerPageDropdownItem} from './rowsPerPageDropdownItem';
import {ActiveTable} from '../../../../activeTable';
import {Dropdown} from '../../../dropdown/dropdown';
import {PX} from '../../../../types/dimensions';
import {SIDE} from '../../../../types/side';

export class RowsPerPageDropdown {
  private static DROPDOWN_WIDTH = 24;

  public static hide(dropdownElement: HTMLElement, dropdownItems?: HTMLElement[]) {
    Dropdown.hide(dropdownElement);
    const items = dropdownItems || (Array.from(dropdownElement.children) as HTMLElement[]);
    RowsPerPageDropdownItem.unsetHoverColors(items);
  }

  private static getDropdownTopPosition(buttonElement: HTMLElement): PX {
    return `${buttonElement.offsetTop + buttonElement.offsetHeight}px`;
  }

  private static getLeftPropertyToCenterDropdown(buttonElement: HTMLElement) {
    const leftOffset = buttonElement.offsetLeft + buttonElement.offsetWidth / 2;
    return `${leftOffset - RowsPerPageDropdown.DROPDOWN_WIDTH / 2}px`;
  }

  // prettier-ignore
  private static displayAndSetDropdownPosition(buttonElement: HTMLElement, dropdownElement: HTMLElement,
      borderDimensions: TableBorderDimensions) {
    dropdownElement.style.bottom = '';
    dropdownElement.style.left = RowsPerPageDropdown.getLeftPropertyToCenterDropdown(buttonElement);
    dropdownElement.style.top = RowsPerPageDropdown.getDropdownTopPosition(buttonElement);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdownElement);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdownElement, borderDimensions, false);
    if (!visibilityDetails.isFullyVisible && visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
      dropdownElement.style.bottom = '0px';
      dropdownElement.style.top = '';
    }
  }

  public static display(buttonElement: HTMLElement, dropdown: HTMLElement, borderDimensions: TableBorderDimensions) {
    RowsPerPageDropdown.displayAndSetDropdownPosition(buttonElement, dropdown, borderDimensions);
  }

  private static setWidth(dropdownElement: HTMLElement, rowsPerPageOptionsItemText: string[]) {
    const maxTextCharLength = rowsPerPageOptionsItemText.reduce((currrentMax, value) => {
      return isNaN(Number(value)) ? currrentMax : Math.max(currrentMax, value.length);
    }, 1);
    const textLength = maxTextCharLength * 8;
    RowsPerPageDropdown.DROPDOWN_WIDTH = RowsPerPageDropdown.DROPDOWN_WIDTH + textLength;
    dropdownElement.style.width = `${RowsPerPageDropdown.DROPDOWN_WIDTH}px`;
  }

  public static create(at: ActiveTable, optionsButton: HTMLElement) {
    const dropdownElement = Dropdown.createBase();
    RowsPerPageDropdown.setWidth(dropdownElement, at.paginationInternal.rowsPerPageOptionsItemText);
    RowsPerPageDropdownItem.populate(at, dropdownElement, optionsButton);
    RowsPerPageDropdownEvents.set(at, dropdownElement);
    return dropdownElement;
  }
}
