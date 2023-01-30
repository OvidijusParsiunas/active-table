import {IPageButtonsStyle} from '../../types/paginationInternal';
import {ElementStyle} from '../elements/elementStyle';
import {CSSStyle} from '../../types/cssStyle';

// this is used for overriding first and last visible button styling
export class PaginationVisibleButtonsUtils {
  // classes are used to help unset previous visible buttons style
  // using classes instead of ids to be able to search directly from the buttonContainer element efficiently
  private static readonly FIRST_CLASS = 'first-visible-pagination-button';
  private static readonly LAST_CLASS = 'last-visible-pagination-button';

  private static unsetClassAndStyle(buttonContainer: HTMLElement, cssClass: string, styleOverride?: CSSStyle) {
    const element = buttonContainer.getElementsByClassName(cssClass)?.[0];
    if (!element) return;
    if (styleOverride) ElementStyle.unsetStyle(element as HTMLElement, styleOverride);
    element.classList.remove(cssClass);
  }

  // prettier-ignore
  public static unsetStyles(buttonContainer: HTMLElement, buttonStyles?: IPageButtonsStyle) {
    PaginationVisibleButtonsUtils.unsetClassAndStyle(
      buttonContainer, PaginationVisibleButtonsUtils.FIRST_CLASS, buttonStyles?.firstVisibleButtonOverride);
    PaginationVisibleButtonsUtils.unsetClassAndStyle(
      buttonContainer, PaginationVisibleButtonsUtils.LAST_CLASS, buttonStyles?.lastVisibleButtonOverride);
  }

  // when the button display prope is false or is not visible in other ways - clientWidth is 0
  private static isButtonVisible(buttonElement: Element) {
    return buttonElement.clientWidth > 0;
  }

  private static setClassAndStyle(cssClass: string, element?: HTMLElement, styleOverride?: CSSStyle) {
    if (!element) return;
    element.classList.add(cssClass);
    if (styleOverride) Object.assign(element.style, styleOverride);
  }

  // prettier-ignore
  private static setClassesAndStyles(buttons: HTMLElement[], firstVisibleIndex: number, buttonStyles?: IPageButtonsStyle) {
    PaginationVisibleButtonsUtils.setClassAndStyle(
      PaginationVisibleButtonsUtils.FIRST_CLASS, buttons[firstVisibleIndex], buttonStyles?.firstVisibleButtonOverride);
    const lastVisibleElement = buttons[buttons.findLastIndex(PaginationVisibleButtonsUtils.isButtonVisible)];
    PaginationVisibleButtonsUtils.setClassAndStyle(
      PaginationVisibleButtonsUtils.LAST_CLASS, lastVisibleElement, buttonStyles?.lastVisibleButtonOverride);
  }

  public static setStyles(buttonContainer: HTMLElement, buttonStyles?: IPageButtonsStyle) {
    const buttons = Array.from(buttonContainer.children) as HTMLElement[];
    const firstVisibleIndex = buttons.findIndex(PaginationVisibleButtonsUtils.isButtonVisible);
    if (firstVisibleIndex === -1) {
      // when triggered on initial render where buttons have yet not been generated
      setTimeout(() => {
        const firstVisibleIndex = buttons.findIndex(PaginationVisibleButtonsUtils.isButtonVisible);
        PaginationVisibleButtonsUtils.setClassesAndStyles(buttons, firstVisibleIndex, buttonStyles);
      });
    } else {
      PaginationVisibleButtonsUtils.setClassesAndStyles(buttons, firstVisibleIndex, buttonStyles);
    }
  }
}
