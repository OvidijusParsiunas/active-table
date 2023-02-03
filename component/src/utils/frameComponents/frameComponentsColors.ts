import {CellStateColorProperties, CellStateColorsR} from '../../types/cellStateColors';
import {FrameComponentsCellsColors} from '../../types/frameComponentsCellsColors';
import {HoverableStyles} from '../../types/hoverableStyles';
import {ActiveTable} from '../../activeTable';

// frame components are comprised of index column, add new column column and add new row row
export class FrameComponentsColors {
  // prettier-ignore
  private static getInheritedDefaultColr(key: keyof CellStateColorProperties,
      dataColors: CellStateColorsR, headerStyle?: HoverableStyles) {
    return headerStyle?.default?.[key] || dataColors.default?.[key];
  }

  // prettier-ignore
  private static getInheritedHoverColor(key: keyof CellStateColorProperties,
      dataColors: CellStateColorsR, headerStyle?: HoverableStyles) {
    return (
      headerStyle?.hoverColors?.[key] ||
      dataColors.hover?.[key] ||
      FrameComponentsColors.getInheritedDefaultColr(key, dataColors, headerStyle)
    );
  }

  // prettier-ignore
  private static overwriteHeaderWithInheritedColors(cellColors: FrameComponentsCellsColors,
      headerStyles?: HoverableStyles) {
    cellColors.header = {
      default: {
        backgroundColor: FrameComponentsColors.getInheritedDefaultColr(
          'backgroundColor', cellColors.data, headerStyles),
        color: FrameComponentsColors.getInheritedDefaultColr('color', cellColors.data, headerStyles),
      },
      hover: {
        backgroundColor: FrameComponentsColors.getInheritedHoverColor(
          'backgroundColor', cellColors.data, headerStyles),
        color: FrameComponentsColors.getInheritedHoverColor('color', cellColors.data, headerStyles),
      },
    };
  }

  // prettier-ignore
  private static getHoverColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties): string {
    const {frameComponentsInternal: {style}, defaultCellHoverColors} = at;
    return style?.hoverColors?.[colorKey] || style?.default?.[colorKey]
      || at.columnsSettings.cellStyle?.[colorKey] || defaultCellHoverColors[colorKey];
  }

  // prettier-ignore
  private static getDefaultColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties) {
    return at.frameComponentsInternal.style?.default?.[colorKey]
      || at.columnsSettings.cellStyle?.[colorKey] || '';
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
    const {frameComponentsInternal: {cellColors}} = at;
    cellColors.data = newCellColors;
    cellColors.header = newCellColors;
    const {frameComponentsInternal: {inheritHeader}, columnsSettings: {headerStyles}} = at;
    if (inheritHeader === undefined || inheritHeader === true) {
      FrameComponentsColors.overwriteHeaderWithInheritedColors(cellColors, headerStyles)
    } else {
      cellColors.data.default.color = 'black';
      cellColors.header.default.color = 'black';
    }
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
