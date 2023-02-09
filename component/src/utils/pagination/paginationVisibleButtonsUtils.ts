import {PageButtonElement} from '../../elements/pagination/pageButtons/pageButtonElement';
import {RowElement} from '../../elements/table/addNewElements/row/rowElement';
import {PaginationInternal} from '../../types/paginationInternal';
import {PageButtonStyle} from '../../types/pagination';
import {ElementStyle} from '../elements/elementStyle';
import {CSSStyle} from '../../types/cssStyle';
import {ActiveTable} from '../../activeTable';

// this is used for overriding first and last visible button styling
export class PaginationVisibleButtonsUtils {
  private static readonly FIRST_VISIBLE_CLASS = 'pagination-first-visible-button';
  private static readonly LAST_VISIBLE_CLASS = 'pagination-last-visible-button';
  private static readonly FIRST_PRECEDENCE_VALUES = ['borderLeft', 'borderLeftWidth', 'borderLeftColor'];
  private static readonly LAST_PRECEDENCE_VALUES = ['borderRight', 'borderRightWidth', 'borderRightColor'];

  private static getRightBorderWidthInStyleOverride(lastOverrideStyle: CSSStyle) {
    if (lastOverrideStyle.borderRightWidth) {
      return Number.parseInt(lastOverrideStyle.borderRightWidth);
    }
    if (lastOverrideStyle.borderRight) {
      return Number.parseInt(lastOverrideStyle.borderRight.split(' ')[0]);
    }
    return -1;
  }

  // if the last button is active page (no action buttons displayed) and it has precedence, the override right border
  // will not take place and it will either have no right border or active style right border:
  // this is problematic as the border difference will cause the entire container to have a different width
  // which will in turn cause the pagination components to shift when the last button is clicked,
  // to prevent this we add the border style that would have been overriden
  private static setBorderPaddingForLastPrecedence(buttonElement: HTMLElement, lastOverrideStyle: CSSStyle) {
    const overwrittenWidth = PaginationVisibleButtonsUtils.getRightBorderWidthInStyleOverride(lastOverrideStyle);
    if (isNaN(overwrittenWidth) || overwrittenWidth === 0) return;
    const currentBorderWidth = Number.parseInt(getComputedStyle(buttonElement).borderRightWidth);
    if (currentBorderWidth > 0) {
      // if active style border is used we add to it
      buttonElement.style.borderRightWidth = `${currentBorderWidth + overwrittenWidth}px`;
    } else {
      // if no right border is used then we add a transparent border
      buttonElement.style.borderRight = `${overwrittenWidth}px solid #fafafa01`;
    }
  }

  private static setStyle(buttonElement: HTMLElement, precedenceValues: string[], isLast: boolean, edgeStyle?: CSSStyle) {
    if (!edgeStyle) return;
    const styleKeys = new Set<string>(Object.keys(edgeStyle));
    const isPrecedence = buttonElement.classList.contains(PageButtonElement.PRECEDENCE_ACTIVE_PAGINATION_BUTTON_CLASS);
    if (isPrecedence) precedenceValues.forEach((value) => styleKeys.delete(value));
    styleKeys.forEach((key) => {
      ElementStyle.setStyle(buttonElement, key, edgeStyle[key as keyof typeof edgeStyle] as string);
    });
    if (isLast && isPrecedence) {
      PaginationVisibleButtonsUtils.setBorderPaddingForLastPrecedence(buttonElement, edgeStyle);
    }
  }

  // prettier-ignore
  public static overrideOnMouseEvent(buttonElement: HTMLElement, pageButtonsStyle: PageButtonStyle) {
    const {firstVisibleButtonOverride, lastVisibleButtonOverride} = pageButtonsStyle;
    if (buttonElement.classList.contains(PaginationVisibleButtonsUtils.FIRST_VISIBLE_CLASS)) {
      PaginationVisibleButtonsUtils.setStyle(buttonElement,
        PaginationVisibleButtonsUtils.FIRST_PRECEDENCE_VALUES, false, firstVisibleButtonOverride);
    }
    if (buttonElement.classList.contains(PaginationVisibleButtonsUtils.LAST_VISIBLE_CLASS)) {
      PaginationVisibleButtonsUtils.setStyle(buttonElement,
        PaginationVisibleButtonsUtils.LAST_PRECEDENCE_VALUES, true, lastVisibleButtonOverride);
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

  // when the button display property is false - clientWidth is 0
  private static isButtonVisible(buttonElement: HTMLElement) {
    return buttonElement.clientWidth > 0 && buttonElement.style.visibility !== 'hidden';
  }

  // prettier-ignore
  private static set(buttons: HTMLElement[], firstVisibleIndex: number, pagination: PaginationInternal) {
    const {style: {pageButtons: {firstVisibleButtonOverride, lastVisibleButtonOverride}}} = pagination;
    const firstVisibleButton = buttons[firstVisibleIndex];
    if (!firstVisibleButton) return;
    if (!firstVisibleButton.classList.contains(PaginationVisibleButtonsUtils.FIRST_VISIBLE_CLASS)) {
      PaginationVisibleButtonsUtils.setStyle(firstVisibleButton,
        PaginationVisibleButtonsUtils.FIRST_PRECEDENCE_VALUES, false, firstVisibleButtonOverride);
      firstVisibleButton.classList.add(PaginationVisibleButtonsUtils.FIRST_VISIBLE_CLASS);
    }
    const lastVisibleIndex = buttons.findLastIndex(PaginationVisibleButtonsUtils.isButtonVisible);
    const lastVisibleButton = buttons[lastVisibleIndex];
    if (!lastVisibleButton.classList.contains(PaginationVisibleButtonsUtils.LAST_VISIBLE_CLASS)) {
      PaginationVisibleButtonsUtils.setStyle(lastVisibleButton,
        PaginationVisibleButtonsUtils.LAST_PRECEDENCE_VALUES, true, lastVisibleButtonOverride);
      lastVisibleButton.classList.add(PaginationVisibleButtonsUtils.LAST_VISIBLE_CLASS);
    }
    pagination.visibleEdgeButtons = [firstVisibleButton, lastVisibleButton]
  }

  public static setStateAndStyles(at: ActiveTable) {
    const {paginationInternal, displayAddNewRow} = at;
    const buttons = Array.from(paginationInternal.buttonContainer.children) as HTMLElement[];
    const firstVisibleIndex = buttons.findIndex(PaginationVisibleButtonsUtils.isButtonVisible);
    if (firstVisibleIndex === -1) {
      // when triggered on initial render where buttons have yet not been generated
      setTimeout(() => {
        const firstVisibleIndex = buttons.findIndex(PaginationVisibleButtonsUtils.isButtonVisible);
        PaginationVisibleButtonsUtils.set(buttons, firstVisibleIndex, paginationInternal);
      });
    } else {
      PaginationVisibleButtonsUtils.set(buttons, firstVisibleIndex, paginationInternal);
    }
    if (!displayAddNewRow) RowElement.toggleLastRowClass(at);
  }
}
