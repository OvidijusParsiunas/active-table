import {ColumnType, ColumnTypes} from '../../types/columnType';
import {YMDFormat} from '../../types/calendarFunctionality';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {CellText} from '../../types/tableContents';
import {RegexUtils} from '../regex/regexUtils';

export class ColumnTypesUtils {
  private static readonly DEFAULT_REGEX = {
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

  private static mdYCellTextToYMD(cellText: string): YMDFormat {
    const integerArr = RegexUtils.extractIntegerStrs(cellText) as YMDFormat;
    return [integerArr[2], integerArr[0], integerArr[1]];
  }

  private static yMDToMDYCellText(YMD: YMDFormat): string {
    return [YMD[1], YMD[2], YMD[0]].join('-');
  }

  private static dMYCellTextToYMD(cellText: string): YMDFormat {
    const integerArr = RegexUtils.extractIntegerStrs(cellText) as YMDFormat;
    return [integerArr[2], integerArr[1], integerArr[0]];
  }

  private static yMDToDMYCellText(YMD: YMDFormat): string {
    return [YMD[2], YMD[1], YMD[0]].join('-');
  }

  private static extractNumberFromString(text: string) {
    const numberStringArr = RegexUtils.extractFloatStrs(text);
    if (numberStringArr && numberStringArr.length > 0) {
      return Number(numberStringArr[0]);
    }
    return 0;
  }

  public static getDefault(): ColumnTypes {
    return [
      {
        name: DEFAULT_COLUMN_TYPES.TEXT,
      },
      {
        name: DEFAULT_COLUMN_TYPES.NUMBER,
        validation: (cellText: CellText) => !isNaN(cellText as unknown as number),
        sorting: {
          ascending: (cellText1: string, cellText2: string) => {
            return Number(cellText1) - Number(cellText2);
          },
          descending: (cellText1: string, cellText2: string) => Number(cellText2) - Number(cellText1),
        },
      },
      {
        name: DEFAULT_COLUMN_TYPES.CURRENCY,
        validation: (cellText: CellText) =>
          ColumnTypesUtils.DEFAULT_REGEX[DEFAULT_COLUMN_TYPES.CURRENCY].test(cellText as string),
        sorting: {
          ascending: (cellText1: string, cellText2: string) => {
            return (
              ColumnTypesUtils.extractNumberFromString(cellText1) - ColumnTypesUtils.extractNumberFromString(cellText2)
            );
          },
          descending: (cellText1: string, cellText2: string) => {
            return (
              ColumnTypesUtils.extractNumberFromString(cellText2) - ColumnTypesUtils.extractNumberFromString(cellText1)
            );
          },
        },
      },
      {
        name: DEFAULT_COLUMN_TYPES.DATE_DMY,
        validation: (cellText: CellText) =>
          ColumnTypesUtils.DEFAULT_REGEX[DEFAULT_COLUMN_TYPES.DATE_DMY].test(cellText as string),
        calendar: {
          toYMD: (cellText: string) => ColumnTypesUtils.dMYCellTextToYMD(cellText),
          fromYMD: (YMD: YMDFormat) => ColumnTypesUtils.yMDToDMYCellText(YMD),
        },
      },
      {
        name: DEFAULT_COLUMN_TYPES.DATE_MDY,
        validation: (cellText: CellText) =>
          ColumnTypesUtils.DEFAULT_REGEX[DEFAULT_COLUMN_TYPES.DATE_MDY].test(cellText as string),
        calendar: {
          toYMD: (cellText: string) => ColumnTypesUtils.mdYCellTextToYMD(cellText),
          fromYMD: (YMD: YMDFormat) => ColumnTypesUtils.yMDToMDYCellText(YMD),
        },
      },
      {
        name: DEFAULT_COLUMN_TYPES.CATEGORY,
        categories: {
          dropdownStyle: {
            width: '70px',
            textAlign: 'left',
            paddingTop: '0px',
            paddingBottom: '0px',
          },
          // options: [{name: 'truea', backgroundColor: 'red'}, {name: 'false'}],
        },
      },
    ];
  }

  private static setCategoriesValidation(type: ColumnType, isDefaultTextRemovable: boolean, defaultText: CellText) {
    if (!type.categories?.options) return; // only setting if available options are defined
    const optionsMap = new Set<CellText>(type.categories.options.map((option) => option.name));
    type.validation = (cellText: CellText) => {
      return !!optionsMap.has(cellText) || (!isDefaultTextRemovable && cellText === defaultText);
    };
  }

  // REF-3
  public static process(types: ColumnTypes, isDefaultTextRemovable: boolean, defaultText: CellText) {
    types.forEach((type) => {
      if (type.categories?.options) ColumnTypesUtils.setCategoriesValidation(type, isDefaultTextRemovable, defaultText);
    });
  }
}
