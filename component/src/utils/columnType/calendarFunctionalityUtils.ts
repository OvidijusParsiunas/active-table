import {Calendar, YMDFormat} from '../../types/calendarFunctionality';
import {DEFAULT_COLUMN_TYPES} from '../../enums/defaultColumnTypes';
import {RegexUtils} from '../regex/regexUtils';

export class CalendarFunctionalityUtils {
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

  public static readonly DEFAULT_TYPES_FUNCTIONALITY: {[key: string]: Calendar} = {
    [DEFAULT_COLUMN_TYPES.DATE_DMY]: {
      toYMDFunc: (cellText: string) => CalendarFunctionalityUtils.dMYCellTextToYMD(cellText),
      fromYMDFunc: (YMD: YMDFormat) => CalendarFunctionalityUtils.yMDToDMYCellText(YMD),
    },
    [DEFAULT_COLUMN_TYPES.DATE_MDY]: {
      toYMDFunc: (cellText: string) => CalendarFunctionalityUtils.mdYCellTextToYMD(cellText),
      fromYMDFunc: (YMD: YMDFormat) => CalendarFunctionalityUtils.yMDToMDYCellText(YMD),
    },
  };
}
