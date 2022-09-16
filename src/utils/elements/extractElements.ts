export class ExtractElements {
  public static dataCellsArrFromRow(rowElement: HTMLElement) {
    return Array.from(rowElement.children).filter((child) => child.tagName === 'TD');
  }
}
