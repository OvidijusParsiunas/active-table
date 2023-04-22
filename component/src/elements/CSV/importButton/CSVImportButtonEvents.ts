import {CSVImport} from '../../../utils/outerTableComponents/CSV/CSVImport';
import {ImportOverwriteOptions} from '../../../types/CSV';
import {ActiveTable} from '../../../activeTable';

export class CSVImportButtonEvents {
  private static inputChange(at: ActiveTable, options: ImportOverwriteOptions | undefined, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0] as Blob;
    CSVImport.import(at, file, options);
    inputElement.value = ''; // resetting to prevent Chrome issue of not being able to upload same file twice
  }

  public static triggerImportPrompt(at: ActiveTable, options?: ImportOverwriteOptions) {
    const inputElement = at._csv.inputElementRef;
    inputElement.onchange = CSVImportButtonEvents.inputChange.bind(this, at, options);
    inputElement.click();
  }

  public static setButtonEvents(at: ActiveTable, buttonElement: HTMLElement, options?: ImportOverwriteOptions) {
    buttonElement.onclick = CSVImportButtonEvents.triggerImportPrompt.bind(this, at, options);
  }
}
