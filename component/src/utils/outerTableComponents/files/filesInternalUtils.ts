import {CSVImportButtonElement} from '../../../elements/CSV/importButton/CSVImportButtonElement';
import {FileButton, FileButtonStyles, Files} from '../../../types/files';
import {FilesInternal} from '../../../types/filesInternal';
import {ActiveTable} from '../../../activeTable';

export class FilesInternalUtils {
  private static processStyles(buttonStyles: FileButtonStyles) {
    const styles = {default: {}, hover: {backgroundColor: '#f0f0f0'}, click: {backgroundColor: '#e4e4e4'}};
    if (buttonStyles.styles) {
      Object.assign(styles.default, buttonStyles.styles.default);
      Object.assign(styles.hover, buttonStyles.styles.hover);
      Object.assign(styles.click, buttonStyles.styles.click);
    }
    buttonStyles.styles = styles;
  }

  private static processStylesProps(button: FileButton) {
    FilesInternalUtils.processStyles(button);
    button.position ??= 'bottom-left';
    button.text ??= button.export ? 'Export' : 'Import';
    button.order ??= 0;
  }

  private static processButton(button: FileButton) {
    FilesInternalUtils.processStylesProps(button);
    // WORK - may need to do additional preprocessing here - not sure
  }

  public static process(files: Files) {
    if (files.buttons) {
      files.buttons = files.buttons.filter((button) => button.export || button.import); // removes invalid
      files.buttons.map((button) => FilesInternalUtils.processButton(button));
    }
  }

  public static isDragAndDropDisplayed(files?: Files) {
    if (files) {
      return typeof files.dragAndDrop === 'boolean' ? files.dragAndDrop : true;
    }
    return false;
  }

  public static createDefault(at: ActiveTable): FilesInternal {
    return {inputElementRef: CSVImportButtonElement.createInputElement(at)};
  }
}
