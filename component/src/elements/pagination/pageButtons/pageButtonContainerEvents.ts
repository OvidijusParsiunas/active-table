import {PaginationInternal} from '../../../types/paginationInternal';
import {PageButtonStyle} from './pageButtonStyle';

export class PageButtonContainerEvents {
  // REF-31
  private static containerMouseLeave(pagination: PaginationInternal) {
    const {clickedPageNumberButton, programaticallyHoveredPageNumberButton, style} = pagination;
    if (clickedPageNumberButton && programaticallyHoveredPageNumberButton) {
      PageButtonStyle.mouseLeave(programaticallyHoveredPageNumberButton, style.pageButtons, false);
    }
  }

  public static setEvents(buttonContainerElement: HTMLElement, pagination: PaginationInternal) {
    buttonContainerElement.onmouseleave = PageButtonContainerEvents.containerMouseLeave.bind(this, pagination);
  }
}
