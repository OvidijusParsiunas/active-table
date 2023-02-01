import {ProcessedDataTextStyle} from '../columnType/processedDataTextStyle';
import {ColumnSettingsInternal} from '../../types/columnsSettingsInternal';
import {ColumnsSettingsDefault} from '../../types/columnsSettingsDefault';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {NoDimensionCSSStyle, CSSStyle} from '../../types/cssStyle';
import {ColumnDetails} from '../columnDetails/columnDetails';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {ElementStyle} from '../elements/elementStyle';
import {RegexUtils} from '../regex/regexUtils';
import {ActiveTable} from '../../activeTable';

export class ColumnSettingsStyleUtils {
  public static applySettingsStyleOnCell(settings: ColumnSettingsInternal, cellElement: HTMLElement, isHeader: boolean) {
    Object.assign(cellElement.style, settings.cellStyle || {}, isHeader ? settings.headerStyles?.default || {} : {});
  }

  // prettier-ignore
  private static setNewHeaderStyle(at: ActiveTable, columnDetails: ColumnDetailsT) {
    const {settings, elements} = columnDetails;
    const newHeaderStyle = settings.cellStyle || settings.headerStyles?.default;
    if (newHeaderStyle) ColumnSettingsStyleUtils.applySettingsStyleOnCell(settings, elements[0], true);
    const newStyleSettings = newHeaderStyle ? settings : undefined;
    columnDetails.headerStateColors = ColumnDetails.createHeaderStateColors(at.columnsSettings,
      newStyleSettings, at.defaultCellHoverColors);
    ColumnSettingsBorderUtils.overwriteSideBorderIfSiblingsHaveSettings(columnDetails, [elements[0]]);
  }

  private static unsetHeaderSettingStyle(headerElement: HTMLElement, style: NoDimensionCSSStyle) {
    Object.keys(style).forEach((styleName) => {
      ElementStyle.setStyle(headerElement, styleName, '');
    });
  }

  // prettier-ignore
  private static resetHeaderStyleToDefault(columnElements: HTMLElement[],
      settings: ColumnSettingsInternal, columnsSettings: ColumnsSettingsDefault) {
    if (settings.headerStyles?.default) {
      ColumnSettingsStyleUtils.unsetHeaderSettingStyle(columnElements[0], settings.headerStyles.default);
    }
    if (settings.cellStyle) ElementStyle.unsetStyle(columnElements[0], settings.cellStyle);
    const {cellStyle, headerStyles} = columnsSettings;
    CellElement.setDefaultCellStyle(columnElements[0], cellStyle, headerStyles?.default);
  }

  // prettier-ignore
  private static changeHeaderStyleFunc(this: ActiveTable, columnIndex: number, oldSettings: ColumnSettingsInternal) {
    const columnDetails = this.columnsDetails[columnIndex];
    const {elements, settings: {isHeaderTextEditable}} = columnDetails;
    ColumnSettingsStyleUtils.resetHeaderStyleToDefault(elements, oldSettings, this.columnsSettings);
    ColumnSettingsStyleUtils.setNewHeaderStyle(this, columnDetails);
    const cellClickDropdownOpen = this.columnsSettings.dropdown?.displaySettings.openMethod?.cellClick;
    const isEditable = !cellClickDropdownOpen && isHeaderTextEditable;
    CellElement.prepContentEditable(CellElement.getTextElement(elements[0]),
      Boolean(isEditable), cellClickDropdownOpen);
  }

  // prettier-ignore
  public static changeStyleFunc(at: ActiveTable, columnIndex: number, oldSettings: ColumnSettingsInternal) {
    // resetDataCellsStyle unsets and reapplies settings style hence we only need to set the header here
    ProcessedDataTextStyle.resetDataCellsStyle(at, columnIndex,
      ColumnSettingsStyleUtils.changeHeaderStyleFunc.bind(at, columnIndex, oldSettings), oldSettings.cellStyle)
  }

  private static doStylesHaveVisibleDimension(style: CSSStyle, styleKeys: (keyof CSSStyle)[]) {
    for (let i = 0; i < styleKeys.length; i += 1) {
      const styleValue = style[styleKeys[i]];
      if (styleValue) {
        const integerStrArr = RegexUtils.extractIntegerStrs(String(styleValue));
        if (integerStrArr.length > 0 && Number(integerStrArr[0]) > 0) return true;
      }
    }
    return false;
  }

  // REF-23
  // prettier-ignore
  public static doesSettingHaveSideBorderStyle(settings: ColumnSettingsInternal) {
    const settingsStyle = settings.cellStyle || settings.headerStyles?.default;
    if (settingsStyle) {
      const doesStyleHaveSideBorder = ColumnSettingsStyleUtils.doStylesHaveVisibleDimension(settingsStyle,
        ['border', 'borderLeft', 'borderLeftWidth', 'borderRight', 'borderRightWidth']);
      return doesStyleHaveSideBorder;
    }
    return false;
  }
}
