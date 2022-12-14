import {BordersOverwrittenBySiblings, ColumnDetailsT} from '../../types/columnDetails';
import {ColumnSettingsAuxBorderUtils} from './columnSettingsAuxBorderUtils';
import {ProcessedDataTextStyle} from '../columnType/processedDataTextStyle';
import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {ResetColumnStyles} from './resetColumnStyles';

type OverwritableBorderStyle = 'borderLeftWidth' | 'borderRightWidth';

// REF-23
export class ColumnSettingsBorderUtils {
  public static readonly UNSET_PX = '0px';

  // REF-23
  public static overwriteSideBorderIfSiblingsHaveSettings(columnDetails: ColumnDetailsT, cellElements: HTMLElement[]) {
    const {left, right} = columnDetails.bordersOverwrittenBySiblings;
    cellElements.forEach((cellElement) => {
      if (left) cellElement.style.borderLeftWidth = ColumnSettingsBorderUtils.UNSET_PX;
      if (right) cellElement.style.borderRightWidth = ColumnSettingsBorderUtils.UNSET_PX;
    });
  }

  // prettier-ignore
  public static getColumnBorderStyles(subjectBorder: keyof BordersOverwrittenBySiblings):
      {subjectBorderStyle: OverwritableBorderStyle; siblingBorderStyle: OverwritableBorderStyle;} {
    const subjectBorderStyle = subjectBorder === 'left' ? 'borderLeftWidth' : 'borderRightWidth';
    const siblingBorderStyle = subjectBorder === 'left' ? 'borderRightWidth' : 'borderLeftWidth';
    return {subjectBorderStyle, siblingBorderStyle};
  }

  public static isBorderDisplayed(cell: HTMLElement, borderStyle: OverwritableBorderStyle) {
    return Boolean(cell.style[borderStyle] && cell.style[borderStyle] !== ColumnSettingsBorderUtils.UNSET_PX);
  }

  // REF-23
  // prettier-ignore
  public static unsetSubjectBorder(subjectElements: HTMLElement[], siblingElements: HTMLElement[],
      subjectBorder: keyof BordersOverwrittenBySiblings, comparisonRow: number,
      bordersOverwrittenBySiblings?: BordersOverwrittenBySiblings) {
    const {subjectBorderStyle, siblingBorderStyle} = ColumnSettingsBorderUtils.getColumnBorderStyles(subjectBorder);
    const subjectHeader = subjectElements[comparisonRow];
    const siblingHeader = siblingElements[comparisonRow];
    // only unset if right and left are present on the sibling cells and vice/versa
    if (ColumnSettingsBorderUtils.isBorderDisplayed(subjectHeader, subjectBorderStyle) 
        && ColumnSettingsBorderUtils.isBorderDisplayed(siblingHeader, siblingBorderStyle)) {
      if (bordersOverwrittenBySiblings) bordersOverwrittenBySiblings[subjectBorder] = true;
      subjectElements.forEach((element) => {
        GenericElementUtils.setStyle(element, subjectBorderStyle, ColumnSettingsBorderUtils.UNSET_PX);
      });
    }
  }

  // prettier-ignore
  private static unsetColumnBorder(column: ColumnDetailsT, siblingColumn: ColumnDetailsT,
      subjectBorder: keyof BordersOverwrittenBySiblings) {
    ColumnSettingsBorderUtils.unsetSubjectBorder(
      column.elements, siblingColumn.elements, subjectBorder, 0, column.bordersOverwrittenBySiblings)
  }

  // if current column and sibling have custom setting styles
  // REF-23
  // prettier-ignore
  private static unsetBorders(currentColumnDetails: ColumnDetailsT, leftColumnDetails: ColumnDetailsT,
      rightColumnDetails: ColumnDetailsT) {
    if (!currentColumnDetails) return;
    // if current column has custom style precedence
    if (currentColumnDetails.settings.stylePrecedence) {
    // unset the left column right
      if (leftColumnDetails) {
        ColumnSettingsBorderUtils.unsetColumnBorder(leftColumnDetails, currentColumnDetails, 'right');
      }
      // if right does not have precedence - overwrite its left border
      if (rightColumnDetails && !rightColumnDetails.settings.stylePrecedence) {
        ColumnSettingsBorderUtils.unsetColumnBorder(rightColumnDetails, currentColumnDetails, 'left');
      }
      // if current column does not have a custom style but siblings do
    } else {
      if (rightColumnDetails && rightColumnDetails.settings.stylePrecedence) {
        ColumnSettingsBorderUtils.unsetColumnBorder(currentColumnDetails, rightColumnDetails, 'right');
      }
      if (leftColumnDetails && leftColumnDetails.settings.stylePrecedence) {
        ColumnSettingsBorderUtils.unsetColumnBorder(currentColumnDetails, leftColumnDetails, 'left');
      }
    }
  }

  public static resetBorderOverwritingState(currentColumn: ColumnDetailsT) {
    if (!currentColumn) return;
    currentColumn.bordersOverwrittenBySiblings.left = false;
    currentColumn.bordersOverwrittenBySiblings.right = false;
  }

  // prettier-ignore
  private static resetIfBorderOverwritten(etc: EditableTableComponent, columnIndex: number,
      subjectColumn: ColumnDetailsT, subjectBorder: keyof BordersOverwrittenBySiblings) {
    if (subjectColumn?.bordersOverwrittenBySiblings[subjectBorder]) {
      ResetColumnStyles.applyDefaultStyles(subjectColumn.elements, etc.defaultColumnsSettings);
      ProcessedDataTextStyle.reapplyCellsStyle(etc, columnIndex);
      subjectColumn.bordersOverwrittenBySiblings[subjectBorder] = false;
      ColumnSettingsBorderUtils.overwriteSideBorderIfSiblingsHaveSettings(subjectColumn, subjectColumn.elements)
    }
  }

  // REF-23
  public static updateSiblingColumns(etc: EditableTableComponent, columnIndex: number) {
    const {columnsDetails} = etc;
    const currentColumnDetails = columnsDetails[columnIndex];
    const leftColumnDetails = columnsDetails[columnIndex - 1];
    const rightColumnDetails = columnsDetails[columnIndex + 1];
    // reset sibling columns if their borders were previously overwritten
    ColumnSettingsBorderUtils.resetIfBorderOverwritten(etc, columnIndex + 1, rightColumnDetails, 'left');
    ColumnSettingsBorderUtils.resetIfBorderOverwritten(etc, columnIndex - 1, leftColumnDetails, 'right');
    // because current column is reanalyzed, need to reset state as some props may no longer be true
    ColumnSettingsBorderUtils.resetBorderOverwritingState(currentColumnDetails);
    // overwrite borders preceded by settings style
    ColumnSettingsBorderUtils.unsetBorders(currentColumnDetails, leftColumnDetails, rightColumnDetails);
    // overwrite auxiliary cell borders preceded by settings style
    ColumnSettingsAuxBorderUtils.updateAuxiliaryColumns(etc, currentColumnDetails, leftColumnDetails, rightColumnDetails);
  }
}
