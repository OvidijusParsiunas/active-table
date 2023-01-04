import {PaginationInternal} from '../../../types/paginationInternal';
import {PageButtonStyle} from './pageButtonStyle';

export class PageButtonContainerEvents {
  // REF-31
  private static containerMouseLeave(paginationInternal: PaginationInternal) {
    const {clickedPageNumberButton, programaticallyHoveredPageNumberButton, style} = paginationInternal;
    if (clickedPageNumberButton && programaticallyHoveredPageNumberButton) {
      PageButtonStyle.mouseLeave(programaticallyHoveredPageNumberButton, style.pageButtons, false);
    }
  }

  public static setEvents(buttonContainerElement: HTMLElement, paginationInternal: PaginationInternal) {
    buttonContainerElement.onmouseleave = PageButtonContainerEvents.containerMouseLeave.bind(this, paginationInternal);
  }
}
