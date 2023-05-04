import {SheetJSInternalUtils} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSInternalUtils';
import {SheetJSExport} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSExport';
import {CSVExport} from '../../../../utils/outerTableComponents/files/CSV/CSVExport';
import {ALLOWED_FILE_EXTENSIONS} from '../../../../consts/fileTypes';
import {ActiveTable} from '../../../../activeTable';
import {FileType} from '../../../../types/files';

export class FileExportButtonEvents {
  public static export(at: ActiveTable, type: FileType, fileName?: string) {
    if (ALLOWED_FILE_EXTENSIONS.find((extension) => type === extension)) {
      if (type === 'csv') {
        CSVExport.export(at, fileName);
      } else SheetJSInternalUtils.execFuncWithExtractorModule(SheetJSExport.export.bind(this, at, type, fileName));
    }
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, type: FileType, fileName?: string) {
    buttonElement.onclick = FileExportButtonEvents.export.bind(this, at, type, fileName);
  }
}
