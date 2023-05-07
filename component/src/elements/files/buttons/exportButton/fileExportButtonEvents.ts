import {SheetJSInternalUtils} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSInternalUtils';
import {SheetJSExport} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSExport';
import {CSVExport} from '../../../../utils/outerTableComponents/files/CSV/CSVExport';
import {ACCEPTED_FILE_FORMATS} from '../../../../consts/fileFormats';
import {ExportOptions} from '../../../../types/files';
import {ActiveTable} from '../../../../activeTable';

export class FileExportButtonEvents {
  public static export(at: ActiveTable, options?: ExportOptions) {
    const acceptedFormat = options?.format || 'csv';
    if (ACCEPTED_FILE_FORMATS.find((extension) => acceptedFormat === extension)) {
      const fileName = options?.fileName;
      if (acceptedFormat === 'csv') {
        CSVExport.export(at, fileName);
      } else {
        SheetJSInternalUtils.execFuncWithExtractorModule(SheetJSExport.export.bind(this, at, acceptedFormat, fileName));
      }
    }
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, options?: ExportOptions) {
    buttonElement.onclick = FileExportButtonEvents.export.bind(this, at, options);
  }
}
