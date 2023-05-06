import {SheetJSInternalUtils} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSInternalUtils';
import {SheetJSImport} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSImport';
import {ACCEPTED_FILE_EXTENSIONS, DEFAULT_FILE_EXTENSIONS} from '../../../../consts/fileTypes';
import {FileType, ImportOptions, ImportOverwriteOptions} from '../../../../types/files';
import {CSVImport} from '../../../../utils/outerTableComponents/files/CSV/CSVImport';
import {ActiveTable} from '../../../../activeTable';

export class FileImportButtonEvents {
  public static importFile(at: ActiveTable, file: File, types: FileType[], options?: ImportOverwriteOptions) {
    if (types.find((extension) => file.name.endsWith(extension))) {
      if (file.name.endsWith('.csv')) {
        CSVImport.import(at, file, options);
      } else {
        SheetJSInternalUtils.execFuncWithExtractorModule(SheetJSImport.import.bind(this, at, file));
      }
    }
  }

  private static inputChange(at: ActiveTable, options: ImportOverwriteOptions | undefined, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0] as File;
    FileImportButtonEvents.importFile(at, file, ACCEPTED_FILE_EXTENSIONS as FileType[], options);
    inputElement.value = ''; // resetting to prevent Chrome issue of not being able to upload same file twice
  }

  private static getAcceptedTypes(importOptions?: ImportOptions) {
    return importOptions?.types && importOptions.types.length > 0 ? importOptions.types : DEFAULT_FILE_EXTENSIONS;
  }

  public static triggerImportPrompt(at: ActiveTable, importOptions?: ImportOptions) {
    const inputElement = at._files.inputElementRef;
    const acceptedTypes = FileImportButtonEvents.getAcceptedTypes(importOptions);
    inputElement.accept = acceptedTypes.map((type) => `.${type}`).join(',');
    inputElement.onchange = FileImportButtonEvents.inputChange.bind(this, at, importOptions?.overwriteOptions);
    inputElement.click();
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, importOptions?: ImportOptions) {
    buttonElement.onclick = FileImportButtonEvents.triggerImportPrompt.bind(this, at, importOptions);
  }
}
