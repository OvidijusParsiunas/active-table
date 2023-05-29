import {SheetJSInternalUtils} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSInternalUtils';
import {FilterInternalUtils} from '../../../../utils/outerTableComponents/filter/filterInternalUtils';
import {SheetJSImport} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSImport';
import {ACCEPTED_FILE_FORMATS, DEFAULT_FILE_FORMATS} from '../../../../consts/fileFormats';
import {FileFormat, ImportOptions, ImportOverwriteOptions} from '../../../../types/files';
import {CSVImport} from '../../../../utils/outerTableComponents/files/CSV/CSVImport';
import {ActiveTable} from '../../../../activeTable';

export class FileImportButtonEvents {
  public static importFile(at: ActiveTable, file: File, formats: FileFormat[], options?: ImportOverwriteOptions) {
    if (formats.find((extension) => file.name.endsWith(extension))) {
      if (file.name.endsWith('.csv')) {
        CSVImport.import(at, file, options);
      } else {
        SheetJSInternalUtils.execFuncWithExtractorModule(SheetJSImport.import.bind(this, at, file));
      }
      // in a timeout as at.shadowRoot.contains does not work immediately
      setTimeout(() => FilterInternalUtils.completeReset(at), 6);
    }
  }

  private static inputChange(at: ActiveTable, options: ImportOverwriteOptions | undefined, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0] as File;
    FileImportButtonEvents.importFile(at, file, ACCEPTED_FILE_FORMATS as FileFormat[], options);
    inputElement.value = ''; // resetting to prevent Chrome issue of not being able to upload same file twice
  }

  private static getAcceptedFormats(importOptions?: ImportOptions) {
    return importOptions?.formats && importOptions.formats.length > 0 ? importOptions.formats : DEFAULT_FILE_FORMATS;
  }

  public static triggerImportPrompt(at: ActiveTable, importOptions?: ImportOptions) {
    const inputElement = at._files.inputElementRef;
    const acceptedFormats = FileImportButtonEvents.getAcceptedFormats(importOptions);
    inputElement.accept = acceptedFormats.map((format) => `.${format}`).join(',');
    inputElement.onchange = FileImportButtonEvents.inputChange.bind(this, at, importOptions?.overwriteOptions);
    inputElement.click();
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, importOptions?: ImportOptions) {
    buttonElement.onclick = FileImportButtonEvents.triggerImportPrompt.bind(this, at, importOptions);
  }
}
