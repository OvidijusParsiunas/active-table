import {ColumnsSettingsDefault} from '../../types/columnsSettingsDefault';
import {CellProcessedTextStyle} from '../../types/processedTextStyle';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {NoDimensionCSSStyle} from '../../types/cssStyle';
import {ElementStyle} from '../elements/elementStyle';

export class ResetColumnStyles {
  public static applyDefaultStyles(columnElements: HTMLElement[], columnsSettings: ColumnsSettingsDefault) {
    const {cellStyle, headerStyles} = columnsSettings;
    CellElement.setDefaultCellStyle(columnElements[0], cellStyle, headerStyles?.default);
    columnElements.slice(1).forEach((element) => {
      CellElement.setDefaultCellStyle(element, cellStyle);
    });
  }

  private static unsetLastAppliedStyle(processedStyle: CellProcessedTextStyle, textContainerElement: HTMLElement) {
    Object.keys(processedStyle.lastAppliedStyle).forEach((key) => {
      ElementStyle.setStyle(textContainerElement, key, '');
    });
  }

  // if this operation turns out to be expensive - try to save and reuse the default style
  // prettier-ignore
  public static setDefaultStyle(columnDetails: ColumnDetailsT, processedStyle: CellProcessedTextStyle,
      textContainerElement: HTMLElement, columnsSettings: ColumnsSettingsDefault, oldCellStyle?: NoDimensionCSSStyle) {
    ResetColumnStyles.unsetLastAppliedStyle(processedStyle, textContainerElement);
    if (oldCellStyle) ElementStyle.unsetStyle(textContainerElement, oldCellStyle);
    CellElement.setDefaultCellStyle(textContainerElement, columnsSettings.cellStyle);
    ColumnSettingsStyleUtils.applySettingsStyleOnCell(columnDetails.settings, textContainerElement, false);
  }
}
