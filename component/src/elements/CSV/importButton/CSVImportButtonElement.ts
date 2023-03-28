import {ImportCSVButtonProps} from '../../../types/CSVInternal';
import {CSVImportButtonEvents} from './CSVImportButtonEvents';
import {CSVButtonElement} from '../CSVButtonElement';
import {ActiveTable} from '../../../activeTable';

export class CSVImportButtonElement {
  // always created as the user may want to trigger the importCSV method without the CSV buttons and need this to work
  public static createInputElement(at: ActiveTable) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.csv';
    inputElement.hidden = true;
    setTimeout(() => {
      at._tableElementRef?.appendChild(inputElement);
    });
    return inputElement;
  }

  public static create(at: ActiveTable, buttonProps: ImportCSVButtonProps) {
    const buttonElement = CSVButtonElement.create(buttonProps);
    setTimeout(() => CSVImportButtonEvents.setButtonEvents(at, buttonElement, buttonProps.overwriteOptions));
    return buttonElement;
  }
}
