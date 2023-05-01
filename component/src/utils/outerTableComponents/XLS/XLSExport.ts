import {ActiveTable} from '../../../activeTable';
import xlsx from 'xlsx';

export class XLSExport {
  private static getFileName(isXLS: boolean, fileName?: string) {
    return fileName || (isXLS ? 'table_data.xls' : 'table_data.xlsx');
  }

  // is xls or xlsx
  public static export(at: ActiveTable, isXLS: boolean, fileName: string | undefined, xlsxModule: typeof xlsx) {
    const workbook = xlsxModule.utils.book_new();
    const worksheet = xlsxModule.utils.aoa_to_sheet(at.content);
    xlsxModule.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const definedFileName = XLSExport.getFileName(isXLS, fileName);
    xlsxModule.writeFile(workbook, definedFileName);
  }
}
