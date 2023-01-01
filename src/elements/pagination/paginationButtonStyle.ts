import {PaginationButtonElement} from './paginationButtonElement';
import {IPaginationStyle} from '../../types/paginationInternal';
import {ElementStyle} from '../../utils/elements/elementStyle';
import {PropertiesOfType} from '../../types/utilityTypes';
import {StatefulCSSS} from '../../types/cssStyle';

// action buttons will never be active
export class PaginationButtonStyle {
  // prettier-ignore
  private static unsetAllCSSStates(buttonElement: HTMLElement,
      paginationStyle: IPaginationStyle, buttonType: keyof PropertiesOfType<IPaginationStyle, Required<StatefulCSSS>>) {
    ElementStyle.unsetStyle(buttonElement, paginationStyle[buttonType].click);
    ElementStyle.unsetStyle(buttonElement, paginationStyle[buttonType].hover);
    ElementStyle.unsetStyle(buttonElement, paginationStyle[buttonType].default);
  }

  // prettier-ignore
  private static unsetAll(buttonElement: HTMLElement, paginationStyle: IPaginationStyle, isActionButton: boolean) {
    if (buttonElement.classList.contains(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS)) {
      PaginationButtonStyle.unsetAllCSSStates(buttonElement, paginationStyle, 'activeButton');
    } else if (buttonElement.classList.contains(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS)) {
      ElementStyle.unsetStyle(buttonElement, paginationStyle.disabledButtons);
    } else {
      PaginationButtonStyle.unsetAllCSSStates(buttonElement, paginationStyle,
        isActionButton ? 'actionButtons' : 'buttons');
    }
  }

  public static setDefault(buttonElement: HTMLElement, paginationStyle: IPaginationStyle, isActionButton: boolean) {
    PaginationButtonStyle.unsetAll(buttonElement, paginationStyle, isActionButton);
    if (isActionButton) {
      Object.assign(buttonElement.style, paginationStyle.actionButtons.default);
    } else {
      Object.assign(buttonElement.style, paginationStyle.buttons.default);
    }
  }

  // prettier-ignore
  public static setActive(newActiveButton: HTMLElement, paginationStyle: IPaginationStyle,
      previousActiveButton?: HTMLElement) {
    if (previousActiveButton) {
      PaginationButtonStyle.unsetAllCSSStates(previousActiveButton, paginationStyle, 'activeButton');
      Object.assign(previousActiveButton.style, paginationStyle.buttons.default);
    }
    if (newActiveButton.classList.contains(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS)) {
      ElementStyle.unsetStyle(newActiveButton, paginationStyle.disabledButtons);
    } else {
      PaginationButtonStyle.unsetAllCSSStates(newActiveButton, paginationStyle, 'buttons');
    }
    Object.assign(newActiveButton.style, paginationStyle.activeButton.default);
  }

  public static setDisabled(buttonElement: HTMLElement, paginationStyle: IPaginationStyle, isActionButton: boolean) {
    PaginationButtonStyle.unsetAll(buttonElement, paginationStyle, isActionButton);
    Object.assign(buttonElement.style, paginationStyle.disabledButtons);
  }

  public static mouseDown(buttonElement: HTMLElement, paginationStyle: IPaginationStyle, isActionButton: boolean) {
    if (buttonElement.classList.contains(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS)) {
      Object.assign(buttonElement.style, paginationStyle.activeButton.click);
    } else if (isActionButton) {
      Object.assign(buttonElement.style, paginationStyle.actionButtons.click);
    } else {
      Object.assign(buttonElement.style, paginationStyle.buttons.click);
    }
  }

  public static mouseEnter(buttonElement: HTMLElement, paginationStyle: IPaginationStyle, isActionButton: boolean) {
    if (buttonElement.classList.contains(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS)) return;
    if (buttonElement.classList.contains(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS)) {
      // needed to unset click style and reset default + hover styles
      PaginationButtonStyle.unsetAllCSSStates(buttonElement, paginationStyle, 'activeButton');
      Object.assign(buttonElement.style, paginationStyle.activeButton.default);
      Object.assign(buttonElement.style, paginationStyle.activeButton.hover);
    } else {
      // needed to unset click style and reset default + hover styles
      PaginationButtonStyle.setDefault(buttonElement, paginationStyle, isActionButton);
      if (isActionButton) {
        Object.assign(buttonElement.style, paginationStyle.actionButtons.hover);
      } else {
        Object.assign(buttonElement.style, paginationStyle.buttons.hover);
      }
    }
  }

  public static mouseLeave(buttonElement: HTMLElement, paginationStyle: IPaginationStyle, isActionButton: boolean) {
    // this is required because mouseLeave can be fired when the hovered button is disabled
    // as pointer-events are set to none
    if (buttonElement.classList.contains(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS)) return;
    if (buttonElement.classList.contains(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS)) {
      PaginationButtonStyle.unsetAll(buttonElement, paginationStyle, false);
      Object.assign(buttonElement.style, paginationStyle.activeButton.default);
    } else {
      PaginationButtonStyle.setDefault(buttonElement, paginationStyle, isActionButton);
    }
  }
}
