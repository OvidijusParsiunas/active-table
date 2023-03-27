import {ExportCSVButtonProps} from '../../../types/CSVInternal';
import {CSVExportButtonEvents} from './CSVExportButtonEvents';
import {CSVButtonElement} from '../CSVButtonElement';
import {ActiveTable} from '../../../activeTable';

export class CSVExportButtonElement {
  public static create(at: ActiveTable, buttonProps: ExportCSVButtonProps) {
    const buttonElement = CSVButtonElement.create(buttonProps);
    setTimeout(() => CSVExportButtonEvents.setEvents(at, buttonElement, buttonProps.fileName));
    return buttonElement;
  }
}
