import {XLSInternalUtils} from '../../../../utils/outerTableComponents/XLS/XLSInternalUtils';
import {CSVImport} from '../../../../utils/outerTableComponents/CSV/CSVImport';
import {XLSImport} from '../../../../utils/outerTableComponents/XLS/XLSImport';
import {FileType, ImportOverwriteOptions} from '../../../../types/files';
import {ALLOWED_FILE_EXTENSIONS} from '../../../../consts/fileTypes';
import {ActiveTable} from '../../../../activeTable';

export class FileImportButtonEvents {
  public static importFile(at: ActiveTable, file: File, options?: ImportOverwriteOptions) {
    if (file.name.endsWith('.csv')) {
      CSVImport.import(at, file, options);
    } else if (ALLOWED_FILE_EXTENSIONS.find((extension) => file.name.endsWith(extension))) {
      XLSInternalUtils.execFuncWithExtractorModule(XLSImport.import.bind(this, at, file));
    }
  }

  private static inputChange(at: ActiveTable, options: ImportOverwriteOptions | undefined, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0] as File;
    FileImportButtonEvents.importFile(at, file, options);
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
