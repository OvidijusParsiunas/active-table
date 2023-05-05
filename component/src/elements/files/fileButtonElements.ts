import {OuterContainerElements} from '../../utils/outerTableComponents/outerContainerElements';
import {FilesUtils} from '../../utils/outerTableComponents/files/filesInternalUtils';
import {FileImportButtonEvents} from './buttons/importButton/fileImportButtonEvents';
import {FileExportButtonEvents} from './buttons/exportButton/fileExportButtonEvents';
import {OuterContainers} from '../../types/outerContainer';
import {FileButtonEvents} from './fileButtonEvents';
import {ActiveTable} from '../../activeTable';
import {FileButton} from '../../types/files';

export class FileButtonElements {
  private static readonly BUTTON_CLASS = 'file-button';

  private static setEvents(at: ActiveTable, button: FileButton, buttonElement: HTMLElement) {
    if (button.import) {
      FileImportButtonEvents.setEvents(at, buttonElement, typeof button.import === 'object' ? button.import : undefined);
    } else if (button.export) {
      FileExportButtonEvents.setEvents(at, buttonElement, typeof button.export === 'object' ? button.export : undefined);
    }
  }

  private static createElement(buttonProps: FileButton, defaultText: string) {
    const {text, order, styles} = buttonProps;
    const buttonElement = document.createElement('div');
    buttonElement.classList.add(FileButtonElements.BUTTON_CLASS);
    buttonElement.textContent = text || defaultText;
    buttonElement.style.order = String(order || 0);
    const processedStyles = FilesUtils.processStyles(styles);
    Object.assign(buttonElement.style, processedStyles.default);
    setTimeout(() => FileButtonEvents.setStyleEvents(buttonElement, processedStyles));
    return buttonElement;
  }

  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    at.files?.buttons?.forEach((button) => {
      if (!button.export && !button.import) return;
      const buttonElement = FileButtonElements.createElement(button, button.import ? 'Import' : 'Export');
      const position = button.position || FilesUtils.DEFAULT_BUTTON_POSITION;
      OuterContainerElements.addToContainer(position, outerContainers, buttonElement);
      setTimeout(() => FileButtonElements.setEvents(at, button, buttonElement));
    });
  }
}
