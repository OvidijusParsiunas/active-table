import {IPaginationStyle} from '../../types/paginationInternal';
import {PaginationButtonStyle} from './paginationButtonStyle';

export class PaginationButtonEvents {
  private static buttonMouseLeave(paginationStyle: IPaginationStyle, isActionButton: boolean, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseLeave(buttonElement, paginationStyle, isActionButton);
  }

  private static buttonMouseEnter(paginationStyle: IPaginationStyle, isActionButton: boolean, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement, paginationStyle, isActionButton);
  }

  private static buttonMouseDown(paginationStyle: IPaginationStyle, isActionButton: boolean, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseDown(buttonElement, paginationStyle, isActionButton);
  }

  public static setEvents(button: HTMLElement, paginationStyle: IPaginationStyle, isActionButton: boolean) {
    button.onmousedown = PaginationButtonEvents.buttonMouseDown.bind(this, paginationStyle, isActionButton);
    button.onmouseenter = PaginationButtonEvents.buttonMouseEnter.bind(this, paginationStyle, isActionButton);
    button.onmouseleave = PaginationButtonEvents.buttonMouseLeave.bind(this, paginationStyle, isActionButton);
  }
}
