import {ColumnSettingsBorderUtils} from '../columnSettings/columnSettingsBorderUtils';
import {ColumnSettingsStyleUtils} from '../columnSettings/columnSettingsStyleUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {DefaultColumnsSettings} from '../../types/columnsSettings';
import {CellElement} from '../../elements/cell/cellElement';
import {CellTextValidity} from '../../types/textValidity';
import {ColumnDetailsT} from '../../types/columnDetails';

export class ValidationStyle {
  private static readonly DEFAULT_FAILED_VALIDATION_STYLE = {color: 'grey'};

  private static unsetLastValidationStyle(textValidity: CellTextValidity, textContainerElement: HTMLElement) {
    Object.keys(textValidity.lastAppliedStyle).forEach((key) => {
      GenericElementUtils.setStyle(textContainerElement, key, '');
    });
  }

  // prettier-ignore
  private static setValidStyle(columnDetails: ColumnDetailsT, textValidity: CellTextValidity,
      textContainerElement: HTMLElement, defaultColumnsSettings: DefaultColumnsSettings) {
    ValidationStyle.unsetLastValidationStyle(textValidity, textContainerElement);
    CellElement.setDefaultCellStyle(textContainerElement, defaultColumnsSettings.cellStyle);
    ColumnSettingsStyleUtils.applySettingsStyleOnCell(columnDetails.settings, textContainerElement, false);
    textValidity.lastAppliedStyle = {};
  }

  // prettier-ignore
  private static setFailedStyle(columnDetails: ColumnDetailsT, textValidity: CellTextValidity,
      textContainerElement: HTMLElement) {
    const {validationProps} = columnDetails.activeType;
    const failedValidationStyle = validationProps?.failedValidationStyle
      || ValidationStyle.DEFAULT_FAILED_VALIDATION_STYLE;
    Object.assign(textContainerElement.style, failedValidationStyle);
    textValidity.lastAppliedStyle = failedValidationStyle;
  }

  // prettier-ignore
  private static setStyle(isValid: boolean, columnDetails: ColumnDetailsT, textValidity: CellTextValidity,
      textContainerElement: HTMLElement, defaultColumnsSettings: DefaultColumnsSettings) {
    if (!isValid) {
      ValidationStyle.setFailedStyle(columnDetails, textValidity, textContainerElement);
    } else {
      ValidationStyle.unsetLastValidationStyle(textValidity, textContainerElement);
      ValidationStyle.setValidStyle(columnDetails, textValidity, textContainerElement, defaultColumnsSettings);
    }
    ColumnSettingsBorderUtils.overwriteSideBorderIfSiblingsHaveSettings(columnDetails, textContainerElement);
  }

  // prettier-ignore
  public static setCellValidationStyle(etc: EditableTableComponent, rowIndex: number,
      columnIndex: number, overwrite = false) {
    const columnDetails = etc.columnsDetails[columnIndex];
    const textContainerElement = columnDetails.elements[rowIndex];
    const {validation} = columnDetails.activeType;
    if (!validation) return;
    const isValid = validation(CellElement.getText(textContainerElement));
    const textValidity = columnDetails.textValidity[rowIndex];
    if (overwrite || textValidity.isValid !== isValid) {
      ValidationStyle.setStyle(isValid, columnDetails, textValidity, textContainerElement, etc.defaultColumnsSettings)
      textValidity.isValid = isValid;
    }
  }

  private static setColumnValidationStyle(etc: EditableTableComponent, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    columnDetails.elements.slice(1).forEach((_, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      ValidationStyle.setCellValidationStyle(etc, relativeRowIndex, columnIndex, true);
    });
  }

  private static unsetColumnValidationStyle(etc: EditableTableComponent, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    columnDetails.elements.slice(1).forEach((element, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      ValidationStyle.unsetLastValidationStyle(columnDetails.textValidity[relativeRowIndex], element);
    });
  }

  // using this to first unset the previous validation style, allow new settings/type to be applied and then set
  // new settings
  public static resetValidationStyle(etc: EditableTableComponent, columnIndex: number, changeFunc: () => void) {
    ValidationStyle.unsetColumnValidationStyle(etc, columnIndex);
    changeFunc(); // arguments are expected to be binded
    ValidationStyle.setColumnValidationStyle(etc, columnIndex);
  }

  // this is mostly used for a case where the default style has been set and need to reapply the validation style
  // without having to rerun the validation functions
  public static reapplyColumnValidationStyle(etc: EditableTableComponent, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    const {validation} = columnDetails.activeType;
    if (!validation) return;
    columnDetails.elements.slice(1).forEach((element, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      Object.assign(element.style, columnDetails.textValidity[relativeRowIndex].lastAppliedStyle);
    });
  }

  public static getDefaultCellTextValidity() {
    return {isValid: true, lastAppliedStyle: {}};
  }
}
