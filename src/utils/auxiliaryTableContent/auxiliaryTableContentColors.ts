import {AuxiliaryContentCellsColors} from '../../types/auxiliaryTableContentCellsColors';
import {CellStateColorProperties, CellStateColorsR} from '../../types/cellStateColors';
import {HoverableElementStyleClient} from '../../types/hoverableElementStyle';
import {EditableTableComponent} from '../../editable-table-component';
import {CellHighlightUtils} from '../color/cellHighlightUtils';

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

  private static getInheritedDefaultColor(clientHeader: HoverableElementStyleClient, key: keyof CellStateColorProperties) {
    return clientHeader.defaultStyle?.[key] || AuxiliaryTableContentColors.CELL_COLORS.data.default?.[key];
  }

  private static getInheritedHoverColor(clientHeader: HoverableElementStyleClient, key: keyof CellStateColorProperties) {
    return clientHeader.hoverColors?.[key] || AuxiliaryTableContentColors.getInheritedDefaultColor(clientHeader, key);
  }

  private static overwriteHeaderWithInheritedColors(clientHeader: HoverableElementStyleClient) {
    AuxiliaryTableContentColors.CELL_COLORS.header = {
      default: {
        backgroundColor: AuxiliaryTableContentColors.getInheritedDefaultColor(clientHeader, 'backgroundColor'),
        color: AuxiliaryTableContentColors.getInheritedDefaultColor(clientHeader, 'color'),
      },
      hover: {
        backgroundColor: AuxiliaryTableContentColors.getInheritedHoverColor(clientHeader, 'backgroundColor'),
        color: AuxiliaryTableContentColors.getInheritedHoverColor(clientHeader, 'color'),
      },
    };
  }

  // prettier-ignore
  private static getHoverColorValue(etc: EditableTableComponent,
      colorKey: keyof CellStateColorProperties, defaultColor: string): string {
    return etc.auxiliaryTableContentInternal.style?.hoverColors?.[colorKey] || etc.cellStyle[colorKey] || defaultColor;
  }

  private static getDefaultColorValue(etc: EditableTableComponent, colorKey: keyof CellStateColorProperties) {
    return etc.auxiliaryTableContentInternal.style?.defaultStyle?.[colorKey] || etc.cellStyle[colorKey] || '';
  }

  // prettier-ignore
  public static setEventColors(etc: EditableTableComponent) {
    const cellColors = {
      default: {
        backgroundColor: AuxiliaryTableContentColors.getDefaultColorValue(etc, 'backgroundColor'),
        color: AuxiliaryTableContentColors.getDefaultColorValue(etc, 'color'),
      },
      hover: {
        backgroundColor: AuxiliaryTableContentColors.getHoverColorValue(
          etc, 'backgroundColor', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES.backgroundColor),
        color: AuxiliaryTableContentColors.getHoverColorValue(
          etc, 'color', CellHighlightUtils.DEFAULT_HOVER_PROPERTIES.color),
      },
    };
    AuxiliaryTableContentColors.CELL_COLORS.data = cellColors;
    AuxiliaryTableContentColors.CELL_COLORS.header = cellColors;
    const {auxiliaryTableContentInternal: {inheritHeaderStyle}, header} = etc;
    if (inheritHeaderStyle === undefined || inheritHeaderStyle === true) {
      AuxiliaryTableContentColors.overwriteHeaderWithInheritedColors(header)
    }
  }

  public static getColorsBasedOnParam(rowIndex: number): CellStateColorsR {
    const {data, header} = AuxiliaryTableContentColors.CELL_COLORS;
    return rowIndex === 0 ? header : data;
  }
}