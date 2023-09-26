import {SheetJSInternalUtils} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSInternalUtils';
import {SheetJSExport} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSExport';
import {CSVExport} from '../../../../utils/outerTableComponents/files/CSV/CSVExport';
import {ExportOptions, ExportSingleFile} from '../../../../types/files';
import {ACCEPTED_FILE_FORMATS} from '../../../../consts/fileFormats';
import {ActiveTable} from '../../../../activeTable';

export class FileExportEvents {
  public static export(at: ActiveTable, options?: ExportSingleFile) {
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
    const singleFile = options ? {format: options.formats?.[0], fileName: options.fileName} : undefined;
    buttonElement.onclick = FileExportEvents.export.bind(this, at, singleFile);
  }
}
