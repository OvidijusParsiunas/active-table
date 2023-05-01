import xlsx from 'xlsx';

declare const XLSX: typeof xlsx;

export class XLSInternalUtils {
  private static MODULE_NOT_FOUND_ERROR = 'xlsx module was not found';

  private static async getExtractorModule() {
    let xlsxModule: typeof xlsx | undefined;
    if (XLSX) {
      // imported via a script
      xlsxModule = XLSX;
    } else {
      // imported via a module
      try {
        const pathPadding = '';
        xlsxModule = await import('xlsx' + pathPadding);
      } catch (err) {
        console.error(err);
      }
    }
    return xlsxModule;
  }

  public static async execFuncWithExtractorModule(func: (xlsxModule: typeof xlsx) => void) {
    const xlsxModule = await XLSInternalUtils.getExtractorModule();
    if (!xlsxModule) {
      console.error(XLSInternalUtils.MODULE_NOT_FOUND_ERROR);
    } else {
      func(xlsxModule);
    }
  }
}
