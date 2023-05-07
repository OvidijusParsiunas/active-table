import {ActiveTable} from '../../../../activeTable';
import {FileFormat} from '../../../../types/files';
import xlsx from 'xlsx';

export class SheetJSExport {
  private static getFileName(format: FileFormat, fileName?: string) {
    if (fileName) {
      return fileName.endsWith(`.${format}`) ? fileName : `${fileName}.${format}`;
    }
    return `table_data.${format}`;
  }

  // not csv
  public static export(at: ActiveTable, format: FileFormat, fileName: string | undefined, xlsxModule: typeof xlsx) {
    const workbook = xlsxModule.utils.book_new();
    const worksheet = xlsxModule.utils.aoa_to_sheet(at.content);
    xlsxModule.utils.book_append_sheet(workbook, worksheet, 'Sheet');
    const definedFileName = SheetJSExport.getFileName(format, fileName);
    xlsxModule.writeFile(workbook, definedFileName, {bookType: format});
  }
}
