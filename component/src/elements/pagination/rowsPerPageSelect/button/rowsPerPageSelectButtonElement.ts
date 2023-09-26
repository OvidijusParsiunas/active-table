import {OuterDropdownButtonUtils} from '../../../../utils/outerTableComponents/dropdown/outerDropdownButtonUtils';
import {GenericElementUtils} from '../../../../utils/elements/genericElementUtils';
import {StatefulCSSEvents} from '../../../../utils/elements/statefulCSSEvents';
import {RowsPerPageSelectButtonEvents} from './rowsPerPageSelectButtonEvents';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {RowsPerPageOptionsStyle} from '../../../../types/pagination';
import {StatefulCSS} from '../../../../types/cssStyle';
import {ActiveTable} from '../../../../activeTable';

export class RowsPerPageSelectButtonElement {
  private static readonly BUTTON_ID = 'rows-per-page-select-button';
  private static readonly TEXT_ID = 'rows-per-page-select-button-text';

  // prettier-ignore
  public static applyStylesOnElements(button: HTMLElement, cssState: keyof StatefulCSS,
      rowsPerPageSelect?: RowsPerPageOptionsStyle) {
    if (!rowsPerPageSelect) return;
    const {button: buttonStyle, buttonText: textStyle, buttonArrow: arrowStyle} = rowsPerPageSelect;
    if (buttonStyle) {
      StatefulCSSEvents.apply(buttonStyle, buttonStyle[cssState], button);
    }
    if (textStyle) {
      const buttonText = button.children[0] as HTMLElement;
      StatefulCSSEvents.apply(textStyle, textStyle[cssState], buttonText);
    }
    if (arrowStyle) {
      const buttonArrow = button.children[1] as HTMLElement;
      StatefulCSSEvents.apply(arrowStyle, arrowStyle[cssState], buttonArrow);
    }
  }

  private static createButtonArrow(pagination: PaginationInternal) {
    const arrow = OuterDropdownButtonUtils.createArrow();
    OuterDropdownButtonUtils.processAndApplyDefaultStyle(arrow, pagination.styles.rowsPerPageSelect?.buttonArrow);
    return arrow;
  }

  public static updateButtonText(optionsButton: HTMLElement, rowsPerPage: string) {
    const text = optionsButton.children[0] as HTMLElement;
    text.innerText = rowsPerPage;
  }

  private static createButtonText(pagination: PaginationInternal) {
    const {isAllRowsOptionSelected, rowsPerPageOptionsItemText, rowsPerPage, styles} = pagination;
    const text = document.createElement('div');
    text.id = RowsPerPageSelectButtonElement.TEXT_ID;
    text.classList.add(GenericElementUtils.NOT_SELECTABLE_CLASS);
    OuterDropdownButtonUtils.processAndApplyDefaultStyle(text, styles.rowsPerPageSelect?.buttonText);
    text.innerText = isAllRowsOptionSelected ? rowsPerPageOptionsItemText[0] : String(rowsPerPage);
    return text;
  }

  private static createOptionsButton(pagination: PaginationInternal) {
    const optionsButton = document.createElement('div');
    optionsButton.id = RowsPerPageSelectButtonElement.BUTTON_ID;
    OuterDropdownButtonUtils.processAndApplyDefaultStyle(optionsButton, pagination.styles.rowsPerPageSelect?.button);
    return optionsButton;
  }

  public static create(at: ActiveTable) {
    const optionsButton = RowsPerPageSelectButtonElement.createOptionsButton(at._pagination);
    optionsButton.appendChild(RowsPerPageSelectButtonElement.createButtonText(at._pagination));
    optionsButton.appendChild(RowsPerPageSelectButtonElement.createButtonArrow(at._pagination));
    setTimeout(() => RowsPerPageSelectButtonEvents.setEvents(at, optionsButton));
    return optionsButton;
  }
}
