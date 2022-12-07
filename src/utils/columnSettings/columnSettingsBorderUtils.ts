import {BordersOverwrittenBySiblings, ColumnDetailsT} from '../../types/columnDetails';
import {ColumnSettingsAuxBorderUtils} from './columnSettingsAuxBorderUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {CSSStyle} from '../../types/cssStyle';

type OverwritableBorderStyle = 'borderLeftWidth' | 'borderRightWidth';

// REF-23
export class ColumnSettingsBorderUtils {
  public static readonly UNSET_PX = '0px';

  // REF-23
  public static overwriteSideBorderIfSiblingsHaveSettings(columnDetails: ColumnDetailsT, cellElement: HTMLElement) {
    const {left, right} = columnDetails.bordersOverwrittenBySiblings;
    if (left) cellElement.style.borderLeftWidth = ColumnSettingsBorderUtils.UNSET_PX;
    if (right) cellElement.style.borderRightWidth = ColumnSettingsBorderUtils.UNSET_PX;
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

  private static isSettingsStyleSet(columnDetails: ColumnDetailsT) {
    return columnDetails.settings.cellStyle || columnDetails.settings.header?.defaultStyle;
  }

  // if current column and sibling have custom setting styles, this does not overwrite anything and the user can
  // set their custom styles within the settings themselves
  // prettier-ignore
  private static unsetBorders(currentColumnDetails: ColumnDetailsT, leftColumnDetails: ColumnDetailsT,
      rightColumnDetails: ColumnDetailsT) {
    if (!currentColumnDetails) return;
    // if current column has a custom style but siblings do not
    if (ColumnSettingsBorderUtils.isSettingsStyleSet(currentColumnDetails)) {
      if (rightColumnDetails && !ColumnSettingsBorderUtils.isSettingsStyleSet(rightColumnDetails)) {
        ColumnSettingsBorderUtils.unsetColumnBorder(rightColumnDetails, currentColumnDetails, 'left');
      }
      if (leftColumnDetails && !ColumnSettingsBorderUtils.isSettingsStyleSet(leftColumnDetails)) {
        ColumnSettingsBorderUtils.unsetColumnBorder(leftColumnDetails, currentColumnDetails, 'right');
      }
      // if current column does not have a custom style but siblings do
    } else {
      if (rightColumnDetails && ColumnSettingsBorderUtils.isSettingsStyleSet(rightColumnDetails)) {
        ColumnSettingsBorderUtils.unsetColumnBorder(currentColumnDetails, rightColumnDetails, 'right');
      }
      if (leftColumnDetails && ColumnSettingsBorderUtils.isSettingsStyleSet(leftColumnDetails)) {
        ColumnSettingsBorderUtils.unsetColumnBorder(currentColumnDetails, leftColumnDetails, 'left');
      }
    }
  }

  private static resetBorderOverwritingState(currentColumn: ColumnDetailsT) {
    if (!currentColumn) return;
    currentColumn.bordersOverwrittenBySiblings.left = false;
    currentColumn.bordersOverwrittenBySiblings.right = false;
  }

  // prettier-ignore
  private static resetIfBorderOverwritten(subjectColumn: ColumnDetailsT, subjectBorder: keyof BordersOverwrittenBySiblings,
      cellStyle: CSSStyle, headerStyle?: CSSStyle) {
    if (subjectColumn?.bordersOverwrittenBySiblings[subjectBorder]) {
      ColumnSettingsStyleUtils.applyDefaultStyles(subjectColumn.elements, cellStyle, headerStyle);
      subjectColumn.bordersOverwrittenBySiblings[subjectBorder] = false;
    }
  }

  // REF-23
  public static updateSiblingColumns(etc: EditableTableComponent, columnIndex: number) {
    const {columnsDetails, cellStyle, header} = etc;
    const currentColumnDetails = columnsDetails[columnIndex];
    const leftColumnDetails = columnsDetails[columnIndex - 1];
    const rightColumnDetails = columnsDetails[columnIndex + 1];
    // reset sibling columns if their borders were previously overwritten
    ColumnSettingsBorderUtils.resetIfBorderOverwritten(rightColumnDetails, 'left', cellStyle, header.defaultStyle);
    ColumnSettingsBorderUtils.resetIfBorderOverwritten(leftColumnDetails, 'right', cellStyle, header.defaultStyle);
    // because current column is reanalyzed, need to reset state as some props may no longer be true
    ColumnSettingsBorderUtils.resetBorderOverwritingState(currentColumnDetails);
    // overwrite borders preceded by settings style
    ColumnSettingsBorderUtils.unsetBorders(currentColumnDetails, leftColumnDetails, rightColumnDetails);
    // overwrite auxiliary cell borders preceded by settings style
    ColumnSettingsAuxBorderUtils.updateAuxiliaryColumns(etc, currentColumnDetails, leftColumnDetails, rightColumnDetails);
  }
}
