import {XLSInternalUtils} from '../../../../utils/outerTableComponents/XLS/XLSInternalUtils';
import {XLSExport} from '../../../../utils/outerTableComponents/XLS/XLSExport';
import {CSVExport} from '../../../../utils/outerTableComponents/CSV/CSVExport';
import {ActiveTable} from '../../../../activeTable';
import {FileType} from '../../../../types/files';

export class FileExportButtonEvents {
  public static export(at: ActiveTable, type: FileType, fileName?: string) {
    if (type === 'xls' || type === 'xlsx') {
      XLSInternalUtils.execFuncWithExtractorModule(XLSExport.export.bind(this, at, type, fileName));
    } else if (type === 'csv') {
      CSVExport.export(at, fileName);
    }
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, type: FileType, fileName?: string) {
    buttonElement.onclick = FileExportButtonEvents.export.bind(this, at, type, fileName);
  }
}
