import {CSVImportButtonEvents} from './CSVImportButtonEvents';
import {CSVButtonProps} from '../../../types/CSVInternal';
import {CSVButtonElement} from '../CSVButtonElement';
import {ActiveTable} from '../../../activeTable';

export class CSVImportButtonElement {
  // created separately as the user may want to trigger the importCSV component method without the CSV buttons
  public static createInputElement(at: ActiveTable) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.csv';
    inputElement.hidden = true;
    setTimeout(() => {
      CSVImportButtonEvents.setInputEvents(at, inputElement);
      at._tableElementRef?.appendChild(inputElement);
    });
    return inputElement;
  }

  public static create(at: ActiveTable, buttonProps: CSVButtonProps) {
    const inputElement = at._csv.inputElementRef;
    const buttonElement = CSVButtonElement.create(buttonProps);
    setTimeout(() => CSVImportButtonEvents.setButtonEvents(buttonElement, inputElement));
    return buttonElement;
  }
}
