import {FileImportButtonEvents} from '../files/buttons/importButton/fileImportButtonEvents';
import {DEFAULT_FILE_EXTENSIONS} from '../../consts/fileTypes';
import {Files, FileType} from '../../types/files';
import {ActiveTable} from '../../activeTable';

export class DragAndDropEvents {
  private static async uploadFile(at: ActiveTable, types: FileType[], event: DragEvent) {
    const file = event.dataTransfer?.files?.[0] as File;
    const options = typeof at.files?.dragAndDrop === 'object' ? at.files.dragAndDrop.overwriteOptions : undefined;
    FileImportButtonEvents.importFile(at, file, types, options);
  }

  private static toggleOverlayElement(overlayElement: HTMLElement, isDisplayed: boolean) {
    overlayElement.style.display = isDisplayed ? 'block' : 'none';
  }

  private static getAcceptedFileTypes(files?: Files) {
    if (typeof files?.dragAndDrop === 'object' && files.dragAndDrop.types) {
      return files.dragAndDrop.types;
    }
    const importButtonTypes = files?.buttons
      ?.filter((button) => button.import)
      .map((button) => {
        return typeof button.import === 'object' && button.import.types ? button.import.types : DEFAULT_FILE_EXTENSIONS;
      })
      .flat(1);
    if (importButtonTypes && importButtonTypes.length > 0) {
      return Array.from(new Set(importButtonTypes)); // makes all array entries unique
    }
    return DEFAULT_FILE_EXTENSIONS;
  }

  public static setEvents(at: ActiveTable, fullTableContainer: HTMLElement, overlayElement: HTMLElement) {
    const types = DragAndDropEvents.getAcceptedFileTypes(at.files) as FileType[];
    fullTableContainer.ondragenter = (event) => {
      event.preventDefault();
      DragAndDropEvents.toggleOverlayElement(overlayElement, true);
    };
    overlayElement.ondragleave = (event) => {
      event.preventDefault();
      DragAndDropEvents.toggleOverlayElement(overlayElement, false);
    };
    overlayElement.ondragover = (event) => {
      event.preventDefault();
    };
    overlayElement.ondrop = (event) => {
      event.preventDefault();
      DragAndDropEvents.uploadFile(at, types, event);
      DragAndDropEvents.toggleOverlayElement(overlayElement, false);
    };
  }
}
