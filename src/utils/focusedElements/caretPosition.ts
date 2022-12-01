import {EditableTableComponent} from '../../editable-table-component';

export class CaretPosition {
  private static setSelectionToEndOfText(textContainerElement: HTMLElement, selection: Selection) {
    const range = document.createRange();
    // using textContent so it would grab the text node
    range.setStart(textContainerElement.childNodes[0], textContainerElement.textContent?.length || 0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private static getSelection(etc: EditableTableComponent): Selection | null {
    const shadowRoot = etc.shadowRoot as unknown as Document;
    // chrome
    if (shadowRoot.getSelection) {
      return shadowRoot.getSelection();
    }
    // firefox
    // safari - uses the following but can't pick up the current location
    const windowShadowRoot = window.document.activeElement?.shadowRoot as unknown as Document;
    if (windowShadowRoot === shadowRoot) {
      return window.document.getSelection();
    }
    return null;
  }

  public static setToEndOfText(etc: EditableTableComponent, textContainerElement: HTMLElement) {
    const selection = CaretPosition.getSelection(etc);
    if (selection) CaretPosition.setSelectionToEndOfText(textContainerElement, selection);
  }
}
