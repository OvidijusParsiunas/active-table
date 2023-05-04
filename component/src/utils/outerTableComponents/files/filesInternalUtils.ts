import {FileImportInputElement} from '../../../elements/files/buttons/importButton/fileImportInputElement';
import {FilesInternal} from '../../../types/filesInternal';
import {StatefulCSS} from '../../../types/cssStyle';
import {ActiveTable} from '../../../activeTable';

export class FilesUtils {
  public static readonly DEFAULT_BUTTON_POSITION = 'bottom-left';

  public static processStyles(buttonStyles?: StatefulCSS) {
    const styles = {default: {}, hover: {backgroundColor: '#f0f0f0'}, click: {backgroundColor: '#e4e4e4'}};
    if (buttonStyles) {
      Object.assign(styles.default, buttonStyles.default);
      Object.assign(styles.hover, buttonStyles.hover);
      Object.assign(styles.click, buttonStyles.click);
    }
    return styles;
  }

  public static createDefault(at: ActiveTable): FilesInternal {
    return {inputElementRef: FileImportInputElement.create(at)};
  }
}
