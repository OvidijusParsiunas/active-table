import {FileImportButtonEvents} from '../files/buttons/importButton/fileImportButtonEvents';
import {ALLOWED_FILE_EXTENSIONS} from '../../consts/fileTypes';
import {Files, FileType} from '../../types/files';
import {ActiveTable} from '../../activeTable';

export class DragAndDropEvents {
  private static async uploadFile(at: ActiveTable, acceptedTypes: FileType[], event: DragEvent) {
    const file = event.dataTransfer?.files?.[0] as File;
    const options = typeof at.csv?.dragAndDrop === 'object' ? at.csv.dragAndDrop.overwriteOptions : undefined;
    FileImportButtonEvents.importFile(at, file, acceptedTypes, options);
  }

  private static toggleOverlayElement(overlayElement: HTMLElement, isDisplayed: boolean) {
    overlayElement.style.display = isDisplayed ? 'block' : 'none';
  }

  private static getAcceptedFileTypes(files?: Files) {
    if (typeof files?.dragAndDrop === 'object' && files.dragAndDrop.acceptedTypes) {
      return files.dragAndDrop.acceptedTypes;
    }
    const importButtonTypes = files?.buttons
      ?.filter((button) => button.import)
      .map((button) => button.import?.acceptedTypes)
      .flat(1);
    if (importButtonTypes && importButtonTypes.length > 0) {
      return importButtonTypes;
    }
    return ALLOWED_FILE_EXTENSIONS;
  }

  public static setEvents(at: ActiveTable, fullTableContainer: HTMLElement, overlayElement: HTMLElement) {
    const acceptedTypes = DragAndDropEvents.getAcceptedFileTypes(at.files) as FileType[];
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
      DragAndDropEvents.uploadFile(at, acceptedTypes, event);
      DragAndDropEvents.toggleOverlayElement(overlayElement, false);
    };
  }
}
