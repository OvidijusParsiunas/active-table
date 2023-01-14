import {EditableTableComponent} from '../../../../editable-table-component';
import {SelectColorButtonEvents} from './selectColorButtonEvents';
import {SelectDropdownT} from '../../../../types/columnDetails';
import {Browser} from '../../../../utils/browser/browser';
import {SelectButton} from './selectButton';

export class SelectColorButton {
  private static readonly COLOR_INPUT_CLASS = 'color-input';
  public static readonly COLOR_BUTTON_CLASS = 'select-color-button';
  private static readonly COLOR_BUTTON_ICON_CLASS = 'select-color-button-icon';
  private static readonly COLOR_ICON_TEXT = 'c';

  private static createIcon() {
    const iconElement = document.createElement('div');
    iconElement.innerText = SelectColorButton.COLOR_ICON_TEXT;
    iconElement.classList.add(SelectColorButton.COLOR_BUTTON_ICON_CLASS);
    return iconElement;
  }

  private static createButton() {
    const buttonElement = document.createElement('div');
    buttonElement.classList.add(SelectButton.SELECT_BUTTON_CLASS, SelectColorButton.COLOR_BUTTON_CLASS);
    const iconElement = SelectColorButton.createIcon();
    buttonElement.appendChild(iconElement);
    return buttonElement;
  }

  private static createInput() {
    const colorInputElement = document.createElement('input');
    colorInputElement.type = 'color';
    colorInputElement.style.top = Browser.IS_SAFARI ? '0px' : '14px';
    colorInputElement.classList.add(SelectColorButton.COLOR_INPUT_CLASS);
    return colorInputElement;
  }

  private static createContainer() {
    const container = document.createElement('div');
    container.classList.add(SelectButton.SELECT_BUTTON_CONTAINER_CLASS);
    return container;
  }

  public static create(etc: EditableTableComponent, dropdown: SelectDropdownT) {
    const containerElement = SelectColorButton.createContainer();
    const colorInputElement = SelectColorButton.createInput();
    containerElement.appendChild(colorInputElement);
    const iconElement = SelectColorButton.createButton();
    containerElement.appendChild(iconElement);
    SelectColorButtonEvents.setEvents(containerElement, colorInputElement, dropdown.overlays);
    return containerElement;
  }

  public static changeVisibility(itemElement: HTMLElement, rightSideDelta: number, displayOnDropdown?: HTMLElement) {
    const buttonContainerElement = itemElement.children[2] as HTMLElement;
    buttonContainerElement.style.display = displayOnDropdown ? 'block' : 'none';
    if (displayOnDropdown) {
      const colorInputElement = buttonContainerElement.children[0] as HTMLElement;
      const leftDelta = Browser.IS_SAFARI ? 9 : 5;
      colorInputElement.style.left = `${displayOnDropdown.offsetWidth - rightSideDelta + leftDelta}px`;
      const buttonElement = buttonContainerElement.children[1] as HTMLElement;
      buttonElement.style.left = `${displayOnDropdown.offsetWidth - rightSideDelta}px`;
    }
  }
}
