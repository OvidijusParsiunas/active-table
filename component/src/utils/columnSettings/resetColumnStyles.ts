import {ColumnsSettingsDefault} from '../../types/columnsSettingsDefault';
import {CellProcessedTextStyle} from '../../types/processedTextStyle';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {ElementStyle} from '../elements/elementStyle';
import {CellCSSStyle} from '../../types/cssStyle';

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
      GenericElementUtils.setStyle(textContainerElement, key, '');
    });
  }

  // if this operation turns out to be expensive - try to save and reuse the default style
  // prettier-ignore
  public static setDefaultStyle(columnDetails: ColumnDetailsT, processedStyle: CellProcessedTextStyle,
      textContainerElement: HTMLElement, columnsSettings: ColumnsSettingsDefault, oldCellStyle?: CellCSSStyle) {
    ResetColumnStyles.unsetLastAppliedStyle(processedStyle, textContainerElement);
    if (oldCellStyle) ElementStyle.unsetStyle(textContainerElement, oldCellStyle);
    CellElement.setDefaultCellStyle(textContainerElement, columnsSettings.cellStyle);
    ColumnSettingsStyleUtils.applySettingsStyleOnCell(columnDetails.settings, textContainerElement, false);
  }
}
