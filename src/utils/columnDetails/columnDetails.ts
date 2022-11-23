import {ColumnDetailsInitial, ColumnDetailsNoSizer} from '../../types/columnDetails';
import {ColumnSettingsInternal} from '../../types/columnsSettingsInternal';
import {CellTypeTotalsUtils} from '../cellType/cellTypeTotalsUtils';
import {USER_SET_COLUMN_TYPE} from '../../enums/columnType';

// REF-13
export class ColumnDetails {
  public static readonly MINIMAL_COLUMN_WIDTH = 34;

  public static createWithElementsArr(settings?: ColumnSettingsInternal): ColumnDetailsInitial {
    return {
      elements: [],
      settings,
    };
  }

  // prettier-ignore
  public static updateWithNoSizer(columnDetails: ColumnDetailsInitial,
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
