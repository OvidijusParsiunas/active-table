export class CellElementIndex {
  public static getViaColumnIndex(columnIndex: number, displayIndexColumn: boolean) {
    // index column contains one cell and there is no cell divider after it
    const indexColumnNumber = Number(displayIndexColumn);
    // the reason why columnIndex is multiplied by 2 is because there is a divider element after each cell
    return columnIndex * 2 + indexColumnNumber;
  }
}
