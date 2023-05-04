import {SheetJSInternalUtils} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSInternalUtils';
import {SheetJSImport} from '../../../../utils/outerTableComponents/files/SheetJS/SheetJSImport';
import {CSVImport} from '../../../../utils/outerTableComponents/files/CSV/CSVImport';
import {FileType, ImportOverwriteOptions} from '../../../../types/files';
import {ALLOWED_FILE_EXTENSIONS} from '../../../../consts/fileTypes';
import {ActiveTable} from '../../../../activeTable';

export class FileImportButtonEvents {
  public static importFile(at: ActiveTable, file: File, acceptedTypes: FileType[], options?: ImportOverwriteOptions) {
    if (acceptedTypes.find((extension) => file.name.endsWith(extension))) {
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
    FileImportButtonEvents.importFile(at, file, ALLOWED_FILE_EXTENSIONS as FileType[], options);
    inputElement.value = ''; // resetting to prevent Chrome issue of not being able to upload same file twice
  }

  public static triggerImportPrompt(at: ActiveTable, acceptedTypes: FileType[], options?: ImportOverwriteOptions) {
    const inputElement = at._files.inputElementRef;
    inputElement.accept = acceptedTypes.map((type) => `.${type}`).join(',');
    inputElement.onchange = FileImportButtonEvents.inputChange.bind(this, at, options);
    inputElement.click();
  }

  // prettier-ignore
  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, acceptedTypes: FileType[],
      overwriteOptions?: ImportOverwriteOptions) {
    buttonElement.onclick = FileImportButtonEvents.triggerImportPrompt.bind(this, at, acceptedTypes, overwriteOptions);
  }
}
