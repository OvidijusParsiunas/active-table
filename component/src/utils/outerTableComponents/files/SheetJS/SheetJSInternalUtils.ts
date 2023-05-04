import xlsx from 'xlsx';

declare global {
  interface Window {
    XLSX: typeof xlsx;
  }
}

export class SheetJSInternalUtils {
  private static MODULE_NOT_FOUND_ERROR = 'xlsx module was not found';

  private static async getExtractorModule() {
    let xlsxModule: typeof xlsx | undefined;
    if (window.XLSX) {
      // imported via a script
      xlsxModule = window.XLSX;
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
    const xlsxModule = await SheetJSInternalUtils.getExtractorModule();
    if (!xlsxModule) {
      console.error(SheetJSInternalUtils.MODULE_NOT_FOUND_ERROR);
    } else {
      func(xlsxModule);
    }
  }
}
