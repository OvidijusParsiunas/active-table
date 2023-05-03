import {FileImportButtonEvents} from '../files/buttons/importButton/fileImportButtonEvents';
import {ActiveTable} from '../../activeTable';

export class DragAndDropEvents {
  private static async uploadFile(at: ActiveTable, event: DragEvent) {
    const file = event.dataTransfer?.files?.[0] as File;
    const options = typeof at.csv?.dragAndDrop === 'object' ? at.csv.dragAndDrop.overwriteOptions : undefined;
    FileImportButtonEvents.importFile(at, file, options);
  }

  private static toggleOverlayElement(overlayElement: HTMLElement, isDisplayed: boolean) {
    overlayElement.style.display = isDisplayed ? 'block' : 'none';
  }

  public static setEvents(at: ActiveTable, fullTableContainer: HTMLElement, overlayElement: HTMLElement) {
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
      DragAndDropEvents.uploadFile(at, event);
      DragAndDropEvents.toggleOverlayElement(overlayElement, false);
    };
  }
}
