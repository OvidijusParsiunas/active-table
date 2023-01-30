import {GenericElementUtils} from '../../../../utils/elements/genericElementUtils';
import {RowsPerPageSelectButtonEvents} from './rowsPerPageSelectButtonEvents';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {RowsPerPageOptionsStyle} from '../../../../types/pagination';
import {ElementStyle} from '../../../../utils/elements/elementStyle';
import {Browser} from '../../../../utils/browser/browser';
import {StatefulCSSS} from '../../../../types/cssStyle';
import {ActiveTable} from '../../../../activeTable';

export class RowsPerPageSelectButtonElement {
  private static readonly BUTTON_ID = 'rows-per-page-select-button';
  private static readonly ARROW_ID = 'rows-per-page-select-button-arrow';
  private static readonly TEXT_ID = 'rows-per-page-select-button-text';

  // prettier-ignore
  private static reapplyStyle(element: HTMLElement, rowsPerPageSelect: RowsPerPageOptionsStyle,
      elementName: keyof RowsPerPageOptionsStyle, cssState: keyof StatefulCSSS) {
    const statefulStyle = rowsPerPageSelect[elementName] as StatefulCSSS;
    ElementStyle.unsetAllCSSStates(element, statefulStyle);
    Object.assign(element.style, statefulStyle[cssState]);
  }

  // prettier-ignore
  public static reapplyStylesOnElements(button: HTMLElement, cssState: keyof StatefulCSSS,
      rowsPerPageSelect?: RowsPerPageOptionsStyle) {
    if (!rowsPerPageSelect) return;
    if (rowsPerPageSelect.button) {
      RowsPerPageSelectButtonElement.reapplyStyle(button, rowsPerPageSelect, 'button', cssState);
    }
    if (rowsPerPageSelect.buttonText) {
      const buttonText = button.children[0] as HTMLElement;
      RowsPerPageSelectButtonElement.reapplyStyle(buttonText, rowsPerPageSelect, 'buttonText', cssState);
    }
    if (rowsPerPageSelect.buttonArrow) {
      const buttonArrow = button.children[1] as HTMLElement;
      RowsPerPageSelectButtonElement.reapplyStyle(buttonArrow, rowsPerPageSelect, 'buttonArrow', cssState);
    }
  }

  private static createButtonArrow(pagination: PaginationInternal) {
    const arrow = document.createElement('div');
    arrow.id = RowsPerPageSelectButtonElement.ARROW_ID;
    arrow.classList.add(GenericElementUtils.NOT_SELECTABLE_CLASS);
    if (Browser.IS_FIREFOX) {
      arrow.style.transform = 'translateY(-8%) scaleX(1.4)';
      arrow.style.fontSize = '16px';
      arrow.style.marginLeft = '5px';
    } else {
      arrow.style.transform = 'translateY(-16%)';
      arrow.style.fontSize = '17px';
      arrow.style.marginLeft = '4px';
    }
    Object.assign(arrow.style, pagination.style.rowsPerPageSelect?.buttonText?.default);
    arrow.innerHTML = '&#8964';
    return arrow;
  }

  public static updateButtonText(optionsButton: HTMLElement, rowsPerPage: string) {
    const text = optionsButton.children[0] as HTMLElement;
    text.innerText = rowsPerPage;
  }

  private static createButtonText(pagination: PaginationInternal) {
    const {isAllRowsOptionSelected, rowsPerPageOptionsItemText, rowsPerPage, style} = pagination;
    const text = document.createElement('div');
    text.id = RowsPerPageSelectButtonElement.TEXT_ID;
    text.classList.add(GenericElementUtils.NOT_SELECTABLE_CLASS);
    Object.assign(text.style, style.rowsPerPageSelect?.buttonText?.default);
    text.innerText = isAllRowsOptionSelected ? rowsPerPageOptionsItemText[0] : String(rowsPerPage);
    return text;
  }

  private static createOptionsButton(pagination: PaginationInternal) {
    const optionsButton = document.createElement('div');
    optionsButton.id = RowsPerPageSelectButtonElement.BUTTON_ID;
    optionsButton.style.padding = Browser.IS_CHROMIUM ? '1px 5px' : '1px 6px';
    Object.assign(optionsButton.style, pagination.style.rowsPerPageSelect?.button?.default);
    return optionsButton;
  }

  public static create(at: ActiveTable) {
    const optionsButton = RowsPerPageSelectButtonElement.createOptionsButton(at.paginationInternal);
    optionsButton.appendChild(RowsPerPageSelectButtonElement.createButtonText(at.paginationInternal));
    optionsButton.appendChild(RowsPerPageSelectButtonElement.createButtonArrow(at.paginationInternal));
    RowsPerPageSelectButtonEvents.setEvents(at, optionsButton);
    return optionsButton;
  }
}
