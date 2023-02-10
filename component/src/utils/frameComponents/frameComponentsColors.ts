import {CellStateColorProperties, CellStateColorsR, DefaultCellHoverColors} from '../../types/cellStateColors';
import {FrameComponentsCellsColors} from '../../types/frameComponentsCellsColors';
import {HoverableStyles} from '../../types/hoverableStyles';
import {ActiveTable} from '../../activeTable';

// frame components are comprised of index column, add new column column and add new row row
export class FrameComponentsColors {
  private static getInheritedHeaderColors(defaultCellHoverColors: DefaultCellHoverColors, headerStyles?: HoverableStyles) {
    return {
      default: {
        backgroundColor: headerStyles?.default?.backgroundColor || 'white', // defining style for add new column header
        color: headerStyles?.default?.color || '',
      },
      hover: {
        backgroundColor: headerStyles?.hoverColors?.backgroundColor || defaultCellHoverColors.backgroundColor,
        color: headerStyles?.hoverColors?.color || defaultCellHoverColors.color,
      },
    };
  }

  // prettier-ignore
  private static getHoverColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties): string {
    const {frameComponentsInternal: {style}, defaultCellHoverColors} = at;
    return style?.hoverColors?.[colorKey] || style?.default?.[colorKey]
      || at._columnsSettingsDefault.cellStyle?.[colorKey] || defaultCellHoverColors[colorKey];
  }

  // prettier-ignore
  private static getDefaultColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties) {
    return at.frameComponentsInternal.style?.default?.[colorKey]
      || at._columnsSettingsDefault.cellStyle?.[colorKey] || '';
  }

  // prettier-ignore
  public static setEventColors(at: ActiveTable) {
    const newCellColors = {
      default: {
        backgroundColor: FrameComponentsColors.getDefaultColorValue(at, 'backgroundColor'),
        color: FrameComponentsColors.getDefaultColorValue(at, 'color'),
      },
      hover: {
        backgroundColor: FrameComponentsColors.getHoverColorValue(at, 'backgroundColor'),
        color: FrameComponentsColors.getHoverColorValue(at, 'color'),
      },
    };
    const {frameComponentsInternal: {cellColors, inheritHeaderColors}, _columnsSettingsDefault: {headerStyles}} = at;
    cellColors.data = newCellColors;
    cellColors.header = inheritHeaderColors ?
      FrameComponentsColors.getInheritedHeaderColors(at.defaultCellHoverColors, headerStyles) : newCellColors;
  }

  public static getColorsBasedOnParam(cellColors: FrameComponentsCellsColors, rowIndex: number): CellStateColorsR {
    const {data, header} = cellColors;
    return rowIndex === 0 ? header : data;
  }

  public static getDefaultCellColors() {
    return {
      data: {
        default: {backgroundColor: '', color: ''},
        hover: {backgroundColor: '', color: ''},
      },
      header: {
        default: {backgroundColor: '', color: ''},
        hover: {backgroundColor: '', color: ''},
      },
    };
  }
}
