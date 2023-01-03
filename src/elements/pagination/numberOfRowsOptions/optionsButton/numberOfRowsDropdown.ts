import {ElementVisibility} from '../../../../utils/elements/elementVisibility';
import {EditableTableComponent} from '../../../../editable-table-component';
import {NumberOfRowsDropdownEvents} from './numberOfRowsDropdownEvents';
import {NumberOfRowsDropdownItem} from './numberOfRowsDropdownItem';
import {Dropdown} from '../../../dropdown/dropdown';
import {PX} from '../../../../types/dimensions';
import {SIDE} from '../../../../types/side';

export class NumberOfRowsDropdown {
  private static DROPDOWN_WIDTH = 24;

  public static hide(dropdownElement: HTMLElement, dropdownItems?: HTMLElement[]) {
    Dropdown.hide(dropdownElement);
    const items = dropdownItems || (Array.from(dropdownElement.children) as HTMLElement[]);
    NumberOfRowsDropdownItem.unsetAllItemStyles(dropdownElement, items);
  }

  private static getDropdownTopPosition(buttonElement: HTMLElement): PX {
    return `${buttonElement.offsetTop + buttonElement.offsetHeight}px`;
  }

  private static getLeftPropertyToCenterDropdown(buttonElement: HTMLElement) {
    const leftOffset = buttonElement.offsetLeft + buttonElement.offsetWidth / 2;
    return `${leftOffset - NumberOfRowsDropdown.DROPDOWN_WIDTH / 2}px`;
  }

  private static displayAndSetDropdownPosition(buttonElement: HTMLElement, dropdownElement: HTMLElement) {
    dropdownElement.style.bottom = '';
    dropdownElement.style.left = NumberOfRowsDropdown.getLeftPropertyToCenterDropdown(buttonElement);
    dropdownElement.style.top = NumberOfRowsDropdown.getDropdownTopPosition(buttonElement);
    // needs to be displayed here to evalute if in view port
    Dropdown.display(dropdownElement);
    const visibilityDetails = ElementVisibility.getDetailsInWindow(dropdownElement, false);
    if (!visibilityDetails.isFullyVisible && visibilityDetails.blockingSides.has(SIDE.BOTTOM)) {
      dropdownElement.style.bottom = '0px';
      dropdownElement.style.top = '';
    }
  }

  public static display(buttonElement: HTMLElement, dropdownElement: HTMLElement) {
    NumberOfRowsDropdown.displayAndSetDropdownPosition(buttonElement, dropdownElement);
  }

  private static setWidth(dropdownElement: HTMLElement, numberOfRowsOptionsItemText: string[]) {
    const maxTextCharLength = numberOfRowsOptionsItemText.reduce((currrentMax, value) => {
      return isNaN(Number(value)) ? currrentMax : Math.max(currrentMax, value.length);
    }, 1);
    const textLength = maxTextCharLength * 8;
    NumberOfRowsDropdown.DROPDOWN_WIDTH = NumberOfRowsDropdown.DROPDOWN_WIDTH + textLength;
    dropdownElement.style.width = `${NumberOfRowsDropdown.DROPDOWN_WIDTH}px`;
  }

  public static create(etc: EditableTableComponent, optionsButton: HTMLElement) {
    const dropdownElement = Dropdown.createBase();
    NumberOfRowsDropdown.setWidth(dropdownElement, etc.paginationInternal.numberOfRowsOptionsItemText);
    NumberOfRowsDropdownItem.populate(etc, dropdownElement, optionsButton);
    NumberOfRowsDropdownEvents.set(etc, dropdownElement);
    return dropdownElement;
  }
}
