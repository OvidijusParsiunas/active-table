import {ARROW_DOWN_SVG_STRING} from '../../../../consts/icons/arrowDownIconSVGString';
import {GenericElementUtils} from '../../../../utils/elements/genericElementUtils';
import {RowsPerPageSelectButtonEvents} from './rowsPerPageSelectButtonEvents';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {RowsPerPageOptionsStyle} from '../../../../types/pagination';
import {ElementStyle} from '../../../../utils/elements/elementStyle';
import {SVGIconUtils} from '../../../../utils/svgIcons/svgIconUtils';
import {StatefulCSS} from '../../../../types/cssStyle';
import {ActiveTable} from '../../../../activeTable';

export class RowsPerPageSelectButtonElement {
  private static readonly BUTTON_ID = 'rows-per-page-select-button';
  private static readonly ARROW_CONTAINER_ID = 'rows-per-page-select-button-arrow-container';
  private static readonly ARROW_ICON_ID = 'rows-per-page-select-button-arrow-icon';
  private static readonly TEXT_ID = 'rows-per-page-select-button-text';

  // prettier-ignore
  private static applyStyle(element: HTMLElement, rowsPerPageSelect: RowsPerPageOptionsStyle,
      elementName: keyof RowsPerPageOptionsStyle, cssState: keyof StatefulCSS) {
    const statefulStyle = rowsPerPageSelect[elementName] as StatefulCSS;
    ElementStyle.unsetAllCSSStates(element, statefulStyle);
    Object.assign(element.style, statefulStyle[cssState]);
  }

  // prettier-ignore
  public static applyStylesOnElements(button: HTMLElement, cssState: keyof StatefulCSS,
      rowsPerPageSelect?: RowsPerPageOptionsStyle) {
    if (!rowsPerPageSelect) return;
    if (rowsPerPageSelect.button) {
      RowsPerPageSelectButtonElement.applyStyle(button, rowsPerPageSelect, 'button', cssState);
    }
    if (rowsPerPageSelect.buttonText) {
      const buttonText = button.children[0] as HTMLElement;
      RowsPerPageSelectButtonElement.applyStyle(buttonText, rowsPerPageSelect, 'buttonText', cssState);
    }
    if (rowsPerPageSelect.buttonArrow) {
      const buttonArrow = button.children[1] as HTMLElement;
      RowsPerPageSelectButtonElement.applyStyle(buttonArrow, rowsPerPageSelect, 'buttonArrow', cssState);
    }
  }

  private static processStatefulStyle(statefulCSS: StatefulCSS) {
    statefulCSS.hover ??= statefulCSS.default;
    statefulCSS.click ??= statefulCSS.hover;
  }

  private static processAndApplyDefaultStyle(element: HTMLElement, styling?: StatefulCSS) {
    if (styling) {
      RowsPerPageSelectButtonElement.processStatefulStyle(styling);
      Object.assign(element.style, styling.default);
    }
  }

  private static createButtonArrow(pagination: PaginationInternal) {
    const arrow = document.createElement('div');
    arrow.id = RowsPerPageSelectButtonElement.ARROW_CONTAINER_ID;
    arrow.classList.add(GenericElementUtils.NOT_SELECTABLE_CLASS);
    RowsPerPageSelectButtonElement.processAndApplyDefaultStyle(arrow, pagination.styles.rowsPerPageSelect?.buttonArrow);
    // WORK - need to show how to color this in documentation
    const arrowDownIcon = SVGIconUtils.createSVGElement(ARROW_DOWN_SVG_STRING);
    arrowDownIcon.id = RowsPerPageSelectButtonElement.ARROW_ICON_ID;
    arrow.appendChild(arrowDownIcon);
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
    RowsPerPageSelectButtonElement.processAndApplyDefaultStyle(text, styles.rowsPerPageSelect?.buttonText);
    text.innerText = isAllRowsOptionSelected ? rowsPerPageOptionsItemText[0] : String(rowsPerPage);
    return text;
  }

  private static createOptionsButton(pagination: PaginationInternal) {
    const optionsButton = document.createElement('div');
    optionsButton.id = RowsPerPageSelectButtonElement.BUTTON_ID;
    RowsPerPageSelectButtonElement.processAndApplyDefaultStyle(optionsButton, pagination.styles.rowsPerPageSelect?.button);
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
