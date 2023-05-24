import {OuterDropdownElement} from '../../../../utils/outerTableComponents/dropdown/outerDropdownElement';
import {OuterContainerDropdownI} from '../../../../types/outerContainerInternal';
import {RowsPerPageSelectButtonElement} from './rowsPerPageSelectButtonElement';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {RowsPerPageDropdown} from '../dropdown/rowsPerPageDropdown';
import {PaginationStyles} from '../../../../types/pagination';
import {StatefulCSS} from '../../../../types/cssStyle';
import {ActiveTable} from '../../../../activeTable';
import {Dropdown} from '../../../dropdown/dropdown';

export class RowsPerPageSelectButtonEvents {
  private static buttonClick(this: ActiveTable, dropdown: OuterContainerDropdownI, button: HTMLElement) {
    if (Dropdown.isDisplayed(dropdown.element)) {
      OuterDropdownElement.hide(this._activeOverlayElements);
    } else {
      RowsPerPageDropdown.display(this, button, dropdown);
    }
  }

  private static mouseDown(pagination: PaginationInternal, button: HTMLElement) {
    Object.assign(button.style, pagination.styles.rowsPerPageSelect?.button?.click);
    const buttonText = button.children[0] as HTMLElement;
    Object.assign(buttonText.style, pagination.styles.rowsPerPageSelect?.buttonText?.click);
    const buttonArrow = button.children[1] as HTMLElement;
    Object.assign(buttonArrow.style, pagination.styles.rowsPerPageSelect?.buttonArrow?.click);
    pagination.mouseDownOnRowsPerPageButton = true;
    setTimeout(() => (pagination.mouseDownOnRowsPerPageButton = false));
  }

  private static mouseLeave(paginationStyles: PaginationStyles<Required<StatefulCSS>>, button: HTMLElement) {
    RowsPerPageSelectButtonElement.applyStylesOnElements(button, 'default', paginationStyles.rowsPerPageSelect);
  }

  private static mouseEnter(paginationStyles: PaginationStyles<Required<StatefulCSS>>, button: HTMLElement) {
    RowsPerPageSelectButtonElement.applyStylesOnElements(button, 'hover', paginationStyles.rowsPerPageSelect);
  }

  public static setEvents(at: ActiveTable, button: HTMLElement, dropdown: OuterContainerDropdownI) {
    button.onmouseenter = RowsPerPageSelectButtonEvents.mouseEnter.bind(this, at._pagination.styles, button);
    button.onmouseleave = RowsPerPageSelectButtonEvents.mouseLeave.bind(this, at._pagination.styles, button);
    button.onmousedown = RowsPerPageSelectButtonEvents.mouseDown.bind(this, at._pagination, button);
    button.onmouseup = RowsPerPageSelectButtonEvents.mouseEnter.bind(this, at._pagination.styles, button);
    button.onclick = RowsPerPageSelectButtonEvents.buttonClick.bind(at, dropdown, button);
  }
}
