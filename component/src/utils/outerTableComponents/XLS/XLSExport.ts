import {ActiveTable} from '../../../activeTable';
import {FileType} from '../../../types/files';
import xlsx from 'xlsx';

export class XLSExport {
  private static getFileName(type: FileType, fileName?: string) {
    if (fileName) {
      return fileName.endsWith(`.${type}`) ? fileName : `${fileName}.${type}`;
    }
    return `table_data.${type}`;
  }

  // for xls or xlsx
  public static export(at: ActiveTable, type: FileType, fileName: string | undefined, xlsxModule: typeof xlsx) {
    const workbook = xlsxModule.utils.book_new();
    const worksheet = xlsxModule.utils.aoa_to_sheet(at.content);
    console.log(at.content);
    xlsxModule.utils.book_append_sheet(workbook, worksheet, 'Sheet');
    const definedFileName = XLSExport.getFileName(type, fileName);
    xlsxModule.writeFile(workbook, definedFileName, {bookType: type});
  }
}
