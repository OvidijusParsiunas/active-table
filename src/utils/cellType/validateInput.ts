import {ACTIVE_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from '../../enums/columnType';
import {EditableTableComponent} from '../../editable-table-component';
import {VALIDABLE_CELL_TYPE} from '../../enums/cellType';

type VALIDATORS = {[key in VALIDABLE_CELL_TYPE]?: (input: string) => boolean};

export class ValidateInput {
  // WORK - custom regex
  private static readonly REGEX = {
    // prettier-ignore
    // eslint-disable-next-line max-len
    [ACTIVE_COLUMN_TYPE.Date]: new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/),
  };

  public static readonly VALIDATORS: VALIDATORS = {
    [ACTIVE_COLUMN_TYPE.Number]: (input: string) => !isNaN(input as unknown as number),
    [ACTIVE_COLUMN_TYPE.Date]: (input: string) => ValidateInput.REGEX[ACTIVE_COLUMN_TYPE.Date].test(input),
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
      rowIndex: number, columnIndex: number) {
    if (!ValidateInput.VALIDATORS[USER_SET_COLUMN_TYPE.Number]?.(cellElement.textContent as string)) {
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

  public static validate(cellText: string, userSetColumnType: VALIDABLE_CELL_TYPE) {
    return ValidateInput.VALIDATORS[userSetColumnType]?.(cellText);
  }
}
