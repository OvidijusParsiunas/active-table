import {CellTypeTotals, ColumnDetailsT} from '../../types/columnDetails';
import {AUXILIARY_CELL_TYPE, CELL_TYPE} from '../../enums/cellType';
import {HasRerendered} from '../render/hasRerendered';
import {ColumnTypes} from '../../types/columnType';
import {CellText} from '../../types/tableContents';
import {EMPTY_STRING} from '../../consts/text';

// TO-DO - may not need this class at all as the only use case for it is to help copy or export csv file correctly
export class CellTypeTotalsUtils {
  // TO-DO classes that create objects should just be creating a new instance of that class
  public static createObj(columnTypes: ColumnTypes): CellTypeTotals {
    const auxiliaryType = {
      // when cell text is empty, invalid, removable default
      [AUXILIARY_CELL_TYPE.Undefined]: 0,
    };
    return columnTypes.reduce<CellTypeTotals>((cellTypeTotals, type) => {
      cellTypeTotals[type.name] = 0;
      return cellTypeTotals;
    }, auxiliaryType);
  }

  public static parseType(cellText: CellText, types: ColumnTypes): CELL_TYPE {
    if (cellText === EMPTY_STRING) return CELL_TYPE.Undefined;
    const validType = types.find((type) => type.validation?.(cellText));
    if (validType) return validType.name as CELL_TYPE;
    // REF-3
    // if the first type does not not have validation - return it
    if (types[0] && typeof types[0].validation !== 'function') {
      return types[0].name as CELL_TYPE;
    }
    return CELL_TYPE.Undefined;
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
    const {cellTypeTotals} = columnDetails;
    changeFuncs.forEach((func) => func(cellTypeTotals));
  }

  // these should perhaps be in a timeout?
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

  // TO-DO - this should only be used when cells are being copied or exported into csv, remove everything if not is used
  // this needs to be refactored
  public static getColumnType(cellTypeTotals: CellTypeTotals, numberOfDataRows: number): string {
    const cellTypes = Object.keys(cellTypeTotals) as unknown as CELL_TYPE[];
    const numberOfUndefinedTypeCells = cellTypeTotals[CELL_TYPE.Undefined];
    const numberOfTypedCells = numberOfDataRows - numberOfUndefinedTypeCells;
    // if the column has nothing but undefined cell types, the column type is set to whatever the default should be
    if (numberOfTypedCells === 0) return Object.keys(cellTypeTotals)[0];
    // return highest - without this
    for (let i = 0; i < cellTypes.length; i += 1) {
      if (cellTypes[i] !== CELL_TYPE.Undefined) {
        if (cellTypeTotals[cellTypes[i]] === numberOfTypedCells) {
          return cellTypes[i];
        }
        // if there is a mixture - return highest
        if (cellTypeTotals[cellTypes[i]] !== 0) {
          return Object.keys(cellTypeTotals)[0];
        }
      }
    }
    return Object.keys(cellTypeTotals)[0];
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
