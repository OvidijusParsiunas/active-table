import {ActiveTable} from '../../../../activeTable';

export class FileImportInputElement {
  // always created as the user may want to trigger the importCSV method without the CSV buttons and need this to work
  public static create(at: ActiveTable) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.csv'; // WORK - change here
    inputElement.hidden = true;
    setTimeout(() => {
      at._tableElementRef?.appendChild(inputElement);
    });
    return inputElement;
  }
}
