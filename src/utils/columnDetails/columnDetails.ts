import {ColumnDetailsInitial, ColumnDetailsNoSizer} from '../../types/columnDetails';
import {AuxiliaryTableContent} from '../auxiliaryTableContent/auxiliaryTableContent';
import {EditableTableComponent} from '../../editable-table-component';
import {CellTypeTotalsUtils} from '../cellType/cellTypeTotalsUtils';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {USER_SET_COLUMN_TYPE} from '../../enums/columnType';
import {CellEventColors} from '../../types/cellEventColors';

// REF-13
export class ColumnDetails {
  public static readonly MINIMAL_COLUMN_WIDTH = 34;

  public static createWithElementsArr(settings?: ColumnSettingsInternal): ColumnDetailsInitial {
    return {
      elements: [],
      settings,
    };
  }

  private static createHeaderEventColors(etc: EditableTableComponent, colDetails: ColumnDetailsInitial): CellEventColors {
    return {
      default: colDetails.elements[0].style.backgroundColor,
      hover: etc.headerStyle.backgroundColor || etc.cellStyle.backgroundColor || AuxiliaryTableContent.EVENT_COLORS.hover,
    };
  }

  // prettier-ignore
  public static updateWithNoSizer(etc: EditableTableComponent, columnDetails: ColumnDetailsInitial,
      categoryDropdown: HTMLElement): ColumnDetailsNoSizer {
    const newObject: Omit<ColumnDetailsNoSizer, keyof ColumnDetailsInitial> = {
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
      headerEventColors: ColumnDetails.createHeaderEventColors(etc, columnDetails)
    };
    Object.assign(columnDetails, newObject);
    return columnDetails as ColumnDetailsNoSizer;
  }
}
