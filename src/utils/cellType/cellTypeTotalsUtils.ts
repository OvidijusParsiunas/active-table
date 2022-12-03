import {ACTIVE_COLUMN_TYPE, USER_SET_COLUMN_TYPE} from '../../enums/columnType';
import {CellTypeTotals, ColumnDetailsT} from '../../types/columnDetails';
import {CELL_TYPE, VALIDABLE_CELL_TYPE} from '../../enums/cellType';
import {HasRerendered} from '../render/hasRerendered';
import {ColumnTypes} from '../../types/columnTypes';
import {CellText} from '../../types/tableContents';
import {EMPTY_STRING} from '../../consts/text';
import {ValidateInput} from './validateInput';

export class CellTypeTotalsUtils {
  public static readonly DEFAULT_COLUMN_TYPE = ACTIVE_COLUMN_TYPE.Text;

  public static createObj(): CellTypeTotals {
    return {
      [CELL_TYPE.Text]: 0,
      [CELL_TYPE.Number]: 0,
      [CELL_TYPE.Currency]: 0,
      [CELL_TYPE.Date_D_M_Y]: 0,
      [CELL_TYPE.Date_M_D_Y]: 0,
      [CELL_TYPE.AllDateFormats]: 0,
      [CELL_TYPE.Empty]: 0,
      // this type will never be incremented, but is here as a stub for its cell type
      [CELL_TYPE.Category]: 0,
    };
  }

  private static parseValidable(cellText: CellText) {
    const validableCellTypeKeys = Object.keys(VALIDABLE_CELL_TYPE) as (keyof typeof VALIDABLE_CELL_TYPE)[];
    for (let i = 0; i < validableCellTypeKeys.length; i += 1) {
      // cellText can be number but regex .test() expects a string input in typescript
      if (ValidateInput.VALIDATORS[validableCellTypeKeys[i]](cellText as string)) return validableCellTypeKeys[i];
    }
    return null;
  }

  public static parseType(cellText: CellText, types: ColumnTypes): CELL_TYPE {
    if (cellText === EMPTY_STRING) return CELL_TYPE.Empty;
    const valid = types.find((type) => type.validation?.(cellText));
    if (valid) return valid.name as CELL_TYPE;
    const parsedCellType = CellTypeTotalsUtils.parseValidable(cellText);
    if (!parsedCellType) return CELL_TYPE.Text;
    // REF-3
    if (parsedCellType === VALIDABLE_CELL_TYPE.Date_D_M_Y) {
      if (ValidateInput.validate(cellText, ACTIVE_COLUMN_TYPE.Date_M_D_Y)) return CELL_TYPE.AllDateFormats;
    }
    return parsedCellType;
  }

  private static incrementType(type: CELL_TYPE, cellTypeTotals: CellTypeTotals) {
    cellTypeTotals[type] += 1;
  }

  private static decrementType(type: CELL_TYPE, cellTypeTotals: CellTypeTotals) {
    cellTypeTotals[type] -= 1;
  }

  // prettier-ignore
  private static changeTypeAndSetColumnType(
      columnDetails: ColumnDetailsT, changeFuncs: ((cellTypeTotals: CellTypeTotals) => void)[]) {
    if (HasRerendered.check(columnDetails)) return; // CAUTION-2
    const {cellTypeTotals, elements} = columnDetails;
    changeFuncs.forEach((func) => func(cellTypeTotals));
    if (columnDetails.userSetColumnType === USER_SET_COLUMN_TYPE.Auto) {
      columnDetails.activeColumnType = CellTypeTotalsUtils.getActiveColumnType(cellTypeTotals, elements.length - 1);
    }
  }

  public static incrementCellTypeAndSetNewColumnType(columnDetails: ColumnDetailsT, cellText: CellText) {
    const type = CellTypeTotalsUtils.parseType(cellText, columnDetails.types);
    CellTypeTotalsUtils.changeTypeAndSetColumnType(columnDetails, [CellTypeTotalsUtils.incrementType.bind(this, type)]);
  }

