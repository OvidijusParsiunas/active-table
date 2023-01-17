import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {TextValidation} from '../../types/textValidation';
import {CellText} from '../../types/tableContent';
import {EMPTY_STRING} from '../../consts/text';

export class Validation {
  private static readonly DEFAULT_TYPES_REGEX = {
    [DEFAULT_COLUMN_TYPES.CURRENCY]: new RegExp(
      // eslint-disable-next-line max-len
      /^(([$€£¥]\s*?-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?)|(-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?\s*?[$€£¥]))$/
    ),
    // \s*? is used to allow spaces between symbols
    [DEFAULT_COLUMN_TYPES.DATE_DMY]: new RegExp(
      /^(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?(0?[1-9]|1[012])\s*?[/-]\s*?\d{4}$/
    ),
    [DEFAULT_COLUMN_TYPES.DATE_MDY]: new RegExp(
      /^(0?[1-9]|1[012])\s*?[/-]\s*?(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?\d{4}$/
    ),
  };

  public static readonly DEFAULT_TYPES_FUNCTIONALITY: {[key in DEFAULT_COLUMN_TYPES]?: TextValidation['func']} = {
    [DEFAULT_COLUMN_TYPES.NUMBER]: (cellText: string) =>
      cellText !== EMPTY_STRING && !isNaN(cellText as unknown as number),
    [DEFAULT_COLUMN_TYPES.CURRENCY]: (cellText: string) =>
      Validation.DEFAULT_TYPES_REGEX[DEFAULT_COLUMN_TYPES.CURRENCY].test(cellText as string),
    [DEFAULT_COLUMN_TYPES.DATE_DMY]: (cellText: string) =>
      Validation.DEFAULT_TYPES_REGEX[DEFAULT_COLUMN_TYPES.DATE_DMY].test(cellText as string),
    [DEFAULT_COLUMN_TYPES.DATE_MDY]: (cellText: string) =>
      Validation.DEFAULT_TYPES_REGEX[DEFAULT_COLUMN_TYPES.DATE_MDY].test(cellText as string),
  };

  public static setSelectValidation(type: ColumnTypeInternal, isDefaultTextRemovable: boolean, defaultText: CellText) {
    if (!type.selectProps?.options || type.selectProps?.canAddMoreOptions) return;
    const optionsMap = new Set<CellText>(type.selectProps.options.map((option) => option.text));
    type.textValidation ??= {};
    type.textValidation.func = (cellText: string) => {
      return !!optionsMap.has(cellText) || (!isDefaultTextRemovable && cellText === defaultText);
    };
  }
}
