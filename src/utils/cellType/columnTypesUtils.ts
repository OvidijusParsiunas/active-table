import {ColumnType, ColumnTypes} from '../../types/columnType';
import {YMDFormat} from '../../types/calendarProperties';
import {CellText} from '../../types/tableContents';
import {RegexUtils} from '../regex/regexUtils';

export class ColumnTypesUtils {
  private static readonly DEFAULT_REGEX = {
    ['Currency2']: new RegExp(
      // eslint-disable-next-line max-len
      /^(([$€£¥]\s*?-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?)|(-?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?\s*?[$€£¥]))$/
    ),
    // \s*? is used to allow spaces between symbols
    ['Date d-m-y2']: new RegExp(/^(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?(0?[1-9]|1[012])\s*?[/-]\s*?\d{4}$/),
    ['Date m-d-y2']: new RegExp(/^(0?[1-9]|1[012])\s*?[/-]\s*?(0?[1-9]|[12][0-9]|3[01])\s*?[/-]\s*?\d{4}$/),
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

  public static getDefault(): ColumnTypes {
    return [
      {
        name: 'Text2',
      },
      {
        name: 'Number2',
        validation: (cellText: CellText) => !isNaN(cellText as unknown as number),
        sorting: {
          ascending: (cellText1: string, cellText2: string) => {
            return Number(cellText1) - Number(cellText2);
          },
          descending: (cellText1: string, cellText2: string) => Number(cellText2) - Number(cellText1),
        },
      },
      {
        name: 'Currency2',
        validation: (cellText: CellText) => ColumnTypesUtils.DEFAULT_REGEX['Currency2'].test(cellText as string),
      },
      {
        name: 'Date d-m-y2',
        validation: (cellText: CellText) => ColumnTypesUtils.DEFAULT_REGEX['Date d-m-y2'].test(cellText as string),
        calendar: {
          separator: '-',
          structureIndexes: {
            day: 0,
            month: 1,
            year: 2,
          },
          dateConversion: {
            toYMD: (cellText: string) => ColumnTypesUtils.dMYCellTextToYMD(cellText),
            fromYMD: (YMD: YMDFormat) => ColumnTypesUtils.yMDToDMYCellText(YMD),
          },
        },
      },
      {
        name: 'Date m-d-y2',
        validation: (cellText: CellText) => ColumnTypesUtils.DEFAULT_REGEX['Date m-d-y2'].test(cellText as string),
        calendar: {
          separator: '-',
          structureIndexes: {
            day: 0,
            month: 1,
            year: 2,
          },
          dateConversion: {
            toYMD: (cellText: string) => ColumnTypesUtils.mdYCellTextToYMD(cellText),
            fromYMD: (YMD: YMDFormat) => ColumnTypesUtils.yMDToMDYCellText(YMD),
          },
        },
      },
      {
        name: 'Category2',
        categories: {
          dropdownStyle: {
            width: '70px',
            textAlign: 'left',
            paddingTop: '0px',
            paddingBottom: '0px',
          },
          options: [{name: 'truea', backgroundColor: 'red'}, {name: 'false'}],
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

  public static process(types: ColumnTypes, isDefaultTextRemovable: boolean, defaultText: CellText) {
    types.forEach((type) => {
      if (type.categories?.options) ColumnTypesUtils.setCategoriesValidation(type, isDefaultTextRemovable, defaultText);
    });
  }
}
