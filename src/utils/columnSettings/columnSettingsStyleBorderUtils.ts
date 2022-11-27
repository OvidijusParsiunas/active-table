import {BordersOverwrittenBySiblings, ColumnDetailsT} from '../../types/columnDetails';
import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {ColumnSettingsStyleUtil} from './columnSettingsStyleUtil';
import {CSSStyle} from '../../types/cssStyle';

// The motivation behind this comes from a case where cells with a border style in the cellStyle property that are beside
// ones that have a border set in the cellStyle property of the columnsSettings property can have their borders displayed
// side by side which does not look appealing. Hence, this is used to allow the columnsSettings border to take presedence
// and overwrite the overall cellStyle.
// To further illustrate this, imagine if a custom setting column border has a left and right border - by default if
// the overall cellStyle property has right or left border set on it, the sibling column cells that use it will have
// their borders displayed beside the custom column cells' borders and there is no actual way to control this via API.
// Therefore automatically allowing the custom setting column borders to take presedence and remove sibling borders
// is the optimal functionality here.
export class ColumnSettingsBorderUtils {
  private static readonly UNSET_PX = '0px';

  public static overwriteSideBorderIfSiblingsHaveSettings(columnDetails: ColumnDetailsT, cellElement: HTMLElement) {
    const {left, right} = columnDetails.bordersOverwrittenBySiblings;
    if (left) cellElement.style.borderLeftWidth = ColumnSettingsBorderUtils.UNSET_PX;
    if (right) cellElement.style.borderRightWidth = ColumnSettingsBorderUtils.UNSET_PX;
  }

  // prettier-ignore
  private static unsetSubjectBorder(subjectColumn: ColumnDetailsT, siblingColumn: ColumnDetailsT,
      subjectBorder: keyof BordersOverwrittenBySiblings) {
    const subjectBorderStyle = subjectBorder === 'left' ? 'borderLeftWidth' : 'borderRightWidth';
    const siblingBorderStyle = subjectBorder === 'left' ? 'borderRightWidth' : 'borderLeftWidth';
    const subjectHeader = subjectColumn.elements[0];
    const siblingHeader = siblingColumn.elements[0];
    // only unset if right and left are present on the sibling cells and vice/versa
    if (subjectHeader.style[subjectBorderStyle] && siblingHeader.style[siblingBorderStyle]) {
      subjectColumn.bordersOverwrittenBySiblings[subjectBorder] = true;
      subjectColumn.elements.forEach((element) => {
        GenericElementUtils.setStyle(element, subjectBorderStyle, ColumnSettingsBorderUtils.UNSET_PX);
      });
    }
  }

  private static isSettingsStyleSet(columnDetails: ColumnDetailsT) {
    return columnDetails.settings?.cellStyle || columnDetails.settings?.header?.defaultStyle;
  }

  // if current column and sibling have custom setting styles, this does not overwrite anything and the user can
  // set their custom styles within the settings themselves
  // prettier-ignore
  private static unsetBorders(currentColumnDetails: ColumnDetailsT, leftColumnDetails: ColumnDetailsT,
      rightColumnDetails: ColumnDetailsT) {
    // if current column has a custom style but siblings do not
    if (ColumnSettingsBorderUtils.isSettingsStyleSet(currentColumnDetails)) {
      if (rightColumnDetails && !ColumnSettingsBorderUtils.isSettingsStyleSet(rightColumnDetails)) {
        ColumnSettingsBorderUtils.unsetSubjectBorder(rightColumnDetails, currentColumnDetails, 'left');
      }
      if (leftColumnDetails && !ColumnSettingsBorderUtils.isSettingsStyleSet(leftColumnDetails)) {
        ColumnSettingsBorderUtils.unsetSubjectBorder(leftColumnDetails, currentColumnDetails, 'right');
      }
      // if current column does not have a custom style but siblings do
    } else {
      if (rightColumnDetails && ColumnSettingsBorderUtils.isSettingsStyleSet(rightColumnDetails)) {
        ColumnSettingsBorderUtils.unsetSubjectBorder(currentColumnDetails, rightColumnDetails, 'right');
      }
      if (leftColumnDetails && ColumnSettingsBorderUtils.isSettingsStyleSet(leftColumnDetails)) {
        ColumnSettingsBorderUtils.unsetSubjectBorder(currentColumnDetails, leftColumnDetails, 'left');
      }
    }
  }

  // prettier-ignore
  private static resetIfBorderOverwritten(subjectColumn: ColumnDetailsT, subjectBorder: keyof BordersOverwrittenBySiblings,
      cellStyle: CSSStyle, headerStyle?: CSSStyle) {
    if (subjectColumn?.bordersOverwrittenBySiblings[subjectBorder]) {
      ColumnSettingsStyleUtil.setDefaultStyles(subjectColumn.elements, cellStyle, headerStyle);
      subjectColumn.bordersOverwrittenBySiblings.right = false;
    }
  }

  // prettier-ignore
  public static updateSiblingColumns(etc: EditableTableComponent, columnIndex: number) {
    const {columnsDetails, cellStyle, header} = etc;
    const currentColumnDetails = columnsDetails[columnIndex];
    const leftColumnDetails = columnsDetails[columnIndex - 1];
    const rightColumnDetails = columnsDetails[columnIndex + 1];
    // reset sibling columns if their borders were previously overwritten
    ColumnSettingsBorderUtils.resetIfBorderOverwritten(leftColumnDetails, 'right', cellStyle, header);
    ColumnSettingsBorderUtils.resetIfBorderOverwritten(rightColumnDetails, 'left', cellStyle, header);
    ColumnSettingsBorderUtils.unsetBorders(currentColumnDetails, leftColumnDetails, rightColumnDetails);
  }
}
