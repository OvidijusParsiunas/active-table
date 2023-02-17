import {CSVImportButtonEvents} from './CSVImportButtonEvents';
import {CSVButtonProps} from '../../../types/CSVInternal';
import {CSVButtonElement} from '../CSVButtonElement';
import {ActiveTable} from '../../../activeTable';

export class CSVImportButtonElement {
  private static createButtonElement(inputElement: HTMLInputElement, buttonProps: CSVButtonProps) {
    const buttonElement = CSVButtonElement.create(buttonProps);
    CSVImportButtonEvents.setButtonEvents(buttonElement, inputElement);
    return buttonElement;
  }

  private static createInputElement(at: ActiveTable) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.csv';
    inputElement.hidden = true;
    CSVImportButtonEvents.setInputEvents(at, inputElement);
    return inputElement;
  }

  private static createContainer(order: number) {
    const container = document.createElement('div');
    container.style.order = String(order);
    return container;
  }

  public static create(at: ActiveTable, buttonProps: CSVButtonProps) {
    const buttonContainer = CSVImportButtonElement.createContainer(buttonProps.order);
    const inputElement = CSVImportButtonElement.createInputElement(at);
    const buttonElement = CSVImportButtonElement.createButtonElement(inputElement, buttonProps);
    buttonContainer.appendChild(inputElement);
    buttonContainer.appendChild(buttonElement);
    return buttonContainer;
  }
}
