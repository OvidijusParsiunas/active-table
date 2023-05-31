import {OuterDropdownElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {OuterDropdownItem} from '../../../../utils/outerTableComponents/dropdown/outerDropdownItem';
import {OuterContainerDropdownI} from '../../../../types/outerContainerInternal';
import {ActiveOverlayElements} from '../../../../types/activeOverlayElements';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {RowsPerPageDropdownItem} from './rowsPerPageDropdownItem';
import {ActiveTable} from '../../../../activeTable';
import {PX} from '../../../../types/dimensions';

export class RowsPerPageDropdown {
  public static hide(activeOverlayElements: ActiveOverlayElements, dropdownItems?: HTMLElement[]) {
    OuterDropdownElement.hide(activeOverlayElements, {});
    const dropdownElement = activeOverlayElements.outerContainerDropdown?.element;
    if (dropdownElement) {
      const items = dropdownItems || (Array.from(dropdownElement.children) as HTMLElement[]);
      OuterDropdownItem.unsetHoverColors(items);
    }
  }

  private static getDropdownTopPosition(buttonElement: HTMLElement): PX {
    return `${buttonElement.offsetTop + buttonElement.offsetHeight}px`;
  }

  private static getLeftPropertyToCenterDropdown(buttonElement: HTMLElement, dropdownWidth: number) {
    const leftOffset = buttonElement.offsetLeft + buttonElement.offsetWidth / 2;
    return `${leftOffset - dropdownWidth / 2}px`;
  }

  // prettier-ignore
  public static display(buttonElement: HTMLElement, at: ActiveTable, dropdown: OuterContainerDropdownI) {
    const {_pagination: {dropdownWidth}} = at;
    const {element: dropdownElement} = dropdown;
    dropdownElement.style.bottom = '';
    dropdownElement.style.left = RowsPerPageDropdown.getLeftPropertyToCenterDropdown(buttonElement, dropdownWidth);
    dropdownElement.style.top = RowsPerPageDropdown.getDropdownTopPosition(buttonElement);
    // needs to be displayed here to evalute if in view port
    OuterDropdownElement.displayReactToBottomVisibility(at, dropdown)
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
    const hideFunc = RowsPerPageDropdown.hide.bind(this, at._activeOverlayElements);
    const displayFunc = RowsPerPageDropdown.display.bind(this, optionsButton);
    // position is arbitrary as long as orientation isn't changed
    const dropdown = OuterDropdownElement.create(at, optionsButton, 'bottom-middle', {}, [], hideFunc, displayFunc);
    RowsPerPageDropdownItem.populate(at, dropdown.element, optionsButton);
    RowsPerPageDropdown.setWidth(dropdown.element, at._pagination);
    return dropdown;
  }
}
