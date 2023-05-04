import {XLSInternalUtils} from '../../../../utils/outerTableComponents/XLS/XLSInternalUtils';
import {XLSExport} from '../../../../utils/outerTableComponents/XLS/XLSExport';
import {CSVExport} from '../../../../utils/outerTableComponents/CSV/CSVExport';
import {ALLOWED_FILE_EXTENSIONS} from '../../../../consts/fileTypes';
import {ActiveTable} from '../../../../activeTable';
import {FileType} from '../../../../types/files';

export class FileExportButtonEvents {
  public static export(at: ActiveTable, type: FileType, fileName?: string) {
    if (type === 'csv') {
      CSVExport.export(at, fileName);
    } else if (ALLOWED_FILE_EXTENSIONS.find((extension) => type === extension)) {
      XLSInternalUtils.execFuncWithExtractorModule(XLSExport.export.bind(this, at, type, fileName));
    }
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, type: FileType, fileName?: string) {
    buttonElement.onclick = FileExportButtonEvents.export.bind(this, at, type, fileName);
  }
}
