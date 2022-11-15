import {ColumnDetailsElementsOnly, ColumnDetailsNoSizer} from '../../types/columnDetails';
import {CellTypeTotalsUtils} from '../cellType/cellTypeTotalsUtils';
import {USER_SET_COLUMN_TYPE} from '../../enums/columnType';

// REF-13
export class ColumnDetails {
  public static createWithElementsArr(): ColumnDetailsElementsOnly {
    return {
      elements: [],
    };
  }

  // prettier-ignore
  public static updateWithNoSizer(columnDetails: ColumnDetailsElementsOnly,
      categoryDropdown: HTMLElement): ColumnDetailsNoSizer {
    const newObject = {
      activeColumnType: CellTypeTotalsUtils.DEFAULT_COLUMN_TYPE,
      userSetColumnType: USER_SET_COLUMN_TYPE.Auto,
      cellTypeTotals: CellTypeTotalsUtils.createObj(),
      categoryDropdown: {
        categoryToItem: {},
        activeItems: {},
        element: categoryDropdown,
        scrollbarPresence: {
          horizontal: false,
          vertical: false,
        },
      },
    };
    Object.assign(columnDetails, newObject);
    return columnDetails as ColumnDetailsNoSizer;
  }
}
