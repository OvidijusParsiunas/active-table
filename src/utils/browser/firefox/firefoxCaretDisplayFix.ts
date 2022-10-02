// REF-2
export class FirefoxCaretDisplayFix {
  private static readonly CONTENT_EDITABLE = 'contenteditable';

  public static removeContentEditable(cellElement: HTMLElement) {
    cellElement.removeAttribute(FirefoxCaretDisplayFix.CONTENT_EDITABLE);
  }

  public static setContentEditable(cellElement: HTMLElement, rowIndex: number) {
    if (rowIndex > 0) cellElement.setAttribute(FirefoxCaretDisplayFix.CONTENT_EDITABLE, 'true');
  }

  public static setAttributes(cellElement: HTMLElement, isHeader: boolean) {
    // allows cells to be focused in firefox
    // the reason why this is not applied in Chrome is because the TAB key does not go to the next cell
    if (!isHeader) cellElement.setAttribute('tabindex', '0');
  }

  // caret is placed too far on top left
  // this happens when cell text is programmatically set to empty or when the user doubeclicks text and clicks backspace
  // natively firefox adds a 'br' element to replace the text when the user deletes it when clicking backspace for each
  // letter however it does not for the cases outlined previously, hence this is needed
  public static addPaddingToEmptyCell(cellElement: HTMLElement, text: string) {
    if (text === '' && cellElement.childNodes.length === 0) cellElement.appendChild(document.createElement('br'));
  }
}
