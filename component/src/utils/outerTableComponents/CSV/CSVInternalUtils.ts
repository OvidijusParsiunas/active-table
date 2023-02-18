import {CSVImportButtonElement} from '../../../elements/CSV/importButton/CSVImportButtonElement';
import {CSVButtonProps, CSVButtonsInternal, CSVInternal} from '../../../types/CSVInternal';
import {ActiveTable} from '../../../activeTable';
import {CSVButtons} from '../../../types/CSV';

export class CSVInternalUtils {
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

  public static process(csvButtons: CSVButtons, _csv: CSVInternal) {
    _csv.buttons = {};
    CSVInternalUtils.setInternalComponent(csvButtons, _csv.buttons, 'import', 'Import CSV');
    CSVInternalUtils.setInternalComponent(csvButtons, _csv.buttons, 'export', 'Export CSV');
  }

  public static createDefault(at: ActiveTable): CSVInternal {
    return {inputElementRef: CSVImportButtonElement.createInputElement(at)};
  }
}