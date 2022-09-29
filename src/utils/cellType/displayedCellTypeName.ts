import {USER_SET_COLUMN_TYPE} from '../../enums/columnType';
import {GenericObject} from '../../types/genericObject';
import {ObjectUtils} from '../object/objectUtils';

export class DisplayedCellTypeName {
  private static CELL_TYPE_ALIAS_ONE_WAY: GenericObject = {
    [USER_SET_COLUMN_TYPE.Date_D_M_Y]: 'Date d-m-y',
    [USER_SET_COLUMN_TYPE.Date_M_D_Y]: 'Date m-d-y',
  };
  public static readonly CELL_TYPE_ALIAS: GenericObject = ObjectUtils.createTwoWayObject(
    DisplayedCellTypeName.CELL_TYPE_ALIAS_ONE_WAY
  );

  // due to two way binding can be used to extract displayed cell type name from code name and vice versa
  public static get(cellType: string): string {
    return DisplayedCellTypeName.CELL_TYPE_ALIAS[cellType] || cellType;
  }
}
