import {CellTypeTotals, ColumnDetailsT} from '../../types/columnDetails';
import {ColumnTypesInternal} from '../../types/columnTypeInternal';
import {AUXILIARY_CELL_TYPE} from '../../enums/cellType';
import {HasRerendered} from '../render/hasRerendered';
import {CellText} from '../../types/tableContents';
import {EMPTY_STRING} from '../../consts/text';

// TO-DO - may not need this class at all as the only use case for it is to help copy or export csv file correctly
export class CellTypeTotalsUtils {
  // TO-DO classes that create objects should just be creating a new instance of that class
  public static createObj(columnTypes: ColumnTypesInternal): CellTypeTotals {
    const auxiliaryType = {
      // when cell text is empty, invalid, removable default
      [AUXILIARY_CELL_TYPE.Undefined]: 0,
    };
    return columnTypes.reduce<CellTypeTotals>((cellTypeTotals, type) => {
      cellTypeTotals[type.name] = 0;
      return cellTypeTotals;
    }, auxiliaryType);
  }

  public static parseTypeName(cellText: CellText, types: ColumnTypesInternal): string {
    if (cellText === EMPTY_STRING) return AUXILIARY_CELL_TYPE.Undefined;
    const validType = types.find((type) => type.textValidation.func?.(String(cellText)));
    if (validType) return validType.name;
    // TO-DO - will need to do filtering to get non validation
    // if the first type does not not have validation - return it
    if (types[0] && typeof types[0].textValidation.func !== 'function') {
      return types[0].name;
    }
    return AUXILIARY_CELL_TYPE.Undefined;
  }

  private static incrementType(type: string, cellTypeTotals: CellTypeTotals) {
    cellTypeTotals[type] += 1;
  }

  private static decrementType(type: string, cellTypeTotals: CellTypeTotals) {
    cellTypeTotals[type] -= 1;
  }

  // prettier-ignore
  private static callChangeTypeFuncs(
      columnDetails: ColumnDetailsT, changeFuncs: ((cellTypeTotals: CellTypeTotals) => void)[]) {
    if (HasRerendered.check(columnDetails)) return; // CAUTION-2
    changeFuncs.forEach((func) => func(columnDetails.cellTypeTotals));
  }

  // WORK - these should perhaps be in a timeout?
  public static incrementCellType(columnDetails: ColumnDetailsT, cellText: CellText) {
    const type = CellTypeTotalsUtils.parseTypeName(cellText, columnDetails.types);
    CellTypeTotalsUtils.callChangeTypeFuncs(columnDetails, [CellTypeTotalsUtils.incrementType.bind(this, type)]);
  }

  public static decrementCellType(columnDetails: ColumnDetailsT, cellText: CellText) {
    const type = CellTypeTotalsUtils.parseTypeName(cellText, columnDetails.types);
    CellTypeTotalsUtils.callChangeTypeFuncs(columnDetails, [CellTypeTotalsUtils.decrementType.bind(this, type)]);
  }

  public static changeCellType(columnDetails: ColumnDetailsT, oldType: string | undefined, newType: string) {
    if (oldType === newType) return;
    const changeTypeFuncs = [CellTypeTotalsUtils.incrementType.bind(this, newType)];
    if (oldType) changeTypeFuncs.push(CellTypeTotalsUtils.decrementType.bind(this, oldType));
    CellTypeTotalsUtils.callChangeTypeFuncs(columnDetails, changeTypeFuncs);
  }

  // TO-DO - this should only be used when cells are being copied or exported into csv, remove everything if not is used
  // this needs to be refactored
  public static getColumnType(cellTypeTotals: CellTypeTotals, numberOfDataRows: number): string {
    const cellTypes = Object.keys(cellTypeTotals);
    const numberOfUndefinedTypeCells = cellTypeTotals[AUXILIARY_CELL_TYPE.Undefined];
    const numberOfTypedCells = numberOfDataRows - numberOfUndefinedTypeCells;
    // if the column has nothing but undefined cell types, the column type is set to whatever the default should be
    if (numberOfTypedCells === 0) return Object.keys(cellTypeTotals)[0];
    // return highest - without this
    for (let i = 0; i < cellTypes.length; i += 1) {
      if (cellTypes[i] !== AUXILIARY_CELL_TYPE.Undefined) {
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
//   const keys = Object.keys(cellTypeTotals);
//   const biggestColumnType = keys.reduce((p: string, c: string) => {
//     if (cellTypeTotals[c] > cellTypeTotals[p]) {
//       return c;
//     }
//     return p;
//   }, keys[0]);
//   return biggestColumnType;
// }
