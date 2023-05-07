import {FileImportButtonEvents} from '../buttons/importButton/fileImportButtonEvents';
import {DEFAULT_FILE_FORMATS} from '../../../consts/fileFormats';
import {Files, FileFormat} from '../../../types/files';
import {ActiveTable} from '../../../activeTable';

export class DragAndDropEvents {
  private static async uploadFile(at: ActiveTable, formats: FileFormat[], event: DragEvent) {
    const file = event.dataTransfer?.files?.[0] as File;
    const options = typeof at.files?.dragAndDrop === 'object' ? at.files.dragAndDrop.overwriteOptions : undefined;
    FileImportButtonEvents.importFile(at, file, formats, options);
  }

  private static toggleOverlayElement(overlayElement: HTMLElement, isDisplayed: boolean) {
    overlayElement.style.display = isDisplayed ? 'block' : 'none';
  }

  private static getAcceptedFileFormats(files?: Files) {
    if (typeof files?.dragAndDrop === 'object' && files.dragAndDrop.formats) {
      return files.dragAndDrop.formats;
    }
    const importButtonFormats = files?.buttons
      ?.filter((button) => button.import)
      .map((button) => {
        return typeof button.import === 'object' && button.import.formats ? button.import.formats : DEFAULT_FILE_FORMATS;
      })
      .flat(1);
    if (importButtonFormats && importButtonFormats.length > 0) {
      return Array.from(new Set(importButtonFormats)); // makes all array entries unique
    }
    return DEFAULT_FILE_FORMATS;
  }

  public static setEvents(at: ActiveTable, fullTableContainer: HTMLElement, overlayElement: HTMLElement) {
    const formats = DragAndDropEvents.getAcceptedFileFormats(at.files) as FileFormat[];
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
      DragAndDropEvents.uploadFile(at, formats, event);
      DragAndDropEvents.toggleOverlayElement(overlayElement, false);
    };
  }
}
