export class RowElement {
  public static create() {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    return rowElement;
  }
}
