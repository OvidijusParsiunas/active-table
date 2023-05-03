import {CSVImport} from '../../../../utils/outerTableComponents/CSV/CSVImport';
import {ImportOverwriteOptions} from '../../../../types/files';
import {ActiveTable} from '../../../../activeTable';

export class FileImportButtonEvents {
  private static inputChange(at: ActiveTable, options: ImportOverwriteOptions | undefined, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0] as Blob;
    CSVImport.import(at, file, options); // WORK - set importable
    inputElement.value = ''; // resetting to prevent Chrome issue of not being able to upload same file twice
  }

  public static triggerImportPrompt(at: ActiveTable, options?: ImportOverwriteOptions) {
    const inputElement = at._files.inputElementRef;
    inputElement.onchange = FileImportButtonEvents.inputChange.bind(this, at, options);
    inputElement.click();
  }

  public static setButtonEvents(at: ActiveTable, buttonElement: HTMLElement, options?: ImportOverwriteOptions) {
    buttonElement.onclick = FileImportButtonEvents.triggerImportPrompt.bind(this, at, options);
  }
}
