import {CSVImport} from '../../../utils/outerTableComponents/CSV/CSVImport';
import {ImportOverwriteOptions} from '../../../types/CSV';
import {ActiveTable} from '../../../activeTable';

export class CSVImportButtonEvents {
  private static inputChange(at: ActiveTable, options: ImportOverwriteOptions | undefined, event: Event) {
    CSVImport.import(at, event.target as HTMLInputElement, options);
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
