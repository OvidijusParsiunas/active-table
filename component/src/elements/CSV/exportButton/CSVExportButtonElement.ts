import {CSVExportButtonEvents} from './CSVExportButtonEvents';
import {CSVButtonProps} from '../../../types/CSVInternal';
import {CSVButtonElement} from '../CSVButtonElement';
import {ActiveTable} from '../../../activeTable';

export class CSVExportButtonElement {
  public static create(at: ActiveTable, buttonProps: CSVButtonProps) {
    const buttonElement = CSVButtonElement.create(buttonProps);
    setTimeout(() => CSVExportButtonEvents.setEvents(at, buttonElement));
    return buttonElement;
  }
}
