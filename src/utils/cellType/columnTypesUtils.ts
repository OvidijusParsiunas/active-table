import {ColumnTypes} from '../../types/columnTypes';
import {CellText} from '../../types/tableContents';
import {RegexUtils} from '../regex/regexUtils';

export class ColumnTypesUtils {
  private static readonly DEFAULT_REGEX = {
    ['Currency']: new RegExp(
      // eslint-disable-next-line max-len
      /^(([$€£¥]\s*?-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?)|(-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?\s*?[$€£¥]))$/
    ),
    // \s*? is used to allow spaces between symbols
    ['Date d-m-y2']: new RegExp(/^(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?(0?[1-9]|1[012])\s*?[/-]\s*?\d{4}$/),
    ['Date m-d-y']: new RegExp(/^(0?[1-9]|1[012])\s*?[/-]\s*?(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?\d{4}$/),
  };

  private static createMDYDateFromDMYString(dmyDateString: string) {
    const numberStringArr = RegexUtils.extractIntegerStrs(dmyDateString);
    if (numberStringArr && numberStringArr.length === 3) {
      // new Date(year, monthIndex, day)
      return new Date(Number(numberStringArr[2]), Number(numberStringArr[1]) - 1, Number(numberStringArr[0]));
    }
    return null;
  }

  public static getDefault(): ColumnTypes {
    return [
      {
        name: 'Number2',
        validation: (cellText: CellText) => !isNaN(cellText as unknown as number),
        sorting: {
          ascending: (cellText1: string, cellText2: string) => Number(cellText1) - Number(cellText2),
          descending: (cellText1: string, cellText2: string) => Number(cellText2) - Number(cellText1),
        },
      },
      {
        name: 'Date d-m-y2',
        validation: (cellText: CellText) => ColumnTypesUtils.DEFAULT_REGEX['Date d-m-y2'].test(cellText as string),
        sorting: {
          ascending: (cellText1: string, cellText2: string) =>
            (ColumnTypesUtils.createMDYDateFromDMYString(cellText1)?.getTime() as number) -
            (ColumnTypesUtils.createMDYDateFromDMYString(cellText2)?.getTime() as number),
          descending: (cellText1: string, cellText2: string) =>
            (ColumnTypesUtils.createMDYDateFromDMYString(cellText2)?.getTime() as number) -
            (ColumnTypesUtils.createMDYDateFromDMYString(cellText1)?.getTime() as number),
        },
        calendar: {
          separator: '-',
          structureIndexes: {
            day: 0,
            month: 1,
            year: 2,
          },
        },
      },
    ];
  }
}
