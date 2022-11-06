export class UpdateRowElement {
  // this is required in order to allow the divider and all its elements to inherit its height
  // it is also more efficient than updating each divider height incremenentally
  public static updateHeaderRowHeight(rowElement: HTMLElement) {
    rowElement.style.height = `${rowElement.offsetHeight}px`;
  }
}
