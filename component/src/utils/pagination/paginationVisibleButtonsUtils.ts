import {PageButtonElement} from '../../elements/pagination/pageButtons/pageButtonElement';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {PaginationInternal} from '../../types/paginationInternal';
import {PageButtonStyle} from '../../types/pagination';
import {ElementStyle} from '../elements/elementStyle';
import {CSSStyle} from '../../types/cssStyle';

// this is used for overriding first and last visible button styling
export class PaginationVisibleButtonsUtils {
  private static readonly FIRST_VISIBLE_CLASS = 'pagination-first-visible-button';
  private static readonly LAST_VISIBLE_CLASS = 'pagination-last-visible-button';
  private static readonly FIRST_PRECEDENCE_VALUES = ['borderLeft', 'borderLeftWidth', 'borderLeftColor'];
  private static readonly LAST_PRECEDENCE_VALUES = ['borderRight', 'borderRightWidth', 'borderRightColor'];

  private static setStyle(buttonElement: HTMLElement, precedenceValues: string[], edgeStyle?: CSSStyle) {
    if (!edgeStyle) return;
    const styleKeys = new Set<string>(Object.keys(edgeStyle));
    if (buttonElement.classList.contains(PageButtonElement.PRECEDENCE_ACTIVE_PAGINATION_BUTTON_CLASS)) {
      precedenceValues.forEach((value) => styleKeys.delete(value));
    }
    styleKeys.forEach((key) => {
      GenericElementUtils.setStyle(buttonElement, key, edgeStyle[key as keyof typeof edgeStyle] as string);
    });
  }

  // prettier-ignore
  public static overrideOnMouseEvent(buttonElement: HTMLElement, pageButtonsStyle: PageButtonStyle) {
    const {firstVisibleButtonOverride, lastVisibleButtonOverride} = pageButtonsStyle;
    if (buttonElement.classList.contains(PaginationVisibleButtonsUtils.FIRST_VISIBLE_CLASS)) {
      PaginationVisibleButtonsUtils.setStyle(buttonElement,
        PaginationVisibleButtonsUtils.FIRST_PRECEDENCE_VALUES, firstVisibleButtonOverride);
    } else if (buttonElement.classList.contains(PaginationVisibleButtonsUtils.LAST_VISIBLE_CLASS)) {
      PaginationVisibleButtonsUtils.setStyle(buttonElement,
        PaginationVisibleButtonsUtils.LAST_PRECEDENCE_VALUES, lastVisibleButtonOverride);
    }
  }

  // prettier-ignore
  public static unsetStateAndStyles(pagination: PaginationInternal) {
    const {style: {pageButtons: {firstVisibleButtonOverride, lastVisibleButtonOverride}}, visibleEdgeButtons} = pagination;
    if (visibleEdgeButtons.length === 0) return;
    if (firstVisibleButtonOverride) ElementStyle.unsetStyle(visibleEdgeButtons[0], firstVisibleButtonOverride);
    visibleEdgeButtons[0].classList.remove(PaginationVisibleButtonsUtils.FIRST_VISIBLE_CLASS);
    if (lastVisibleButtonOverride) ElementStyle.unsetStyle(visibleEdgeButtons[1], lastVisibleButtonOverride);
    visibleEdgeButtons[1].classList.remove(PaginationVisibleButtonsUtils.LAST_VISIBLE_CLASS);
    pagination.visibleEdgeButtons = [];
  }

  // when the button display prope is false or is not visible in other ways - clientWidth is 0
  private static isButtonVisible(buttonElement: Element) {
    return buttonElement.clientWidth > 0;
  }

  // prettier-ignore
  private static set(buttons: HTMLElement[], firstVisibleIndex: number, pagination: PaginationInternal) {
    const {style: {pageButtons: {firstVisibleButtonOverride, lastVisibleButtonOverride}}} = pagination;
    const firstVisibleButton = buttons[firstVisibleIndex];
    if (!firstVisibleButton) return;
    PaginationVisibleButtonsUtils.setStyle(firstVisibleButton,
      PaginationVisibleButtonsUtils.FIRST_PRECEDENCE_VALUES, firstVisibleButtonOverride);
    firstVisibleButton.classList.add(PaginationVisibleButtonsUtils.FIRST_VISIBLE_CLASS);
    const lastVisibleIndex = buttons.findLastIndex(PaginationVisibleButtonsUtils.isButtonVisible);
    const lastVisibleButton = buttons[lastVisibleIndex];
    PaginationVisibleButtonsUtils.setStyle(lastVisibleButton,
      PaginationVisibleButtonsUtils.LAST_PRECEDENCE_VALUES, lastVisibleButtonOverride);
    lastVisibleButton.classList.add(PaginationVisibleButtonsUtils.LAST_VISIBLE_CLASS);
    pagination.visibleEdgeButtons = [firstVisibleButton, lastVisibleButton]
  }

  public static setStateAndStyles(pagination: PaginationInternal) {
    const buttons = Array.from(pagination.buttonContainer.children) as HTMLElement[];
    const firstVisibleIndex = buttons.findIndex(PaginationVisibleButtonsUtils.isButtonVisible);
    if (firstVisibleIndex === -1) {
      // when triggered on initial render where buttons have yet not been generated
      setTimeout(() => {
        const firstVisibleIndex = buttons.findIndex(PaginationVisibleButtonsUtils.isButtonVisible);
        PaginationVisibleButtonsUtils.set(buttons, firstVisibleIndex, pagination);
      });
    } else {
      PaginationVisibleButtonsUtils.set(buttons, firstVisibleIndex, pagination);
    }
  }
}
