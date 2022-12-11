import {ColumnSettingsBorderUtils} from '../columnSettings/columnSettingsBorderUtils';
import {ColumnSettingsStyleUtils} from '../columnSettings/columnSettingsStyleUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CustomTextProcessing} from '../../types/customTextProcessing';
import {CellProcessedTextStyle} from '../../types/processedTextStyle';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {DefaultColumnsSettings} from '../../types/columnsSettings';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {CellText} from '../../types/tableContents';

// REF-3
export class ProcessedTextStyle {
  private static readonly DEFAULT_FAILED_VALIDATION_STYLE = {color: 'grey'};

  // prettier-ignore
  private static setCustomStyle(changeStyle: CustomTextProcessing['changeStyle'], text: CellText,
      columnDetails: ColumnDetailsT, processedStyle: CellProcessedTextStyle,
      textContainerElement: HTMLElement, defaultColumnsSettings: DefaultColumnsSettings) {
    if (changeStyle) {
      ProcessedTextStyle.setDefaultStyle(columnDetails, processedStyle, textContainerElement, defaultColumnsSettings);
      const newStyle = changeStyle(String(text));
      Object.assign(textContainerElement.style, newStyle);
      processedStyle.lastAppliedStyle = newStyle;
      ColumnSettingsBorderUtils.overwriteSideBorderIfSiblingsHaveSettings(columnDetails, [textContainerElement]);
    }
  }

  // prettier-ignore
  private static setFailedValidationStyle(columnDetails: ColumnDetailsT, processedStyle: CellProcessedTextStyle,
      textContainerElement: HTMLElement) {
    const {textValidation} = columnDetails.activeType;
    const failedStyle = textValidation.failedStyle || ProcessedTextStyle.DEFAULT_FAILED_VALIDATION_STYLE;
    Object.assign(textContainerElement.style, failedStyle);
    processedStyle.lastAppliedStyle = failedStyle;
  }

  private static unsetLastAppliedStyle(processedStyle: CellProcessedTextStyle, textContainerElement: HTMLElement) {
    Object.keys(processedStyle.lastAppliedStyle).forEach((key) => {
      GenericElementUtils.setStyle(textContainerElement, key, '');
    });
  }

  // if this operation turns out to be expensive - try to save and reuse the default style
  // prettier-ignore
  private static setDefaultStyle(columnDetails: ColumnDetailsT, processedStyle: CellProcessedTextStyle,
      textContainerElement: HTMLElement, defaultColumnsSettings: DefaultColumnsSettings) {
    ProcessedTextStyle.unsetLastAppliedStyle(processedStyle, textContainerElement);
    CellElement.setDefaultCellStyle(textContainerElement, defaultColumnsSettings.cellStyle);
    ColumnSettingsStyleUtils.applySettingsStyleOnCell(columnDetails.settings, textContainerElement, false);
  }

  // prettier-ignore
  private static setStyle(isValid: boolean, columnDetails: ColumnDetailsT, processedStyle: CellProcessedTextStyle,
      customTextProcessing: CustomTextProcessing | undefined, textContainerElement: HTMLElement,
      defaultColumnsSettings: DefaultColumnsSettings): boolean {
    let wasValidationStyleSet = false; // REF-3
    if (!isValid) {
      if (customTextProcessing?.changeStyle) {
        ProcessedTextStyle.setDefaultStyle(columnDetails, processedStyle, textContainerElement, defaultColumnsSettings);
      }
      ProcessedTextStyle.setFailedValidationStyle(columnDetails, processedStyle, textContainerElement);
      wasValidationStyleSet = true;
    } else if (!customTextProcessing?.changeStyle) { // REF-3 - set to default if no custom processing will occur
      ProcessedTextStyle.setDefaultStyle(columnDetails, processedStyle, textContainerElement, defaultColumnsSettings);
      processedStyle.lastAppliedStyle = {};
      wasValidationStyleSet = true;
    }
    if (wasValidationStyleSet) {
      ColumnSettingsBorderUtils.overwriteSideBorderIfSiblingsHaveSettings(columnDetails, [textContainerElement]);
    }
    return wasValidationStyleSet;
  }

  // prettier-ignore
  public static setCellStyle(etc: EditableTableComponent, rowIndex: number, columnIndex: number, overwrite = false) {
    const columnDetails = etc.columnsDetails[columnIndex];
    const textContainerElement = columnDetails.elements[rowIndex];
    const processedStyle = columnDetails.processedStyle[rowIndex];
    const text = CellElement.getText(textContainerElement);
    const {textValidation: {func: validationFunc}, customTextProcessing} = columnDetails.activeType;
    let wasValidationStyleSet = false; // REF-3
    if (validationFunc) {
      const isValid = validationFunc(text);
      if (overwrite || processedStyle.isValid !== isValid) {
        wasValidationStyleSet = ProcessedTextStyle.setStyle(isValid, columnDetails, processedStyle, customTextProcessing,
          textContainerElement, etc.defaultColumnsSettings);
        processedStyle.isValid = isValid;
      }
    }
    if (!wasValidationStyleSet && customTextProcessing?.changeStyle) { // REF-3
      ProcessedTextStyle.setCustomStyle(customTextProcessing.changeStyle, text, columnDetails, processedStyle,
        textContainerElement, etc.defaultColumnsSettings);
    }
  }

  private static setStyleOnColumn(etc: EditableTableComponent, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    columnDetails.elements.slice(1).forEach((_, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      ProcessedTextStyle.setCellStyle(etc, relativeRowIndex, columnIndex, true);
    });
  }

  private static unsetStyleOnColumn(etc: EditableTableComponent, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    columnDetails.elements.slice(1).forEach((element, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      const processedStyle = columnDetails.processedStyle[relativeRowIndex];
      ProcessedTextStyle.setDefaultStyle(columnDetails, processedStyle, element, etc.defaultColumnsSettings);
    });
  }

  // using this to first unset the previous processed style, allow new settings/type to be applied and then set
  // new style
  public static resetColumnStyle(etc: EditableTableComponent, columnIndex: number, changeFunc: () => void) {
    ProcessedTextStyle.unsetStyleOnColumn(etc, columnIndex);
    changeFunc(); // arguments are expected to be binded
    ProcessedTextStyle.setStyleOnColumn(etc, columnIndex);
  }

  // prettier-ignore
  // this is used for a case where the default style has been set and need to reapply the processed style
  // without having to rerun the validation/changeStyle functions
  public static reapplyColumnStyle(etc: EditableTableComponent, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    const {textValidation: { func: validationFunc }, customTextProcessing} = columnDetails.activeType;
    if (validationFunc || customTextProcessing?.changeStyle) {
      columnDetails.elements.slice(1).forEach((element, rowIndex) => {
        const relativeRowIndex = rowIndex + 1;
        Object.assign(element.style, columnDetails.processedStyle[relativeRowIndex].lastAppliedStyle);
      }); 
    }
  }

  public static getDefaultProcessedTextStyle(): CellProcessedTextStyle {
    return {isValid: true, lastAppliedStyle: {}};
  }
}
