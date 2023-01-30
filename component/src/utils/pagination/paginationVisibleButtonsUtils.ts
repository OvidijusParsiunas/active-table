import {PaginationInternal} from '../../types/paginationInternal';
import {ElementStyle} from '../elements/elementStyle';

// this is used for overriding first and last visible button styling
export class PaginationVisibleButtonsUtils {
  // prettier-ignore
  public static unsetStateAndStyles(pagination: PaginationInternal) {
    const {style: {pageButtons: {firstVisibleButtonOverride, lastVisibleButtonOverride}}, visibleEdgeButtons} = pagination;
    if (visibleEdgeButtons.length === 0) return;
    if (firstVisibleButtonOverride) ElementStyle.unsetStyle(visibleEdgeButtons[0], firstVisibleButtonOverride);
    if (lastVisibleButtonOverride) ElementStyle.unsetStyle(visibleEdgeButtons[1], lastVisibleButtonOverride);
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
    Object.assign(firstVisibleButton.style, firstVisibleButtonOverride);
    const lastVisibleIndex = buttons.findLastIndex(PaginationVisibleButtonsUtils.isButtonVisible);
    const lastVisibleButton = buttons[lastVisibleIndex];
    Object.assign(lastVisibleButton.style, lastVisibleButtonOverride);
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
