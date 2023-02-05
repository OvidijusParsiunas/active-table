import {ColumnDetailsInitial, ColumnDetailsNoSizer, ColumnDetailsT} from '../../types/columnDetails';
import {CellStateColorProperties, DefaultCellHoverColors} from '../../types/cellStateColors';
import {CellDropdown} from '../../elements/dropdown/cellDropdown/cellDropdown';
import {ColumnSettingsInternal} from '../../types/columnsSettingsInternal';
import {ColumnsSettingsDefault} from '../../types/columnsSettingsDefault';
import {CellTypeTotalsUtils} from '../columnType/cellTypeTotalsUtils';
import {ColumnTypesUtils} from '../columnType/columnTypesUtils';

// REF-13
export class ColumnDetails {
  public static readonly MINIMAL_COLUMN_WIDTH = 34;

  // prettier-ignore
  private static getHeaderDefaultColor(columnsSettings: ColumnsSettingsDefault,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.headerStyles?.default?.[key] || settings?.cellStyle?.[key] ||
      columnsSettings.headerStyles?.default?.[key] || columnsSettings.cellStyle?.[key] || defaultColor;
  }

  // prettier-ignore
  private static getHeaderHoverColor(columnsSettings: ColumnsSettingsDefault,
      key: keyof CellStateColorProperties, defaultColor: string, settings?: ColumnSettingsInternal) {
    return settings?.headerStyles?.hoverColors?.[key] || columnsSettings.headerStyles?.hoverColors?.[key] ||
      ColumnDetails.getHeaderDefaultColor(columnsSettings, key, defaultColor, settings);
  }

  // prettier-ignore
  public static createHeaderStateColors(columnsSettings: ColumnsSettingsDefault,
      settings: ColumnSettingsInternal | undefined, defaultCellHoverColors: DefaultCellHoverColors) {
    return {
      hover: {
        color: ColumnDetails.getHeaderHoverColor(columnsSettings, 'color', defaultCellHoverColors['color'], settings),
        backgroundColor: ColumnDetails.getHeaderHoverColor(columnsSettings,
          'backgroundColor', defaultCellHoverColors['backgroundColor'], settings),
      },
      default: {
        color: ColumnDetails.getHeaderDefaultColor(columnsSettings, 'color', '', settings),
        backgroundColor: ColumnDetails.getHeaderDefaultColor(columnsSettings, 'backgroundColor', '', settings),
      }
    };
  }

  // prettier-ignore
  public static createInitial(columnsSettings: ColumnsSettingsDefault, cellDropdown: HTMLElement,
      settings: ColumnSettingsInternal, defaultCellHoverColors: DefaultCellHoverColors,
      fireColumnsUpdate: ColumnDetailsT['fireColumnsUpdate']): ColumnDetailsInitial {
    const columnSettings = settings || columnsSettings;
    return {
      elements: [],
      processedStyle: [],
      settings: columnSettings,
      headerStateColors: ColumnDetails.createHeaderStateColors(columnsSettings, settings, defaultCellHoverColors),
      bordersOverwrittenBySiblings: {},
      activeType: ColumnTypesUtils.getActiveType(columnSettings),
      cellDropdown: CellDropdown.getDefaultObj(cellDropdown),
      fireColumnsUpdate,
    };
  }

  // prettier-ignore
  public static updateWithNoSizer(columnDetails: ColumnDetailsInitial,
      columnDropdownCellOverlay: HTMLElement): ColumnDetailsNoSizer {
    const newObject: Omit<ColumnDetailsNoSizer, keyof ColumnDetailsInitial> = {
      cellTypeTotals: CellTypeTotalsUtils.createObj(columnDetails.settings.types),
      columnDropdownCellOverlay,
    };
    Object.assign(columnDetails, newObject);
    return columnDetails as ColumnDetailsNoSizer;
  }
}
