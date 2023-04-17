import {PaginationVisibleButtonsUtils} from '../../../utils/outerTableComponents/pagination/paginationVisibleButtonsUtils';
import {IPageButtonsStyles} from '../../../types/paginationInternal';
import {ElementStyle} from '../../../utils/elements/elementStyle';
import {PropertiesOfType} from '../../../types/utilityTypes';
import {PageButtonElement} from './pageButtonElement';
import {StatefulCSS} from '../../../types/cssStyle';

// action buttons will never be active
export class PageButtonStyle {
  // prettier-ignore
  private static unsetAllCSSStates(buttonElement: HTMLElement, pageButtonsStyles: IPageButtonsStyles,
      buttonType: keyof PropertiesOfType<IPageButtonsStyles, Required<StatefulCSS>>) {
    ElementStyle.unsetAllCSSStates(buttonElement, pageButtonsStyles[buttonType]);
  }

  private static unsetAll(buttonElement: HTMLElement, pageButtonsStyles: IPageButtonsStyles, isActionButton: boolean) {
    if (buttonElement.classList.contains(pageButtonsStyles.activeButtonClass)) {
      PageButtonStyle.unsetAllCSSStates(buttonElement, pageButtonsStyles, 'activeButton');
    } else if (buttonElement.classList.contains(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS)) {
      ElementStyle.unsetStyle(buttonElement, pageButtonsStyles.disabledButtons);
    } else {
      PageButtonStyle.unsetAllCSSStates(buttonElement, pageButtonsStyles, isActionButton ? 'actionButtons' : 'buttons');
    }
  }

  public static setDefault(buttonElement: HTMLElement, pageButtonsStyles: IPageButtonsStyles, isActionButton: boolean) {
    PageButtonStyle.unsetAll(buttonElement, pageButtonsStyles, isActionButton);
    if (isActionButton) {
      Object.assign(buttonElement.style, pageButtonsStyles.actionButtons.default);
    } else {
      Object.assign(buttonElement.style, pageButtonsStyles.buttons.default);
    }
  }

  // prettier-ignore
  public static setActive(newActiveButton: HTMLElement, pageButtonsStyles: IPageButtonsStyles,
      previousActiveButton?: HTMLElement) {
    if (previousActiveButton) {
      PageButtonStyle.unsetAllCSSStates(previousActiveButton, pageButtonsStyles, 'activeButton');
      Object.assign(previousActiveButton.style, pageButtonsStyles.buttons.default);
    }
    if (newActiveButton.classList.contains(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS)) {
      ElementStyle.unsetStyle(newActiveButton, pageButtonsStyles.disabledButtons);
    } else {
      PageButtonStyle.unsetAllCSSStates(newActiveButton, pageButtonsStyles, 'buttons');
    }
    Object.assign(newActiveButton.style, pageButtonsStyles.activeButton.default);
  }

  public static setDisabled(buttonElement: HTMLElement, pageButtonsStyles: IPageButtonsStyles, isActionButton: boolean) {
    PageButtonStyle.setDefault(buttonElement, pageButtonsStyles, isActionButton);
    Object.assign(buttonElement.style, pageButtonsStyles.disabledButtons);
  }

  public static mouseDown(buttonElement: HTMLElement, pageButtonsStyles: IPageButtonsStyles, isActionButton: boolean) {
    if (buttonElement.classList.contains(pageButtonsStyles.activeButtonClass)) {
      Object.assign(buttonElement.style, pageButtonsStyles.activeButton.click);
    } else if (isActionButton) {
      Object.assign(buttonElement.style, pageButtonsStyles.actionButtons.click);
    } else {
      Object.assign(buttonElement.style, pageButtonsStyles.buttons.click);
    }
    PaginationVisibleButtonsUtils.overrideOnMouseEvent(buttonElement, pageButtonsStyles);
  }

  public static mouseEnter(buttonElement: HTMLElement, pageButtonsStyles: IPageButtonsStyles, isActionButton: boolean) {
    if (buttonElement.classList.contains(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS)) return;
    if (buttonElement.classList.contains(pageButtonsStyles.activeButtonClass)) {
      // needed to unset click style and reset default + hover styles
      PageButtonStyle.unsetAllCSSStates(buttonElement, pageButtonsStyles, 'activeButton');
      Object.assign(buttonElement.style, pageButtonsStyles.activeButton.default);
      Object.assign(buttonElement.style, pageButtonsStyles.activeButton.hover);
    } else {
      // needed to unset click style and reset default + hover styles
      PageButtonStyle.setDefault(buttonElement, pageButtonsStyles, isActionButton);
      if (isActionButton) {
        Object.assign(buttonElement.style, pageButtonsStyles.actionButtons.hover);
      } else {
        Object.assign(buttonElement.style, pageButtonsStyles.buttons.hover);
      }
    }
    PaginationVisibleButtonsUtils.overrideOnMouseEvent(buttonElement, pageButtonsStyles);
  }

  public static mouseLeave(buttonElement: HTMLElement, pageButtonsStyles: IPageButtonsStyles, isActionButton: boolean) {
    // this is required because mouseLeave can be fired when the hovered button is disabled
    // as pointer-events are set to none
    if (buttonElement.classList.contains(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS)) return;
    if (buttonElement.classList.contains(pageButtonsStyles.activeButtonClass)) {
      PageButtonStyle.unsetAll(buttonElement, pageButtonsStyles, false);
      Object.assign(buttonElement.style, pageButtonsStyles.activeButton.default);
    } else {
      PageButtonStyle.setDefault(buttonElement, pageButtonsStyles, isActionButton);
    }
    PaginationVisibleButtonsUtils.overrideOnMouseEvent(buttonElement, pageButtonsStyles);
  }
}
