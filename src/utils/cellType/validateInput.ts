import {ACTIVE_COLUMN_TYPE} from '../../enums/columnType';
import {VALIDABLE_CELL_TYPE} from '../../enums/cellType';

type VALIDATORS = {[key in VALIDABLE_CELL_TYPE]: (input: string) => boolean};

export class ValidateInput {
  // WORK - custom regex
  private static readonly REGEX = {
    [ACTIVE_COLUMN_TYPE.Currency]: new RegExp(
      // eslint-disable-next-line max-len
      /^(([$€£¥]\s*?-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?)|(-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?\s*?[$€£¥]))$/
    ),
    // \s*? is used to allow spaces between symbols
    [ACTIVE_COLUMN_TYPE.Date_D_M_Y]: new RegExp(
      /^(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?(0?[1-9]|1[012])\s*?[/-]\s*?\d{4}$/
    ),
    [ACTIVE_COLUMN_TYPE.Date_M_D_Y]: new RegExp(
      /^(0?[1-9]|1[012])\s*?[/-]\s*?(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?\d{4}$/
    ),
  };

  public static readonly VALIDATORS: VALIDATORS = {
    [ACTIVE_COLUMN_TYPE.Number]: (input: string) => !isNaN(input as unknown as number),
    [ACTIVE_COLUMN_TYPE.Currency]: (input: string) => ValidateInput.REGEX[ACTIVE_COLUMN_TYPE.Currency].test(input),
    [ACTIVE_COLUMN_TYPE.Date_D_M_Y]: (input: string) => ValidateInput.REGEX[ACTIVE_COLUMN_TYPE.Date_D_M_Y].test(input),
    [ACTIVE_COLUMN_TYPE.Date_M_D_Y]: (input: string) => ValidateInput.REGEX[ACTIVE_COLUMN_TYPE.Date_M_D_Y].test(input),
  };

  public static validate(cellText: string, userSetColumnType: VALIDABLE_CELL_TYPE) {
    return ValidateInput.VALIDATORS[userSetColumnType](cellText);
  }
}

// the following used to prevent the typing of other symbols when the column type is number
// there is a bug when the user types '-' at the start

// private static resetRange(cellElement: HTMLElement, selection: Selection, anchor: number) {
//   const range = document.createRange();
//   range.setStart(cellElement.childNodes[0], anchor - 1);
//   range.collapse(true);
//   selection.removeAllRanges();
//   selection.addRange(range);
// }

// // TO-DO test this out on other browsers
// private static getGetSelectionFunc(etc: EditableTableComponent): Selection | null {
//   const shadowRoot = etc.shadowRoot as unknown as Document;
//   // chrome
//   if (shadowRoot.getSelection) {
//     return shadowRoot.getSelection();
//   }
//   // firefox
//   // safari uses the following but behaves as if no selection was picked up
//   const windowShadowRoot = window.document.activeElement?.shadowRoot as unknown as Document;
//   if (windowShadowRoot === shadowRoot) {
//     return window.document.getSelection();
//   }
//   return null;
// }

// // prettier-ignore
// public static preventInsertionIfInvalid(etc: EditableTableComponent, cellElement: HTMLElement,
//     rowIndex: number, columnIndex: number) {
//   if (!ValidateInput.VALIDATORS[USER_SET_COLUMN_TYPE.Number]?.(cellElement.textContent as string)) {
//     const selection = ValidateInput.getGetSelectionFunc(etc);
//     const anchor = selection?.anchorOffset;
//     cellElement.textContent = etc.contents[rowIndex][columnIndex] as string;
//     if (selection !== undefined && selection !== null && anchor !== undefined) {
//       ValidateInput.resetRange(cellElement, selection, anchor);
//     }
//     return true;
//   }
//   return false;
// }
