import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {ColumnDetails} from '../columnDetails/columnDetails';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {GenericObject} from '../../types/genericObject';
import {CSSStyle} from '../../types/cssStyle';

export class ColumnSettingsStyleUtil {
  public static setSettingsStyleOnCell(settings: ColumnSettingsInternal, cellElement: HTMLElement, isHeader: boolean) {
    Object.assign(cellElement.style, settings.cellStyle || {}, isHeader ? settings.header?.defaultStyle || {} : {});
  }

  private static setSettingStyle(columnElements: HTMLElement[], settings: ColumnSettingsInternal) {
    ColumnSettingsStyleUtil.setSettingsStyleOnCell(settings, columnElements[0], true);
    columnElements.slice(1).forEach((element) => {
      ColumnSettingsStyleUtil.setSettingsStyleOnCell(settings, element, false);
    });
  }

  private static setDefaultStyles(columnElements: HTMLElement[], cellStyle: CSSStyle, headerStyle?: CSSStyle) {
    CellElement.setDefaultCellStyle(columnElements[0], cellStyle, headerStyle);
    columnElements.slice(1).forEach((element) => {
      CellElement.setDefaultCellStyle(element, cellStyle);
    });
  }

  private static unsetCellSettingStyle(columnElements: HTMLElement[], style: CSSStyle) {
    const unsetStyles = Object.keys(style).reduce<GenericObject>((obj, styleName) => {
      obj[styleName] = '';
      return obj;
    }, {});
    columnElements.forEach((element) => Object.assign(element.style, unsetStyles));
  }

  private static unsetHeaderSettingStyle(headerElement: HTMLElement, style: CSSStyle) {
    Object.keys(style).forEach((styleName) => {
      (headerElement.style as unknown as GenericObject)[styleName] = '';
    });
  }

  // prettier-ignore
  private static resetStyleToDefault(columnElements: HTMLElement[],
      settings: ColumnSettingsInternal, cellStyle: CSSStyle, headerStyle?: CSSStyle) {
    if (settings.header?.defaultStyle) {
      ColumnSettingsStyleUtil.unsetHeaderSettingStyle(columnElements[0], settings.header.defaultStyle);
    }
    if (settings.cellStyle) ColumnSettingsStyleUtil.unsetCellSettingStyle(columnElements, settings.cellStyle);
    ColumnSettingsStyleUtil.setDefaultStyles(columnElements, cellStyle, headerStyle);
  }

  // prettier-ignore
  private static updateColumnStyle(etc: EditableTableComponent,
      columnDetails: ColumnDetailsT, settings: ColumnSettingsInternal, isSetNew: boolean) {
    const {cellStyle, header} = etc;
    ColumnSettingsStyleUtil.resetStyleToDefault(columnDetails.elements, settings, cellStyle, header);
    if (isSetNew) ColumnSettingsStyleUtil.setSettingStyle(columnDetails.elements, settings);
    columnDetails.headerStateColors = ColumnDetails.createHeaderStateColors(etc, isSetNew ? settings : {});
  }

  // prettier-ignore
  public static changeStyle(etc: EditableTableComponent, columnDetails: ColumnDetailsT,
      oldSettings: ColumnSettingsInternal | undefined, newSettings: ColumnSettingsInternal) {
    if (newSettings && (newSettings.cellStyle || newSettings.header)) {
      ColumnSettingsStyleUtil.updateColumnStyle(etc, columnDetails, newSettings, true);
    } else if (oldSettings && (oldSettings.cellStyle || oldSettings.header)) {
      ColumnSettingsStyleUtil.updateColumnStyle(etc, columnDetails, oldSettings, false);
    }
  }
}
