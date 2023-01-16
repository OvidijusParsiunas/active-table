export class CellDividerElement {
  public static create() {
    const cellDividerElement = document.createElement('div');
    cellDividerElement.classList.add('cell-divider');
    return cellDividerElement;
  }
}
