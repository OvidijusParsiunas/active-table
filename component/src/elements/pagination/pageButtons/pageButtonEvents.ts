import {IPageButtonsStyle} from '../../../types/paginationInternal';
import {PageButtonStyle} from './pageButtonStyle';

export class PageButtonEvents {
  private static buttonMouseLeave(pageButtonStyle: IPageButtonsStyle, isActionButton: boolean, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseLeave(buttonElement, pageButtonStyle, isActionButton);
  }

  private static buttonMouseEnter(pageButtonStyle: IPageButtonsStyle, isActionButton: boolean, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseEnter(buttonElement, pageButtonStyle, isActionButton);
  }

  private static buttonMouseDown(pageButtonStyle: IPageButtonsStyle, isActionButton: boolean, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseDown(buttonElement, pageButtonStyle, isActionButton);
  }

  public static setEvents(button: HTMLElement, pageButtonStyle: IPageButtonsStyle, isActionButton: boolean) {
    button.onmousedown = PageButtonEvents.buttonMouseDown.bind(this, pageButtonStyle, isActionButton);
    button.onmouseenter = PageButtonEvents.buttonMouseEnter.bind(this, pageButtonStyle, isActionButton);
    button.onmouseleave = PageButtonEvents.buttonMouseLeave.bind(this, pageButtonStyle, isActionButton);
  }
}
