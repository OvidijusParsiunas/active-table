// REF-2
export class FirefoxCaretDisplayFix {
  private static readonly CONTENT_EDITABLE = 'contenteditable';

  public static blurCell(cellElement: HTMLElement) {
    cellElement.removeAttribute(FirefoxCaretDisplayFix.CONTENT_EDITABLE);
  }

  public static focusCell(cellElement: HTMLElement, rowIndex: number) {
    if (rowIndex > 0) cellElement.setAttribute(FirefoxCaretDisplayFix.CONTENT_EDITABLE, 'true');
  }

  public static setAttributes(cellElement: HTMLElement, isHeader: boolean) {
    // allows cells to be focused in firefox
    // the reason why this is not applied in Chrome is because the TAB key does not go to the next cell
    if (!isHeader) cellElement.setAttribute('tabindex', '0');
  }
}
