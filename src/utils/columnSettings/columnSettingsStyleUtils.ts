import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {ColumnDetails} from '../columnDetails/columnDetails';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {GenericObject} from '../../types/genericObject';
import {CSSStyle} from '../../types/cssStyle';

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

  public static applyDefaultStyles(columnElements: HTMLElement[], cellStyle: CSSStyle, headerStyle?: CSSStyle) {
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
      GenericElementUtils.setStyle(headerElement, styleName, '');
    });
  }

  // prettier-ignore
  private static resetStyleToDefault(columnElements: HTMLElement[],
      settings: ColumnSettingsInternal, cellStyle: CSSStyle, headerStyle?: CSSStyle) {
    if (settings.header?.defaultStyle) {
      ColumnSettingsStyleUtils.unsetHeaderSettingStyle(columnElements[0], settings.header.defaultStyle);
    }
    if (settings.cellStyle) ColumnSettingsStyleUtils.unsetCellSettingStyle(columnElements, settings.cellStyle);
    ColumnSettingsStyleUtils.applyDefaultStyles(columnElements, cellStyle, headerStyle);
  }

  // prettier-ignore
  private static updateColumnStyle(etc: EditableTableComponent,
      columnDetails: ColumnDetailsT, settings: ColumnSettingsInternal, isSetNew: boolean) {
    const {cellStyle, header} = etc;
    ColumnSettingsStyleUtils.resetStyleToDefault(columnDetails.elements, settings, cellStyle, header.defaultStyle);
    if (isSetNew) ColumnSettingsStyleUtils.applySettingStyle(columnDetails.elements, settings);
    columnDetails.headerStateColors = ColumnDetails.createHeaderStateColors(etc, isSetNew ? settings : undefined);
  }

  // prettier-ignore
  public static changeStyle(etc: EditableTableComponent, columnDetails: ColumnDetailsT,
      oldSettings: ColumnSettingsInternal | undefined, newSettings?: ColumnSettingsInternal) {
    if (newSettings && (newSettings.cellStyle || newSettings.header)) {
      ColumnSettingsStyleUtils.updateColumnStyle(etc, columnDetails, newSettings, true);
    } else if (oldSettings && (oldSettings.cellStyle || oldSettings.header)) {
      ColumnSettingsStyleUtils.updateColumnStyle(etc, columnDetails, oldSettings, false);
    }
  }
}
