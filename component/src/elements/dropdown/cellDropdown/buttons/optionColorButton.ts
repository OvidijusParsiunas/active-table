import {ColumnDetailsT, ColumnsDetailsT} from '../../../../types/columnDetails';
import {OptionColorButtonEvents} from './optionColorButtonEvents';
import {Browser} from '../../../../utils/browser/browser';
import {OptionButton} from './optionButton';

// WORK - bug where the dropdown does not close when the color picker is closed
export class OptionColorButton {
  private static readonly COLOR_INPUT_CLASS = 'color-input';
  public static readonly COLOR_BUTTON_CLASS = 'option-color-button';
  private static readonly COLOR_BUTTON_ICON_CLASS = 'cell-dropdown-option-color-button-icon';
  private static readonly COLOR_ICON_TEXT = 'c';

  // buttonLevelElement is either input or button
  public static extractRelativeParentElements(buttonLevelElement: HTMLElement) {
    const containerElement = buttonLevelElement.parentElement as HTMLElement;
    const textElement = containerElement.previousSibling?.previousSibling as HTMLElement;
    const dropdownItemElement = containerElement.parentElement as HTMLElement;
    return {containerElement, textElement, dropdownItemElement};
  }

  public static changeVisibility(itemElement: HTMLElement, rightSideDelta: number, displayOnDropdown?: HTMLElement) {
    const buttonContainerElement = itemElement.children[2] as HTMLElement;
    buttonContainerElement.style.display = displayOnDropdown ? 'block' : 'none';
    if (displayOnDropdown) {
      const colorInputElement = buttonContainerElement.children[0] as HTMLElement;
      const leftInputDelta = Browser.IS_SAFARI ? 9 : 5;
      colorInputElement.style.left = `${displayOnDropdown.offsetWidth - rightSideDelta + leftInputDelta}px`;
      const buttonElement = buttonContainerElement.children[1] as HTMLElement;
      buttonElement.style.left = `${displayOnDropdown.offsetWidth - rightSideDelta}px`;
    }
  }

  private static createIcon() {
    const iconElement = document.createElement('div');
    iconElement.innerText = OptionColorButton.COLOR_ICON_TEXT;
    iconElement.classList.add(OptionColorButton.COLOR_BUTTON_ICON_CLASS);
    return iconElement;
  }

  private static createButton() {
    const buttonElement = document.createElement('div');
    buttonElement.classList.add(OptionButton.BUTTON_CLASS, OptionColorButton.COLOR_BUTTON_CLASS);
    const iconElement = OptionColorButton.createIcon();
    buttonElement.appendChild(iconElement);
    return buttonElement;
  }

  private static createInput() {
    const colorInputElement = document.createElement('input');
    colorInputElement.type = 'color';
    colorInputElement.style.top = Browser.IS_SAFARI ? '0px' : '14px';
    colorInputElement.classList.add(OptionColorButton.COLOR_INPUT_CLASS);
    return colorInputElement;
  }

  private static createContainer() {
    const container = document.createElement('div');
    container.classList.add(OptionButton.BUTTON_CONTAINER_CLASS);
    return container;
  }

  public static create(columnsDetails: ColumnsDetailsT, columnDetails: ColumnDetailsT) {
    const containerElement = OptionColorButton.createContainer();
    const colorInputElement = OptionColorButton.createInput();
    containerElement.appendChild(colorInputElement);
    const iconElement = OptionColorButton.createButton();
    containerElement.appendChild(iconElement);
    OptionColorButtonEvents.setEvents(containerElement, colorInputElement, columnsDetails, columnDetails);
    return containerElement;
  }
}
