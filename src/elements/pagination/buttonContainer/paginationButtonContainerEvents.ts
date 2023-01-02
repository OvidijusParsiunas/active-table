import {PaginationInternal} from '../../../types/paginationInternal';
import {PaginationButtonStyle} from './paginationButtonStyle';

export class PaginationButtonContainerEvents {
  // REF-31
  private static containerMouseLeave(paginationInternal: PaginationInternal) {
    const {clickedNumberButton, programaticallyHoveredButton, style} = paginationInternal;
    if (clickedNumberButton && programaticallyHoveredButton) {
      PaginationButtonStyle.mouseLeave(programaticallyHoveredButton, style, false);
    }
  }

  // prettier-ignore
  public static setEvents(buttonContainerElement: HTMLElement, paginationInternal: PaginationInternal) {
    buttonContainerElement.onmouseleave = PaginationButtonContainerEvents.containerMouseLeave
      .bind(this, paginationInternal);
  }
}
