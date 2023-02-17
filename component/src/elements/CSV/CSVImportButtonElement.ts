import {CSVImport} from '../../utils/outerTableComponents/CSV/CSVImport';
import {CSVButtonProps} from '../../types/CSVInternal';
import {CSVButtonElement} from './CSVButtonElement';
import {CSVButtonEvents} from './CSVButtonEvents';
import {ActiveTable} from '../../activeTable';

export class CSVImportButtonElement {
  private static createButtonElement(inputElement: HTMLInputElement, buttonProps: CSVButtonProps) {
    const buttonElement = CSVButtonElement.create(buttonProps);
    buttonElement.onclick = CSVButtonEvents.clickInputElement.bind(this, inputElement);
    return buttonElement;
  }

  private static createInputElement(at: ActiveTable) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.csv';
    inputElement.hidden = true;
    inputElement.onchange = CSVImport.import.bind(this, at);
    return inputElement;
  }

  private static createContainer(order: number) {
    const container = document.createElement('div');
    container.style.order = String(order);
    return container;
  }

  public static create(at: ActiveTable, importComponent: CSVButtonProps) {
    const buttonContainer = CSVImportButtonElement.createContainer(importComponent.order);
    const inputElement = CSVImportButtonElement.createInputElement(at);
    const buttonElement = CSVImportButtonElement.createButtonElement(inputElement, importComponent);
    buttonContainer.appendChild(inputElement);
    buttonContainer.appendChild(buttonElement);
    return buttonContainer;
  }
}
