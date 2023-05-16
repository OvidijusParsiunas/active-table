import {OptionDeleteButtonEvents} from './optionDeleteButtonEvents';
import {ColumnDetailsT} from '../../../../types/columnDetails';
import {ActiveTable} from '../../../../activeTable';
import {DropdownItem} from '../../dropdownItem';
import {OptionButton} from './optionButton';

export class OptionDeleteButton {
  private static readonly DELETE_BUTTON_ICON_CLASS = 'cell-dropdown-option-delete-button-icon';
  private static readonly DELETE_ICON_TEXT = '×';

  private static createIcon() {
    const iconElement = document.createElement('div');
    iconElement.classList.add(OptionDeleteButton.DELETE_BUTTON_ICON_CLASS);
    iconElement.innerText = OptionDeleteButton.DELETE_ICON_TEXT;
    return iconElement;
  }

  private static createButton(at: ActiveTable, columnDetails: ColumnDetailsT) {
    const buttonElement = document.createElement('div');
    buttonElement.classList.add(DropdownItem.DROPDOWN_ITEM_IDENTIFIER, OptionButton.BUTTON_CLASS);
    OptionDeleteButtonEvents.addEvents(at, columnDetails, buttonElement);
    return buttonElement;
  }

  private static createContainer() {
    const containerElement = document.createElement('div');
    containerElement.classList.add(OptionButton.BUTTON_CONTAINER_CLASS);
    return containerElement;
  }

  public static create(at: ActiveTable, columnDetails: ColumnDetailsT) {
    const containerElement = OptionDeleteButton.createContainer();
    const buttonElement = OptionDeleteButton.createButton(at, columnDetails);
    const iconElement = OptionDeleteButton.createIcon();
    buttonElement.appendChild(iconElement);
    containerElement.appendChild(buttonElement);
    return containerElement;
  }

  public static changeVisibility(itemElement: HTMLElement, rightSideDelta: number, displayOnDropdown?: HTMLElement) {
    const buttonContainerElement = itemElement.children[1] as HTMLElement;
    buttonContainerElement.style.display = displayOnDropdown ? 'block' : 'none';
    if (displayOnDropdown) {
      const buttonElement = buttonContainerElement.children[0] as HTMLElement;
      buttonElement.style.left = `${displayOnDropdown.offsetWidth - rightSideDelta}px`;
    }
  }
}
