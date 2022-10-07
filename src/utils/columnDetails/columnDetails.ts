import {CellTypeTotalsUtils} from '../cellType/cellTypeTotalsUtils';
import {ColumnDetailsTPartial} from '../../types/columnDetails';
import {USER_SET_COLUMN_TYPE} from '../../enums/columnType';

export class ColumnDetails {
  public static createPartial(cellElement: HTMLElement, categoryDropdown: HTMLElement): ColumnDetailsTPartial {
    return {
      elements: [cellElement],
      activeColumnType: CellTypeTotalsUtils.DEFAULT_COLUMN_TYPE,
      userSetColumnType: USER_SET_COLUMN_TYPE.Auto,
      cellTypeTotals: CellTypeTotalsUtils.createObj(),
      categories: {
        isCellTextNewCategory: false,
        dropdown: {
          categoryToItem: {},
          activeItems: {},
          element: categoryDropdown,
          isHorizontalScrollPresent: false,
        },
      },
    };
  }
}
