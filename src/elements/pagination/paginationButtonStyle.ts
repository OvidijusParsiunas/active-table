import {PaginationButtonElement} from './paginationButtonElement';

export class PaginationButtonStyle {
  private static DEFAULT_ACTIVE_BACKGROUND_COLOR = 'green';
  private static HOVER_ACTIVE_BACKGROUND_COLOR = 'lightgreen';
  private static MOUSE_DOWN_ACTIVE_BACKGROUND_COLOR = 'deepskyblue';
  private static DEFAULT_BACKGROUND_COLOR = '';
  private static HOVER_BACKGROUND_COLOR = 'orange';
  private static MOUSE_DOWN_BACKGROUND_COLOR = 'red';
  private static DISABLED_BACKGROUND_COLOR = 'grey';

  public static setDisabled(buttonElement: HTMLElement) {
    buttonElement.style.backgroundColor = PaginationButtonStyle.DISABLED_BACKGROUND_COLOR;
  }

  public static unset(buttonElement: HTMLElement) {
    buttonElement.style.backgroundColor = PaginationButtonStyle.DEFAULT_BACKGROUND_COLOR;
  }

  public static setActive(newActiveButton: HTMLElement, previousActiveButton?: HTMLElement) {
    if (previousActiveButton) previousActiveButton.style.backgroundColor = PaginationButtonStyle.DEFAULT_BACKGROUND_COLOR;
    newActiveButton.style.backgroundColor = PaginationButtonStyle.DEFAULT_ACTIVE_BACKGROUND_COLOR;
  }

  // prettier-ignore
  public static mouseDown(buttonElement: HTMLElement) {
    buttonElement.style.backgroundColor = buttonElement
      .classList.contains(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS)
      ? PaginationButtonStyle.MOUSE_DOWN_ACTIVE_BACKGROUND_COLOR : PaginationButtonStyle.MOUSE_DOWN_BACKGROUND_COLOR;
  }

  // prettier-ignore
  public static mouseLeave(buttonElement: HTMLElement) {
    buttonElement.style.backgroundColor = buttonElement
      .classList.contains(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS)
      ? PaginationButtonStyle.DEFAULT_ACTIVE_BACKGROUND_COLOR : PaginationButtonStyle.DEFAULT_BACKGROUND_COLOR;
  }

  // prettier-ignore
  public static mouseEnter(buttonElement: HTMLElement) {
    buttonElement.style.backgroundColor = buttonElement
      .classList.contains(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS)
      ? PaginationButtonStyle.HOVER_ACTIVE_BACKGROUND_COLOR : PaginationButtonStyle.HOVER_BACKGROUND_COLOR;
  }
}
