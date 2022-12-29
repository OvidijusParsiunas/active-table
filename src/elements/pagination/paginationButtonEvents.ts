import {PaginationButtonStyle} from './paginationButtonStyle';

export class PaginationButtonEvents {
  private static buttonMouseLeave(event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseLeave(buttonElement);
  }

  private static buttonMouseEnter(event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement);
  }

  private static buttonMouseDown(event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseDown(buttonElement);
  }

  public static setEvents(button: HTMLElement) {
    button.onmousedown = PaginationButtonEvents.buttonMouseDown;
    button.onmouseenter = PaginationButtonEvents.buttonMouseEnter;
    button.onmouseleave = PaginationButtonEvents.buttonMouseLeave;
  }
}
