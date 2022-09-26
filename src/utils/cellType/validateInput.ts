import {ACTIVE_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from '../../enums/columnType';
import {EditableTableComponent} from '../../editable-table-component';

type RANGES = {[key in ACTIVE_COLUMN_TYPE]: RegExp};

export class ValidateInput {
  private static readonly RANGE: RANGES = {
    [ACTIVE_COLUMN_TYPE.Number]: new RegExp(/^\d+$/),
  };

  private static resetRange(cellElement: HTMLElement, selection: Selection, anchor: number) {
    const range = document.createRange();
    range.setStart(cellElement.childNodes[0], anchor - 1);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // TO-DO test this out on other browsers
  private static getGetSelectionFunc(etc: EditableTableComponent): Selection | null {
    const shadowRoot = etc.shadowRoot as unknown as Document;
    // chrome
    if (shadowRoot.getSelection) {
      return shadowRoot.getSelection();
    }
    // firefox
    // safari uses the following but behaves as if no selection was picked up
    const windowShadowRoot = window.document.activeElement?.shadowRoot as unknown as Document;
    if (windowShadowRoot === shadowRoot) {
      return window.document.getSelection();
    }
    return null;
  }

  // prettier-ignore
  public static preventInsertionIfInvalid(etc: EditableTableComponent, cellElement: HTMLElement,
      rowIndex: number, columnIndex: number, userSetColumnType: USER_SET_COLUMN_TYPE) {
    if (!ValidateInput.RANGE[userSetColumnType].test(cellElement.textContent as string)) {
      const selection = ValidateInput.getGetSelectionFunc(etc);
      const anchor = selection?.anchorOffset;
      cellElement.textContent = etc.contents[rowIndex][columnIndex] as string;
      if (selection !== undefined && selection !== null && anchor !== undefined) {
        ValidateInput.resetRange(cellElement, selection, anchor);
      }
      return true;
    }
    return false;
  }
}
