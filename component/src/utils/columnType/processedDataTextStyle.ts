import {ColumnSettingsBorderUtils} from '../columnSettings/columnSettingsBorderUtils';
import {ColumnsSettingsDefault} from '../../types/columnsSettingsDefault';
import {EditableTableComponent} from '../../editable-table-component';
import {CustomTextProcessing} from '../../types/customTextProcessing';
import {CellProcessedTextStyle} from '../../types/processedTextStyle';
import {ResetColumnStyles} from '../columnSettings/resetColumnStyles';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {CellText} from '../../types/tableContents';
import {CellCSSStyle} from '../../types/cssStyle';

// this class only operates on data cells
// REF-3
export class ProcessedDataTextStyle {
  private static readonly DEFAULT_FAILED_VALIDATION_STYLE = {color: 'grey'};

  // prettier-ignore
  private static setCustomStyle(changeStyle: CustomTextProcessing['changeStyle'], text: CellText,
      columnDetails: ColumnDetailsT, processedStyle: CellProcessedTextStyle,
      textContainerElement: HTMLElement, defaultColumnsSettings: ColumnsSettingsDefault) {
    if (changeStyle) {
      ResetColumnStyles.setDefaultStyle(columnDetails, processedStyle, textContainerElement, defaultColumnsSettings);
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
    const failedStyle = textValidation.failedStyle || ProcessedDataTextStyle.DEFAULT_FAILED_VALIDATION_STYLE;
    Object.assign(textContainerElement.style, failedStyle);
    processedStyle.lastAppliedStyle = failedStyle;
  }

  // prettier-ignore
  private static setStyle(isValid: boolean, columnDetails: ColumnDetailsT, processedStyle: CellProcessedTextStyle,
      customTextProcessing: CustomTextProcessing | undefined, textContainerElement: HTMLElement,
      defaultColumnsSettings: ColumnsSettingsDefault): boolean {
    let wasValidationStyleSet = false; // REF-3
    if (!isValid) {
      if (customTextProcessing?.changeStyle) {
        ResetColumnStyles.setDefaultStyle(columnDetails, processedStyle, textContainerElement, defaultColumnsSettings);
      }
      ProcessedDataTextStyle.setFailedValidationStyle(columnDetails, processedStyle, textContainerElement);
      wasValidationStyleSet = true;
    } else if (!customTextProcessing?.changeStyle) { // REF-3 - set to default if no custom processing will occur
      ResetColumnStyles.setDefaultStyle(columnDetails, processedStyle, textContainerElement, defaultColumnsSettings);
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
        wasValidationStyleSet = ProcessedDataTextStyle.setStyle(isValid, columnDetails, processedStyle,
          customTextProcessing, textContainerElement, etc.defaultColumnsSettings);
        processedStyle.isValid = isValid;
      }
    }
    if (!wasValidationStyleSet && customTextProcessing?.changeStyle) { // REF-3
      ProcessedDataTextStyle.setCustomStyle(customTextProcessing.changeStyle, text, columnDetails, processedStyle,
        textContainerElement, etc.defaultColumnsSettings);
    }
  }

  private static setStyleOnColumn(etc: EditableTableComponent, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    columnDetails.elements.slice(1).forEach((element, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      ProcessedDataTextStyle.setCellStyle(etc, relativeRowIndex, columnIndex, true);
      ColumnSettingsBorderUtils.overwriteSideBorderIfSiblingsHaveSettings(columnDetails, [element]);
    });
  }

  private static unsetStyleOnColumn(etc: EditableTableComponent, columnIndex: number, oldCellStyle?: CellCSSStyle) {
    const columnDetails = etc.columnsDetails[columnIndex];
    columnDetails.elements.slice(1).forEach((element, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      const processedStyle = columnDetails.processedStyle[relativeRowIndex];
      ResetColumnStyles.setDefaultStyle(columnDetails, processedStyle, element, etc.defaultColumnsSettings, oldCellStyle);
    });
  }

  // using this to first unset the previous processed style, allow new settings/type to be applied and then set
  // new style
  // prettier-ignore
  public static resetDataCellsStyle(etc: EditableTableComponent, columnIndex: number, changeFunc: () => void,
      oldCellStyle?: CellCSSStyle) {
    ProcessedDataTextStyle.unsetStyleOnColumn(etc, columnIndex, oldCellStyle);
    changeFunc(); // arguments are expected to be binded
    ProcessedDataTextStyle.setStyleOnColumn(etc, columnIndex);
  }

  // prettier-ignore
  // this is used for a case where the default style has been set and need to reapply the processed style
  // without having to rerun the validation/changeStyle functions
  public static reapplyCellsStyle(etc: EditableTableComponent, columnIndex: number) {
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
