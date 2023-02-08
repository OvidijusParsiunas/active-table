// TO-DO - checkbox icon should be a button that highlight/unhighlights all select boxes
export class CheckboxElement {
  private static createCheckbox(isCellTextEditable: boolean) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.cursor = isCellTextEditable ? 'pointer' : 'auto';
    checkbox.style.pointerEvents = isCellTextEditable ? '' : 'none';
    return checkbox;
  }

  public static setCellTextAsCheckbox(cellElement: HTMLElement, isCellTextEditable: boolean) {
    const checkbox = CheckboxElement.createCheckbox(isCellTextEditable);
    cellElement.replaceChildren(checkbox);
  }
}
