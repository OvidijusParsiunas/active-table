import {OuterDropdownSimpleUtils} from '../../../../utils/outerTableComponents/dropdown/outerDropdownSimpleUtils';
import {OuterDropdownElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {OuterContainerDropdownI} from '../../../../types/outerContainerInternal';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {RowsPerPageDropdownItem} from './rowsPerPageDropdownItem';
import {ActiveTable} from '../../../../activeTable';

export class RowsPerPageDropdown {
  private static getLeftPropertyToCenterDropdown(buttonElement: HTMLElement, dropdownWidth: number) {
    const leftOffset = buttonElement.offsetLeft + buttonElement.offsetWidth / 2;
    return `${leftOffset - dropdownWidth / 2}px`;
  }

  private static display(buttonElement: HTMLElement, at: ActiveTable, dropdown: OuterContainerDropdownI) {
    const {dropdownWidth} = at._pagination;
    const {element: dropdownElement} = dropdown;
    dropdownElement.style.left = RowsPerPageDropdown.getLeftPropertyToCenterDropdown(buttonElement, dropdownWidth);
    OuterDropdownSimpleUtils.display(buttonElement, at, dropdown);
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
    const hideFunc = OuterDropdownSimpleUtils.hide.bind(this, at._activeOverlayElements);
    const displayFunc = RowsPerPageDropdown.display.bind(this, optionsButton);
    // position is arbitrary as long as orientation isn't changed
    const dropdown = OuterDropdownElement.create(at, optionsButton, 'bottom-center', {}, [], hideFunc, displayFunc);
    RowsPerPageDropdownItem.populate(at, dropdown.element, optionsButton);
    RowsPerPageDropdown.setWidth(dropdown.element, at._pagination);
    return dropdown;
  }
}