  public static decrementCellTypeAndSetNewColumnType(columnDetails: ColumnDetailsT, cellText: CellText) {
    const type = CellTypeTotalsUtils.parseType(cellText, columnDetails.types);
    CellTypeTotalsUtils.changeTypeAndSetColumnType(columnDetails, [CellTypeTotalsUtils.decrementType.bind(this, type)]);
  }

  // prettier-ignore
  public static changeCellTypeAndSetNewColumnType(columnDetails: ColumnDetailsT, oldType: CELL_TYPE, newType: CELL_TYPE) {
    if (oldType === newType) return;
    CellTypeTotalsUtils.changeTypeAndSetColumnType(columnDetails,
      [CellTypeTotalsUtils.decrementType.bind(this, oldType), CellTypeTotalsUtils.incrementType.bind(this, newType)]);
  }

  // prettier-ignore
  // REF-3
  private static getDateTypeIfAllDates(cellTypeTotals: CellTypeTotals, numberOfRichRows: number) {
    const datesTotal = cellTypeTotals[CELL_TYPE.Date_D_M_Y]
      + cellTypeTotals[CELL_TYPE.Date_M_D_Y] + cellTypeTotals[CELL_TYPE.AllDateFormats];
    if (datesTotal === numberOfRichRows) {
      // if all dates apply to both formats, return d/m/y as the primary format
      if (cellTypeTotals[CELL_TYPE.AllDateFormats] == numberOfRichRows) return ACTIVE_COLUMN_TYPE.Date_D_M_Y;
      numberOfRichRows -= cellTypeTotals[CELL_TYPE.AllDateFormats];
      if (cellTypeTotals[CELL_TYPE.Date_D_M_Y] === numberOfRichRows) return ACTIVE_COLUMN_TYPE.Date_D_M_Y;
      if (cellTypeTotals[CELL_TYPE.Date_M_D_Y] === numberOfRichRows) return ACTIVE_COLUMN_TYPE.Date_M_D_Y;
    }
    return null;
  }

  public static getActiveColumnType(cellTypeTotals: CellTypeTotals, numberOfDataRows: number): ACTIVE_COLUMN_TYPE {
    const cellTypes = Object.keys(cellTypeTotals) as unknown as CELL_TYPE[];
    // the logic does not take defaults into consideration as a column type, so if we have default as '-' and
    // the column contains the following data ['-','-',2,4], the column type is number
    const numberOfRowsWithDefaultText = cellTypeTotals[CELL_TYPE.Empty];
    const numberOfRichRows = numberOfDataRows - numberOfRowsWithDefaultText;
    // if the column has nothing but defaults, the column type is set to whatever the default should be
    if (numberOfRichRows === 0) return CellTypeTotalsUtils.DEFAULT_COLUMN_TYPE;
    const dateType = CellTypeTotalsUtils.getDateTypeIfAllDates(cellTypeTotals, numberOfRichRows);
    if (dateType) return dateType;
    for (let i = 0; i < cellTypes.length; i += 1) {
      if (cellTypes[i] !== CELL_TYPE.Empty) {
        if (cellTypeTotals[cellTypes[i]] === numberOfRichRows) {
          return cellTypes[i] as ACTIVE_COLUMN_TYPE;
        }
        // if there is a mixture (exc. default)
        if (cellTypeTotals[cellTypes[i]] !== 0) {
          return ACTIVE_COLUMN_TYPE.Text;
        }
      }
    }
    return CellTypeTotalsUtils.DEFAULT_COLUMN_TYPE;
  }
}

// in-case this is needed in the future:

// private static getBiggestColumnType(cellTypeTotals: CellTypeTotals) {
//   const keys = Object.keys(cellTypeTotals) as unknown as CELL_TYPE[];
//   const biggestColumnType = keys.reduce((p: CELL_TYPE, c: CELL_TYPE) => {
//     if (cellTypeTotals[c] > cellTypeTotals[p]) {
//       return c;
//     }
//     return p;
//   }, keys[0]);
//   return biggestColumnType;
// }
