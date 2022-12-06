import {CategoryDropdown} from '../../elements/dropdown/categoryDropdown/categoryDropdown';
import {ColumnDetailsInitial, ColumnDetailsNoSizer} from '../../types/columnDetails';
import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CellStateColorProperties} from '../../types/cellStateColors';
import {CellTypeTotalsUtils} from '../cellType/cellTypeTotalsUtils';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {ColumnTypesUtils} from '../cellType/columnTypesUtils';
import {CellText} from '../../types/tableContents';

// REF-13
export class ColumnDetails {
  public static readonly MINIMAL_COLUMN_WIDTH = 34;
  public static NEW_COLUMN_WIDTH = 100;

  // prettier-ignore
  private static getHeaderDefaultColor(etc: EditableTableComponent,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.header?.defaultStyle?.[key] || settings?.cellStyle?.[key] ||
      etc.header.defaultStyle?.[key] || etc.cellStyle[key] || defaultColor;
  }

  // prettier-ignore
  private static getHeaderHoverColor(etc: EditableTableComponent,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.header?.hoverColors?.[key] || etc.header.hoverColors?.[key] ||
      ColumnDetails.getHeaderDefaultColor(etc, key, defaultColor, settings);
  }

  // prettier-ignore
  public static createHeaderStateColors(etc: EditableTableComponent, settings?: ColumnSettingsInternal) {
    return {
      hover: {
        color: ColumnDetails.getHeaderHoverColor(
          etc, 'color', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['color'], settings),
        backgroundColor: ColumnDetails.getHeaderHoverColor(
          etc, 'backgroundColor', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['backgroundColor'], settings),
      },
      default: {
        color: ColumnDetails.getHeaderDefaultColor(etc, 'color', '', settings),
        backgroundColor: ColumnDetails.getHeaderDefaultColor(etc, 'backgroundColor', '', settings),
      }
    };
  }

  // prettier-ignore
  public static createInitial(etc: EditableTableComponent,
      settings?: ColumnSettingsInternal): ColumnDetailsInitial {
    return {
      elements: [],
      settings: settings || ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS,
      headerStateColors: ColumnDetails.createHeaderStateColors(etc, settings),
      bordersOverwrittenBySiblings: {},
    };
  }

  // prettier-ignore
  public static updateWithNoSizer(columnDetails: ColumnDetailsInitial,
      categoryDropdown: HTMLElement, componentDefaultText: CellText): ColumnDetailsNoSizer {
    const {isDefaultTextRemovable, defaultText: settingsDefaultText} = columnDetails.settings;
    const types = ColumnTypesUtils.getDefault();
    ColumnTypesUtils.process(types, isDefaultTextRemovable, settingsDefaultText || componentDefaultText);
    const newObject: Omit<ColumnDetailsNoSizer, keyof ColumnDetailsInitial> = {
      types,
      activeType: types[0],
      cellTypeTotals: CellTypeTotalsUtils.createObj(types),
      categoryDropdown: CategoryDropdown.getDefaultObj(categoryDropdown),
    };
    Object.assign(columnDetails, newObject);
    return columnDetails as ColumnDetailsNoSizer;
  }
}
