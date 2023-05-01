import {ActiveTable} from '../../../activeTable';
import {CSVImport} from '../CSV/CSVImport';
import xlsx from 'xlsx';

export class XLSImport {
  public static import(at: ActiveTable, file: File, xlsxModule: typeof xlsx) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      const workbook = xlsxModule.read(event.target?.result, {type: 'binary'});
      workbook.SheetNames.forEach((sheetName) => {
        const csvText = xlsxModule.utils.sheet_to_csv(workbook.Sheets[sheetName]) as string;
        CSVImport.processFile(at, csvText);
      });
    };
  }
}
