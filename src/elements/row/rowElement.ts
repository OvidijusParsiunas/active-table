export class RowElement {
  public static create() {
    const rowElement = document.createElement('tr');
    rowElement.classList.add('row');
    return rowElement;
  }
}
