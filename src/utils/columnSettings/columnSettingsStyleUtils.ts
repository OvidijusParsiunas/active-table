import {ColumnSettingsInternal, DefaultColumnsSettings} from '../../types/columnsSettings';
import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {ProcessedTextStyle} from '../columnType/processedTextStyle';
import {ColumnDetails} from '../columnDetails/columnDetails';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {GenericObject} from '../../types/genericObject';
import {CellCSSStyle} from '../../types/cssStyle';

export class ColumnSettingsStyleUtils {
  public static applySettingsStyleOnCell(settings: ColumnSettingsInternal, cellElement: HTMLElement, isHeader: boolean) {
    Object.assign(cellElement.style, settings.cellStyle || {}, isHeader ? settings.header?.defaultStyle || {} : {});
  }

  private static applySettingStyle(columnElements: HTMLElement[], settings: ColumnSettingsInternal) {
    ColumnSettingsStyleUtils.applySettingsStyleOnCell(settings, columnElements[0], true);
    columnElements.slice(1).forEach((element) => {
      ColumnSettingsStyleUtils.applySettingsStyleOnCell(settings, element, false);
    });
  }

  public static applyDefaultStyles(columnElements: HTMLElement[], defaultColumnsSettings: DefaultColumnsSettings) {
    const {cellStyle, header} = defaultColumnsSettings;
    CellElement.setDefaultCellStyle(columnElements[0], cellStyle, header?.defaultStyle);
    columnElements.slice(1).forEach((element) => {
      CellElement.setDefaultCellStyle(element, cellStyle);
    });
  }

  private static unsetCellSettingStyle(columnElements: HTMLElement[], style: CellCSSStyle) {
    const unsetStyles = Object.keys(style).reduce<GenericObject>((obj, styleName) => {
      obj[styleName] = '';
      return obj;
    }, {});
    columnElements.forEach((element) => Object.assign(element.style, unsetStyles));
  }

  private static unsetHeaderSettingStyle(headerElement: HTMLElement, style: CellCSSStyle) {
    Object.keys(style).forEach((styleName) => {
      GenericElementUtils.setStyle(headerElement, styleName, '');
    });
  }

  // prettier-ignore
  private static resetStyleToDefault(columnElements: HTMLElement[],
      settings: ColumnSettingsInternal, defaultColumnsSettings: DefaultColumnsSettings) {
    if (settings.header?.defaultStyle) {
      ColumnSettingsStyleUtils.unsetHeaderSettingStyle(columnElements[0], settings.header.defaultStyle);
    }
    if (settings.cellStyle) ColumnSettingsStyleUtils.unsetCellSettingStyle(columnElements, settings.cellStyle);
    ColumnSettingsStyleUtils.applyDefaultStyles(columnElements, defaultColumnsSettings);
  }

  // prettier-ignore
  private static updateColumnStyle(defaultColumnsSettings: DefaultColumnsSettings,
      columnDetails: ColumnDetailsT, settings: ColumnSettingsInternal, isSetNew: boolean) {
    ColumnSettingsStyleUtils.resetStyleToDefault(columnDetails.elements, settings, defaultColumnsSettings);
    if (isSetNew) ColumnSettingsStyleUtils.applySettingStyle(columnDetails.elements, settings);
    columnDetails.headerStateColors = ColumnDetails.createHeaderStateColors(
      defaultColumnsSettings, isSetNew ? settings : undefined);
  }

  // prettier-ignore
  private static changeStyleFunc(this: EditableTableComponent, columnIndex: number,
      oldSettings: ColumnSettingsInternal, newSettings: ColumnSettingsInternal) {
    const columnDetails = this.columnsDetails[columnIndex];
    if (newSettings.cellStyle || newSettings.header?.defaultStyle) {
      ColumnSettingsStyleUtils.updateColumnStyle(this.defaultColumnsSettings, columnDetails, newSettings, true);
    } else if (oldSettings.cellStyle || oldSettings.header?.defaultStyle) {
      ColumnSettingsStyleUtils.updateColumnStyle(this.defaultColumnsSettings, columnDetails, oldSettings, false);
    }
  }

  // prettier-ignore
  public static changeStyle(etc: EditableTableComponent, columnIndex: number,
      oldSettings: ColumnSettingsInternal, newSettings: ColumnSettingsInternal) {
    ProcessedTextStyle.resetColumnStyle(etc, columnIndex,
      ColumnSettingsStyleUtils.changeStyleFunc.bind(etc, columnIndex, oldSettings, newSettings))
  }
}
