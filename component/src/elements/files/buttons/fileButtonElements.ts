import {OuterContainerElements} from '../../../utils/outerTableComponents/outerContainerElements';
import {FilesUtils} from '../../../utils/outerTableComponents/files/filesInternalUtils';
import {FileExportButtonElement} from './exportButton/button/fileExportButtonElement';
import {FileImportButtonEvents} from './importButton/fileImportButtonEvents';
import {StatefulCSSEvents} from '../../../utils/elements/statefulCSSEvents';
import {FileExportEvents} from './exportButton/fileExportEvents';
import {OuterContainers} from '../../../types/outerContainer';
import {ActiveTable} from '../../../activeTable';
import {FileButton} from '../../../types/files';

export class FileButtonElements {
  private static readonly BUTTON_CLASS = 'file-button';
  private static readonly BUTTON_CONTAINER_CLASS = 'file-button-container';

  private static setEvents(at: ActiveTable, button: FileButton, buttonElement: HTMLElement) {
    if (button.import) {
      FileImportButtonEvents.setEvents(at, buttonElement, typeof button.import === 'object' ? button.import : undefined);
    } else if (button.export) {
      FileExportEvents.setEvents(at, buttonElement, typeof button.export === 'object' ? button.export : undefined);
    }
  }

  // the main reason for this is to display a dropdown
  private static wrapInRelativeContainer(buttonElement: HTMLDivElement) {
    const container = document.createElement('div');
    container.classList.add(FileButtonElements.BUTTON_CONTAINER_CLASS);
    container.appendChild(buttonElement);
    return container;
  }

  private static createElement(buttonProps: FileButton, defaultText: string) {
    const {text, order, styles} = buttonProps;
    const buttonElement = document.createElement('div');
    buttonElement.classList.add(FileButtonElements.BUTTON_CLASS);
    buttonElement.textContent = text || defaultText;
    buttonElement.style.order = String(order || 0);
    const processedStyles = FilesUtils.processStyles(styles);
    Object.assign(buttonElement.style, processedStyles.default);
    setTimeout(() => StatefulCSSEvents.setEvents(buttonElement, processedStyles));
    return buttonElement;
  }

  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    at.files?.buttons?.forEach((button) => {
      if (!button.export && !button.import) return;
      const buttonElement = FileButtonElements.createElement(button, button.import ? 'Import' : 'Export');
      const containerElement = FileButtonElements.wrapInRelativeContainer(buttonElement);
      const exportDropdownFormats = button.export && FileExportButtonElement.getDropdownFormats(button.export);
      if (exportDropdownFormats) {
        FileExportButtonElement.applyDropdown(at, buttonElement, containerElement, exportDropdownFormats, button.export);
      } else {
        setTimeout(() => FileButtonElements.setEvents(at, button, buttonElement));
      }
      const position = button.position || FilesUtils.DEFAULT_BUTTON_POSITION;
      OuterContainerElements.addToContainer(position, outerContainers, containerElement);
    });
  }
}
