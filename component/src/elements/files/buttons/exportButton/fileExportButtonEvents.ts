import {SheetJSInternalUtils} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSInternalUtils';
import {SheetJSExport} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSExport';
import {CSVExport} from '../../../../utils/outerTableComponents/files/CSV/CSVExport';
import {ACCEPTED_FILE_EXTENSIONS} from '../../../../consts/fileTypes';
import {ExportOptions} from '../../../../types/files';
import {ActiveTable} from '../../../../activeTable';

export class FileExportButtonEvents {
  public static export(at: ActiveTable, options?: ExportOptions) {
    const acceptedType = options?.type || 'csv';
    if (ACCEPTED_FILE_EXTENSIONS.find((extension) => acceptedType === extension)) {
      const fileName = options?.fileName;
      if (acceptedType === 'csv') {
        CSVExport.export(at, fileName);
      } else {
        SheetJSInternalUtils.execFuncWithExtractorModule(SheetJSExport.export.bind(this, at, acceptedType, fileName));
      }
    }
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, options?: ExportOptions) {
    buttonElement.onclick = FileExportButtonEvents.export.bind(this, at, options);
  }
}
