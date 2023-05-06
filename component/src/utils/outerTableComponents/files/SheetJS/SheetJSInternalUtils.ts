import xlsx from 'xlsx';

declare global {
  interface Window {
    XLSX: typeof xlsx;
  }
}

export class SheetJSInternalUtils {
  private static MODULE_NOT_FOUND_ERROR = 'xlsx module was not found';

  // REF-17
  public static async execFuncWithExtractorModule(func: (xlsxModule: typeof xlsx) => void) {
    const xlsxModule = window.XLSX;
    if (!xlsxModule) {
      console.error(SheetJSInternalUtils.MODULE_NOT_FOUND_ERROR);
    } else {
      func(xlsxModule);
    }
  }
}
