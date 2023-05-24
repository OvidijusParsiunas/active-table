import {RowsPerPageSelectButtonElement} from './rowsPerPageSelectButtonElement';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {PaginationStyles} from '../../../../types/pagination';
import {StatefulCSS} from '../../../../types/cssStyle';
import {ActiveTable} from '../../../../activeTable';

export class RowsPerPageSelectButtonEvents {
  private static mouseDown(pagination: PaginationInternal, button: HTMLElement) {
    Object.assign(button.style, pagination.styles.rowsPerPageSelect?.button?.click);
    const buttonText = button.children[0] as HTMLElement;
    Object.assign(buttonText.style, pagination.styles.rowsPerPageSelect?.buttonText?.click);
    const buttonArrow = button.children[1] as HTMLElement;
    Object.assign(buttonArrow.style, pagination.styles.rowsPerPageSelect?.buttonArrow?.click);
  }

  private static mouseLeave(paginationStyles: PaginationStyles<Required<StatefulCSS>>, button: HTMLElement) {
    RowsPerPageSelectButtonElement.applyStylesOnElements(button, 'default', paginationStyles.rowsPerPageSelect);
  }

  private static mouseEnter(paginationStyles: PaginationStyles<Required<StatefulCSS>>, button: HTMLElement) {
    RowsPerPageSelectButtonElement.applyStylesOnElements(button, 'hover', paginationStyles.rowsPerPageSelect);
  }

  public static setEvents(at: ActiveTable, button: HTMLElement) {
    button.onmouseenter = RowsPerPageSelectButtonEvents.mouseEnter.bind(this, at._pagination.styles, button);
    button.onmouseleave = RowsPerPageSelectButtonEvents.mouseLeave.bind(this, at._pagination.styles, button);
    button.onmousedown = RowsPerPageSelectButtonEvents.mouseDown.bind(this, at._pagination, button);
    button.onmouseup = RowsPerPageSelectButtonEvents.mouseEnter.bind(this, at._pagination.styles, button);
  }
}
