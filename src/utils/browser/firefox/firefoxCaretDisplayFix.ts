import {EditableTableComponent} from '../../../editable-table-component';
import {CaretPosition} from '../../focusedElements/caretPosition';
import {CellElement} from '../../../elements/cell/cellElement';
import {EMPTY_STRING} from '../../../consts/text';

// REF-2
// textContainerElement can be data cell element or text element from a category cell
export class FirefoxCaretDisplayFix {
  private static readonly CONTENT_EDITABLE = 'contenteditable';
  private static readonly TAB_INDEX = 'tabindex';
  private static readonly BR_TAG_NAME = 'BR';

  public static removeContentEditable(textContainerElement: HTMLElement) {
    textContainerElement.removeAttribute(FirefoxCaretDisplayFix.CONTENT_EDITABLE);
  }

  // THIS HAS TO BE CALLED IN A FOCUS EVENT!!!!!!!!!!!!!!!!!
  public static setContentEditable(textContainerElement: HTMLElement) {
    textContainerElement.setAttribute(FirefoxCaretDisplayFix.CONTENT_EDITABLE, 'true');
  }

  public static removeTabIndex(cellElement: HTMLElement) {
    cellElement.removeAttribute(FirefoxCaretDisplayFix.TAB_INDEX);
  }

  public static setTabIndex(textContainerElement: HTMLElement) {
    // allows cells to be focused in firefox
    // the reason why this is not applied in Chrome is because the TAB key does not go to the next cell
    textContainerElement.setAttribute(FirefoxCaretDisplayFix.TAB_INDEX, '0');
  }

  private static removeBRPadding(etc: EditableTableComponent, textContainerElement: HTMLElement) {
    const textElement = CellElement.getTextElement(textContainerElement);
    const firstNode = textElement.childNodes[0] as HTMLElement;
    if (firstNode.tagName === FirefoxCaretDisplayFix.BR_TAG_NAME) {
      firstNode.remove();
      CaretPosition.setToEndOfText(etc, textContainerElement);
    }
  }

  private static addBRPaddingToEmptyCell(textContainerElement: HTMLElement, text: string) {
    const textElement = CellElement.getTextElement(textContainerElement);
    if (text === EMPTY_STRING && textElement.childNodes.length === 0) {
      textElement.appendChild(document.createElement(FirefoxCaretDisplayFix.BR_TAG_NAME));
    }
  }

  // caret is placed too far on top left
  // this happens when cell text is programmatically set to empty or when the user doubeclicks text and clicks backspace
  // natively firefox adds a 'br' element to replace the text when the user deletes it when clicking backspace for each
  // letter however it does not for the cases outlined previously, hence this is needed
  public static toggleCellTextBRPadding(etc: EditableTableComponent, textContainerElement: HTMLElement, isUndo: boolean) {
    const text = CellElement.getText(textContainerElement);
    if (isUndo && text !== EMPTY_STRING) {
      // if the user deletes all text then clicks undo, the <br> element would cause the text to be on a new line
      FirefoxCaretDisplayFix.removeBRPadding(etc, textContainerElement);
    } else {
      FirefoxCaretDisplayFix.addBRPaddingToEmptyCell(textContainerElement, text);
    }
  }
}
