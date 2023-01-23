import {AuxiliaryTableContentInternal} from '../../types/auxiliaryTableContentInternal';
import {AuxiliaryTableContentColors} from './auxiliaryTableContentColors';
import {AuxiliaryTableContent} from '../../types/auxiliaryTableContent';

// auxiliary content is comprised of index column, add new column column and add new row row
export class AuxiliaryTableContentInternalUtils {
  public static set(clientObject: AuxiliaryTableContent, internalObject: AuxiliaryTableContentInternal) {
    Object.assign(internalObject, clientObject);
  }

  public static getDefault(): AuxiliaryTableContentInternal {
    return {
      displayAddColumnCell: true,
      displayAddRowCell: true,
      displayIndexColumn: true,
      cellColors: AuxiliaryTableContentColors.getDefaultCellColors(),
    };
  }
}
