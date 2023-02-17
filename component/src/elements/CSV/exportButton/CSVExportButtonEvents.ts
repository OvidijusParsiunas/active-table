import {CSVExport} from '../../../utils/outerTableComponents/CSV/CSVExport';
import {ActiveTable} from '../../../activeTable';

export class CSVExportButtonEvents {
  private static buttonClick(at: ActiveTable) {
    CSVExport.export(at);
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement) {
    buttonElement.onclick = CSVExportButtonEvents.buttonClick.bind(this, at);
  }
}
