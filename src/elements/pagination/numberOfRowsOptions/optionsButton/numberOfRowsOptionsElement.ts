import {EditableTableComponent} from '../../../../editable-table-component';
import {NumberOfRowsOptionsEvents} from './numberOfRowsOptionsEvents';

export class NumberOfRowsOptionsElement {
  private static readonly BUTTON_ID = 'pagination-of-rows-options-button';
  private static readonly ARROW_ID = 'pagination-of-rows-options-button-arrow';
  private static readonly TEXT_ID = 'pagination-of-rows-options-button-text';

  private static createButtonArrow() {
    const arrow = document.createElement('div');
    arrow.id = NumberOfRowsOptionsElement.ARROW_ID;
    arrow.innerHTML = '&#8964';
    return arrow;
  }

  public static updateButtonText(optionsButton: HTMLElement, numberOfRows: string) {
    const text = optionsButton.children[0] as HTMLElement;
    text.innerText = numberOfRows;
  }

  private static createButtonText() {
    const text = document.createElement('div');
    text.id = NumberOfRowsOptionsElement.TEXT_ID;
    return text;
  }

  private static createOptionsButton() {
    const optionsButton = document.createElement('div');
    optionsButton.id = NumberOfRowsOptionsElement.BUTTON_ID;
    return optionsButton;
  }

  public static create(etc: EditableTableComponent) {
    const optionsButton = NumberOfRowsOptionsElement.createOptionsButton();
    optionsButton.appendChild(NumberOfRowsOptionsElement.createButtonText());
    NumberOfRowsOptionsElement.updateButtonText(optionsButton, String(etc.paginationInternal.numberOfRows));
    optionsButton.appendChild(NumberOfRowsOptionsElement.createButtonArrow());
    NumberOfRowsOptionsEvents.setEvents(etc, optionsButton);
    return optionsButton;
  }
}
