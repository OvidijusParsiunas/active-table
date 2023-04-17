import {IPageButtonsStyles} from '../../../types/paginationInternal';
import {PageButtonStyle} from './pageButtonStyle';

export class PageButtonEvents {
  private static buttonMouseLeave(pageButtonStyles: IPageButtonsStyles, isActionButton: boolean, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseLeave(buttonElement, pageButtonStyles, isActionButton);
  }

  private static buttonMouseEnter(pageButtonStyles: IPageButtonsStyles, isActionButton: boolean, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseEnter(buttonElement, pageButtonStyles, isActionButton);
  }

  private static buttonMouseDown(pageButtonStyles: IPageButtonsStyles, isActionButton: boolean, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseDown(buttonElement, pageButtonStyles, isActionButton);
  }

  public static setEvents(button: HTMLElement, pageButtonStyles: IPageButtonsStyles, isActionButton: boolean) {
    button.onmousedown = PageButtonEvents.buttonMouseDown.bind(this, pageButtonStyles, isActionButton);
    button.onmouseenter = PageButtonEvents.buttonMouseEnter.bind(this, pageButtonStyles, isActionButton);
    button.onmouseleave = PageButtonEvents.buttonMouseLeave.bind(this, pageButtonStyles, isActionButton);
  }
}
