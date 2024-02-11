import {OuterContainerElements} from '../outerContainerElements';
import {ActiveTable} from '../../../activeTable';

export class ErrorElement {
  public static create() {
    const containerElement = document.createElement('div');
    containerElement.id = 'error-container';
    containerElement.classList.add(OuterContainerElements.ABSOULUTE_FULL_TABLE_CLASS);
    const textElement = document.createElement('div');
    textElement.id = 'error-text';
    textElement.innerHTML = 'Error retrieving data';
    containerElement.appendChild(textElement);
    return containerElement;
  }

  public static display(at: ActiveTable) {
    const {error} = at._activeOverlayElements;
    if (error) at._tableElementRef?.appendChild(error);
  }

  public static remove(at: ActiveTable) {
    at._activeOverlayElements.error?.remove();
  }
}
