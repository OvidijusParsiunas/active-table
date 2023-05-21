import {FilterInputCaseEvents} from './filterInputCaseEvents';
import {ActiveTable} from '../../activeTable';

export class FilterInputCaseElement {
  private static createButton() {
    const caseButton = document.createElement('div');
    caseButton.classList.add('row-filter-case-button');
    caseButton.textContent = 'Aa';
    return caseButton;
  }

  public static create(at: ActiveTable, inputElement: HTMLInputElement, containerElement: HTMLElement, colIndex: number) {
    const buttonElement = FilterInputCaseElement.createButton();
    inputElement.classList.add('row-filter-input-with-case');
    containerElement.appendChild(buttonElement);
    setTimeout(() => FilterInputCaseEvents.setEvents(at, inputElement, buttonElement, colIndex));
  }
}
