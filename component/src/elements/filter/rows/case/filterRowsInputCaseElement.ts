import {FilterRowsInputCaseEvents} from './filterRowsInputCaseEvents';
import {FilterRowsElements} from '../filterRowsElements';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInputCaseElement {
  private static createButton() {
    const caseButton = document.createElement('div');
    caseButton.classList.add('filter-rows-case-button', FilterRowsElements.ICON_BUTTON_CLASS);
    caseButton.textContent = 'Aa';
    return caseButton;
  }

  public static create(at: ActiveTable, inputElement: HTMLInputElement, containerElement: HTMLElement, colIndex: number) {
    const buttonElement = FilterRowsInputCaseElement.createButton();
    containerElement.appendChild(buttonElement);
    setTimeout(() => FilterRowsInputCaseEvents.setEvents(at, inputElement, buttonElement, colIndex));
  }
}
