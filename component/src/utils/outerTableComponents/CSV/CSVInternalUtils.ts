import {CSVImportButtonElement} from '../../../elements/CSV/importButton/CSVImportButtonElement';
import {CSVButtonProps, CSVButtonsInternal, CSVInternal} from '../../../types/CSVInternal';
import {CSV, CSVButtons} from '../../../types/CSV';
import {ActiveTable} from '../../../activeTable';

export class CSVInternalUtils {
  private static setImportOverwriteOptions(csvButtons: CSVButtons, _csvButtons: CSVButtonsInternal) {
    if (typeof csvButtons.import === 'object' && csvButtons.import.overwriteOptions && _csvButtons.import) {
      _csvButtons.import.overwriteOptions = csvButtons.import.overwriteOptions;
    }
  }

  private static setCustomExportFileName(csvButtons: CSVButtons, _csvButtons: CSVButtonsInternal) {
    if (typeof csvButtons.export === 'object' && csvButtons.export.fileName && _csvButtons.export) {
      _csvButtons.export.fileName = csvButtons.export.fileName;
    }
  }

  private static getDefaultProperties(defaultText: string): CSVButtonProps {
    return {
      styles: {default: {}, hover: {backgroundColor: '#f0f0f0'}, click: {backgroundColor: '#e4e4e4'}},
      position: 'bottom-left',
      text: defaultText,
      order: 0,
    };
  }

  // prettier-ignore
  private static setInternalComponent(csvButtons: CSVButtons,
      _csvButtons: CSVButtonsInternal, componentName: keyof CSVButtons, defaultText: string) {
    const clientComponent = csvButtons[componentName];
    if (!clientComponent) return;
    const internalComponent = CSVInternalUtils.getDefaultProperties(defaultText);
    _csvButtons[componentName] = internalComponent;
    if (typeof clientComponent === 'boolean') return;
    if (clientComponent.position) internalComponent.position = clientComponent.position;
    if (clientComponent.text) internalComponent.text = clientComponent.text;
    if (clientComponent.styles) {
      Object.assign(internalComponent.styles.default, clientComponent.styles.default);
      Object.assign(internalComponent.styles.hover, clientComponent.styles.hover);
      Object.assign(internalComponent.styles.click, clientComponent.styles.click);
    }
  }

  public static processButtons(csvButtons: CSVButtons, _csv: CSVInternal) {
    _csv.buttons = {};
    CSVInternalUtils.setInternalComponent(csvButtons, _csv.buttons, 'import', 'Import');
    CSVInternalUtils.setInternalComponent(csvButtons, _csv.buttons, 'export', 'Export');
    CSVInternalUtils.setCustomExportFileName(csvButtons, _csv.buttons);
    CSVInternalUtils.setImportOverwriteOptions(csvButtons, _csv.buttons);
  }

  public static isDragAndDropDisplayed(csv?: CSV) {
    if (csv) {
      return typeof csv.dragAndDrop === 'boolean' ? csv.dragAndDrop : true;
    }
    return false;
  }

  public static createDefault(at: ActiveTable): CSVInternal {
    return {inputElementRef: CSVImportButtonElement.createInputElement(at)};
  }
}
