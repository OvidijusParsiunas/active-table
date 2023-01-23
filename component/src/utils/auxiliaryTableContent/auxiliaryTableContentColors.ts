import {AuxiliaryContentCellsColors} from '../../types/auxiliaryTableContentCellsColors';
import {CellStateColorProperties, CellStateColorsR} from '../../types/cellStateColors';
import {HoverableElementStyleClient} from '../../types/hoverableElementStyle';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {ActiveTable} from '../../activeTable';

// auxiliary content is comprised of index column, add new column column and add new row row
export class AuxiliaryTableContentColors {
  // the reason why cell and header colors are separate is because header can inherit the user set header style
  // hence it is easy to control what the header style should be in this variable
  public static CELL_COLORS: AuxiliaryContentCellsColors = {
    data: {
      default: {backgroundColor: '', color: ''},
      hover: {backgroundColor: '', color: ''},
    },
    header: {
      default: {backgroundColor: '', color: ''},
      hover: {backgroundColor: '', color: ''},
    },
  };

  private static getInheritedDefaultColr(key: keyof CellStateColorProperties, headerStyle?: HoverableElementStyleClient) {
    return headerStyle?.default?.[key] || AuxiliaryTableContentColors.CELL_COLORS.data.default?.[key];
  }

  private static getInheritedHoverColor(key: keyof CellStateColorProperties, headerStyle?: HoverableElementStyleClient) {
    return (
      headerStyle?.hoverColors?.[key] ||
      AuxiliaryTableContentColors.CELL_COLORS.data.hover?.[key] ||
      AuxiliaryTableContentColors.getInheritedDefaultColr(key, headerStyle)
    );
  }

  private static overwriteHeaderWithInheritedColors(headerStyleProps?: HoverableElementStyleClient) {
    AuxiliaryTableContentColors.CELL_COLORS.header = {
      default: {
        backgroundColor: AuxiliaryTableContentColors.getInheritedDefaultColr('backgroundColor', headerStyleProps),
        color: AuxiliaryTableContentColors.getInheritedDefaultColr('color', headerStyleProps),
      },
      hover: {
        backgroundColor: AuxiliaryTableContentColors.getInheritedHoverColor('backgroundColor', headerStyleProps),
        color: AuxiliaryTableContentColors.getInheritedHoverColor('color', headerStyleProps),
      },
    };
  }

  // prettier-ignore
  private static getHoverColorValue(at: ActiveTable,
      colorKey: keyof CellStateColorProperties, defaultColor: string): string {
    const {styleProps} = at.auxiliaryTableContentInternal;
    return styleProps?.hoverColors?.[colorKey] || styleProps?.default?.[colorKey]
      || at.columnsSettings.cellStyle?.[colorKey] || defaultColor;
  }

  // prettier-ignore
  private static getDefaultColorValue(at: ActiveTable, colorKey: keyof CellStateColorProperties) {
    return at.auxiliaryTableContentInternal.styleProps?.default?.[colorKey]
      || at.columnsSettings.cellStyle?.[colorKey] || '';
  }

  // prettier-ignore
  public static setEventColors(at: ActiveTable) {
    const cellColors = {
      default: {
        backgroundColor: AuxiliaryTableContentColors.getDefaultColorValue(at, 'backgroundColor'),
        color: AuxiliaryTableContentColors.getDefaultColorValue(at, 'color'),
      },
      hover: {
        backgroundColor: AuxiliaryTableContentColors.getHoverColorValue(
          at, 'backgroundColor', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES.backgroundColor),
        color: AuxiliaryTableContentColors.getHoverColorValue(
          at, 'color', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES.color),
      },
    };
    AuxiliaryTableContentColors.CELL_COLORS.data = cellColors;
    AuxiliaryTableContentColors.CELL_COLORS.header = cellColors;
    const {auxiliaryTableContentInternal: {inheritHeaderStyle}, columnsSettings: {headerStyleProps}} = at;
    if (inheritHeaderStyle === undefined || inheritHeaderStyle === true) {
      AuxiliaryTableContentColors.overwriteHeaderWithInheritedColors(headerStyleProps)
    } else {
      AuxiliaryTableContentColors.CELL_COLORS.data.default.color = 'black';
      AuxiliaryTableContentColors.CELL_COLORS.header.default.color = 'black';
    }
  }

  public static getColorsBasedOnParam(rowIndex: number): CellStateColorsR {
    const {data, header} = AuxiliaryTableContentColors.CELL_COLORS;
    return rowIndex === 0 ? header : data;
  }
}
