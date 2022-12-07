import {CategoryDropdown} from '../../elements/dropdown/categoryDropdown/categoryDropdown';
import {ColumnSettingsInternal, DefaultColumnsSettings} from '../../types/columnsSettings';
import {ColumnDetailsInitial, ColumnDetailsNoSizer} from '../../types/columnDetails';
import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {CellTypeTotalsUtils} from '../columnType/cellTypeTotalsUtils';
import {CellStateColorProperties} from '../../types/cellStateColors';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {ColumnTypesUtils} from '../columnType/columnTypesUtils';
import {CellHighlightUtils} from '../color/cellHighlightUtils';

// REF-13
export class ColumnDetails {
  public static readonly MINIMAL_COLUMN_WIDTH = 34;
  public static NEW_COLUMN_WIDTH = 100;

  // prettier-ignore
  private static getHeaderDefaultColor(defaultColumnsSettings: DefaultColumnsSettings,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.header?.defaultStyle?.[key] || settings?.cellStyle?.[key] ||
      defaultColumnsSettings.header?.defaultStyle?.[key] || defaultColumnsSettings.cellStyle?.[key] || defaultColor;
  }

  // prettier-ignore
  private static getHeaderHoverColor(defaultColumnsSettings: DefaultColumnsSettings,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.header?.hoverColors?.[key] || defaultColumnsSettings.header?.hoverColors?.[key] ||
      ColumnDetails.getHeaderDefaultColor(defaultColumnsSettings, key, defaultColor, settings);
  }

  // prettier-ignore
  public static createHeaderStateColors(defaultColumnsSettings: DefaultColumnsSettings,
      settings?: ColumnSettingsInternal) {
    return {
      hover: {
        color: ColumnDetails.getHeaderHoverColor(defaultColumnsSettings,
          'color', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['color'], settings),
        backgroundColor: ColumnDetails.getHeaderHoverColor(defaultColumnsSettings,
          'backgroundColor', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES['backgroundColor'], settings),
      },
      default: {
        color: ColumnDetails.getHeaderDefaultColor(defaultColumnsSettings, 'color', '', settings),
        backgroundColor: ColumnDetails.getHeaderDefaultColor(defaultColumnsSettings, 'backgroundColor', '', settings),
      }
    };
  }

  // prettier-ignore
  public static createInitial(defaultColumnsSettings: DefaultColumnsSettings, categoryDropdown: HTMLElement,
      settings?: ColumnSettingsInternal): ColumnDetailsInitial {
    const columnSettings = settings || ColumnSettingsUtils.DEFAULT_INTERNAL_COLUMN_SETTINGS;
    const {isDefaultTextRemovable, defaultText} = columnSettings;
    const types = ColumnTypesUtils.get(columnSettings);
    const internalTypes = ColumnTypesUtils.process(types, isDefaultTextRemovable, defaultText);
    return {
      elements: [],
      settings: columnSettings,
      headerStateColors: ColumnDetails.createHeaderStateColors(defaultColumnsSettings, settings),
      bordersOverwrittenBySiblings: {},
      types: internalTypes,
      activeType: ColumnTypesUtils.getActiveType(columnSettings, types) as ColumnTypeInternal,
      categoryDropdown: CategoryDropdown.getDefaultObj(categoryDropdown),
    };
  }

  public static updateWithNoSizer(columnDetails: ColumnDetailsInitial): ColumnDetailsNoSizer {
    const newObject: Omit<ColumnDetailsNoSizer, keyof ColumnDetailsInitial> = {
      cellTypeTotals: CellTypeTotalsUtils.createObj(columnDetails.types),
    };
    Object.assign(columnDetails, newObject);
    return columnDetails as ColumnDetailsNoSizer;
  }
}
