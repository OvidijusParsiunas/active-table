import {CellProcessedTextStyle} from '../../types/processedTextStyle';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {DefaultColumnsSettings} from '../../types/columnsSettings';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';

export class ResetColumnStyles {
  public static applyDefaultStyles(columnElements: HTMLElement[], defaultColumnsSettings: DefaultColumnsSettings) {
    const {cellStyle, headerStyleProps: header} = defaultColumnsSettings;
    CellElement.setDefaultCellStyle(columnElements[0], cellStyle, header?.default);
    columnElements.slice(1).forEach((element) => {
      CellElement.setDefaultCellStyle(element, cellStyle);
    });
  }

  private static unsetLastAppliedStyle(processedStyle: CellProcessedTextStyle, textContainerElement: HTMLElement) {
    Object.keys(processedStyle.lastAppliedStyle).forEach((key) => {
      GenericElementUtils.setStyle(textContainerElement, key, '');
    });
  }

  // if this operation turns out to be expensive - try to save and reuse the default style
  // prettier-ignore
  public static setDefaultStyle(columnDetails: ColumnDetailsT, processedStyle: CellProcessedTextStyle,
      textContainerElement: HTMLElement, defaultColumnsSettings: DefaultColumnsSettings) {
    ResetColumnStyles.unsetLastAppliedStyle(processedStyle, textContainerElement);
    if (columnDetails.settings.cellStyle) {
      ColumnSettingsStyleUtils.unsetCellSettingStyle(textContainerElement, columnDetails.settings.cellStyle);
    }
    CellElement.setDefaultCellStyle(textContainerElement, defaultColumnsSettings.cellStyle);
    ColumnSettingsStyleUtils.applySettingsStyleOnCell(columnDetails.settings, textContainerElement, false);
  }
}
