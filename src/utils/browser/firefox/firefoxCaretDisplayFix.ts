// REF-2
// textContainerElement can be data cell element or text element from a category cell
export class FirefoxCaretDisplayFix {
  private static readonly CONTENT_EDITABLE = 'contenteditable';
  private static readonly TAB_INDEX = 'tabindex';

  public static removeContentEditable(textContainerElement: HTMLElement) {
    textContainerElement.removeAttribute(FirefoxCaretDisplayFix.CONTENT_EDITABLE);
  }

  // THIS HAS TO BE CALLED IN A FOCUS EVENT!!!!!!!!!!!!!!!!!
  public static setContentEditable(textContainerElement: HTMLElement, rowIndex: number) {
    if (rowIndex > 0) textContainerElement.setAttribute(FirefoxCaretDisplayFix.CONTENT_EDITABLE, 'true');
  }

  public static removeTabIndex(cellElement: HTMLElement) {
    cellElement.removeAttribute(FirefoxCaretDisplayFix.TAB_INDEX);
  }

  public static setTabIndex(textContainerElement: HTMLElement, isHeader: boolean) {
    // allows cells to be focused in firefox
    // the reason why this is not applied in Chrome is because the TAB key does not go to the next cell
    if (!isHeader) textContainerElement.setAttribute(FirefoxCaretDisplayFix.TAB_INDEX, '0');
  }

  // caret is placed too far on top left
  // this happens when cell text is programmatically set to empty or when the user doubeclicks text and clicks backspace
  // natively firefox adds a 'br' element to replace the text when the user deletes it when clicking backspace for each
  // letter however it does not for the cases outlined previously, hence this is needed
  // prettier-ignore
  public static addPaddingToEmptyCell(textContainerElement: HTMLElement, text: string) {
    if (text === '' && textContainerElement.childNodes.length === 0) {
      textContainerElement.appendChild(document.createElement('br'));
    }
  }
}
