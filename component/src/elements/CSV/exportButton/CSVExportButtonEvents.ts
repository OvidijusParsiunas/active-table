import {CSVExport} from '../../../utils/outerTableComponents/CSV/CSVExport';
import {ActiveTable} from '../../../activeTable';

export class CSVExportButtonEvents {
  private static buttonClick(at: ActiveTable, fileName?: string) {
    CSVExport.export(at, fileName);
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, fileName?: string) {
    buttonElement.onclick = CSVExportButtonEvents.buttonClick.bind(this, at, fileName);
  }
}
