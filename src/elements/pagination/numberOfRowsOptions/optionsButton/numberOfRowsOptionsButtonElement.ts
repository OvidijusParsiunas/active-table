import {EditableTableComponent} from '../../../../editable-table-component';
import {Browser} from '../../../../utils/browser/browser';
import {NumberOfRowsOptionsButtonEvents} from './numberOfRowsOptionsButtonEvents';

export class NumberOfRowsOptionsButtonElement {
  private static readonly BUTTON_ID = 'pagination-of-rows-options-button';
  private static readonly ARROW_ID = 'pagination-of-rows-options-button-arrow';
  private static readonly TEXT_ID = 'pagination-of-rows-options-button-text';

  private static createButtonArrow() {
    const arrow = document.createElement('div');
    arrow.id = NumberOfRowsOptionsButtonElement.ARROW_ID;
    if (Browser.IS_FIREFOX) {
      arrow.style.transform = 'translateY(-8%) scaleX(1.4)';
      arrow.style.fontSize = '14px';
      arrow.style.marginLeft = '5px';
    } else {
      arrow.style.transform = 'translateY(-16%)';
      arrow.style.fontSize = '15px';
      arrow.style.marginLeft = '4px';
    }
    arrow.innerHTML = '&#8964';
    return arrow;
  }

  public static updateButtonText(optionsButton: HTMLElement, numberOfRows: string) {
    const text = optionsButton.children[0] as HTMLElement;
    text.innerText = numberOfRows;
  }

  private static createButtonText() {
    const text = document.createElement('div');
    text.id = NumberOfRowsOptionsButtonElement.TEXT_ID;
    return text;
  }

  private static createOptionsButton() {
    const optionsButton = document.createElement('div');
    optionsButton.style.padding = Browser.IS_CHROMIUM ? '1px 5px' : '1px 6px';
    optionsButton.id = NumberOfRowsOptionsButtonElement.BUTTON_ID;
    return optionsButton;
  }

  public static create(etc: EditableTableComponent) {
    const optionsButton = NumberOfRowsOptionsButtonElement.createOptionsButton();
    optionsButton.appendChild(NumberOfRowsOptionsButtonElement.createButtonText());
    NumberOfRowsOptionsButtonElement.updateButtonText(optionsButton, String(etc.paginationInternal.numberOfRows));
    optionsButton.appendChild(NumberOfRowsOptionsButtonElement.createButtonArrow());
    NumberOfRowsOptionsButtonEvents.setEvents(etc, optionsButton);
    return optionsButton;
  }
}
