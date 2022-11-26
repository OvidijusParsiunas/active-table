import {ToggleAdditionElements} from '../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {AuxiliaryContentCellsColors} from '../../types/auxiliaryTableContentCellsColors';
import {HoverableElementStyleClient} from '../../types/hoverableElementStyle';
import {EditableTableComponent} from '../../editable-table-component';
import {CellStateColorProperties} from '../../types/cellStateColors';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {CellHighlightUtil} from '../color/cellHighlightUtil';

// auxiliary content is comprised of index column, add new column column and add new row row
export class AuxiliaryTableContent {
  // the reason why cell and header colors are separate is because header can inherit the user set header style
  // hence it is easy to control what the header style should be in this variable
  public static EVENT_COLORS: AuxiliaryContentCellsColors = {
    data: {
      defaultColor: {backgroundColor: '', color: ''},
      hoverColor: {backgroundColor: '', color: ''},
    },
    header: {
      defaultColor: {backgroundColor: '', color: ''},
      hoverColor: {backgroundColor: '', color: ''},
    },
  };

  private static getInheritedDefaultColor(clientHeader: HoverableElementStyleClient, key: keyof CellStateColorProperties) {
    return clientHeader.defaultStyle?.[key] || AuxiliaryTableContent.EVENT_COLORS.data.defaultColor?.[key];
  }

  private static getInheritedHoverColor(clientHeader: HoverableElementStyleClient, key: keyof CellStateColorProperties) {
    return clientHeader.hoverColor?.[key] || AuxiliaryTableContent.getInheritedDefaultColor(clientHeader, key);
  }

  private static overwriteHeaderWithInheritedColors(clientHeader: HoverableElementStyleClient) {
    AuxiliaryTableContent.EVENT_COLORS.header = {
      defaultColor: {
        backgroundColor: AuxiliaryTableContent.getInheritedDefaultColor(clientHeader, 'backgroundColor'),
        color: AuxiliaryTableContent.getInheritedDefaultColor(clientHeader, 'color'),
      },
      hoverColor: {
        backgroundColor: AuxiliaryTableContent.getInheritedHoverColor(clientHeader, 'backgroundColor'),
        color: AuxiliaryTableContent.getInheritedHoverColor(clientHeader, 'color'),
      },
    };
  }

  // prettier-ignore
  private static getHoverColorValue(etc: EditableTableComponent,
      colorKey: keyof CellStateColorProperties, defaultValue: string): string {
    return etc.auxiliaryTableContentProps.style?.hoverColor?.[colorKey] || etc.cellStyle[colorKey] || defaultValue;
  }

  private static getDefaultColorValue(etc: EditableTableComponent, colorKey: keyof CellStateColorProperties) {
    return etc.auxiliaryTableContentProps.style?.defaultStyle?.[colorKey] || etc.cellStyle[colorKey] || '';
  }

  // prettier-ignore
  public static setEventColors(etc: EditableTableComponent) {
    const cellColors = {
      defaultColor: {
        backgroundColor: AuxiliaryTableContent.getDefaultColorValue(etc, 'backgroundColor'),
        color: AuxiliaryTableContent.getDefaultColorValue(etc, 'color'),
      },
      hoverColor: {
        backgroundColor: AuxiliaryTableContent.getHoverColorValue(
          etc, 'backgroundColor', CellHighlightUtil.DEFAULT_HOVER_PROPERTIES.backgroundColor),
        color: AuxiliaryTableContent.getHoverColorValue(
          etc, 'color', CellHighlightUtil.DEFAULT_HOVER_PROPERTIES.color),
      },
    };
    AuxiliaryTableContent.EVENT_COLORS.data = cellColors;
    AuxiliaryTableContent.EVENT_COLORS.header = cellColors;
    const { auxiliaryTableContentProps: { inheritHeaderStyle }, header } = etc;
    if (inheritHeaderStyle === undefined || inheritHeaderStyle === true) {
      AuxiliaryTableContent.overwriteHeaderWithInheritedColors(header)
    }
  }

  // prettier-ignore
  public static getCellColors(param: number | HTMLElement) {
    const {data, header} = AuxiliaryTableContent.EVENT_COLORS;
    const isHeaderCell = typeof param === 'number'
      ? param === 0 : GenericElementUtils.isFirstChildInParent(param);
    return isHeaderCell ? header : data;
  }

  // index and add column cells are added on row insertion
  // CAUTION-4
  public static addAuxiliaryBodyElements(etc: EditableTableComponent) {
    // add new row element - REF-18 (the row element has already been created and cell added to it)
    etc.tableBodyElementRef?.appendChild(etc.addRowCellElementRef?.parentElement as HTMLElement);
    ToggleAdditionElements.update(etc, true, AddNewRowElement.toggle);
  }
}
