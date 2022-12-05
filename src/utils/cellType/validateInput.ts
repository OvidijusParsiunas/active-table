import {ACTIVE_COLUMN_TYPE} from '../../enums/columnType';
import {VALIDABLE_CELL_TYPE} from '../../enums/cellType';
import {CellText} from '../../types/tableContents';

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

  public static validate(cellText: CellText, userSetColumnType: VALIDABLE_CELL_TYPE) {
    // cellText can be number but regex .test() expects a string input in typescript
    return ValidateInput.VALIDATORS[userSetColumnType](cellText as string);
  }
}
