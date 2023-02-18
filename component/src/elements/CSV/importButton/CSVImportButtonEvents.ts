import {CSVImport} from '../../../utils/outerTableComponents/CSV/CSVImport';
import {ActiveTable} from '../../../activeTable';

export class CSVImportButtonEvents {
  private static inputChange(at: ActiveTable, event: Event) {
    CSVImport.import(at, event);
  }

  public static setInputEvents(at: ActiveTable, inputElement: HTMLInputElement) {
    inputElement.onchange = CSVImportButtonEvents.inputChange.bind(this, at);
  }

  public static triggerImportPrompt(inputElement: HTMLInputElement) {
    inputElement.click();
  }

  public static setButtonEvents(buttonElement: HTMLElement, inputElement: HTMLInputElement) {
    buttonElement.onclick = CSVImportButtonEvents.triggerImportPrompt.bind(this, inputElement);
  }
}
