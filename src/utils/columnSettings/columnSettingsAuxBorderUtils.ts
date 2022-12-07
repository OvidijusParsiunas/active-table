import {BordersOverwrittenBySiblings, ColumnDetailsT} from '../../types/columnDetails';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {ColumnSettingsStyleUtils} from './columnSettingsStyleUtils';
import {ExtractElements} from '../elements/extractElements';
import {CSSStyle} from '../../types/cssStyle';

// REF-23
export class ColumnSettingsAuxBorderUtils {
  // prettier-ignore
  private static toggleAuxiliaryBorder(auxElements: HTMLElement[], columnElements: HTMLElement[],
      subjectBorder: keyof BordersOverwrittenBySiblings, cellStyle: CSSStyle, header?: CSSStyle) {
    if (auxElements.length > 0) {
      // subject is the auxiliary column and sibling is the data column
      const {subjectBorderStyle, siblingBorderStyle} = ColumnSettingsBorderUtils.getColumnBorderStyles(subjectBorder);
      const auxHeaderElement = auxElements[0] as HTMLElement;
      const columnHeaderElement = columnElements[0];
      // if data column does not have a border, set the aux border (if we had unset it)
      if (!ColumnSettingsBorderUtils.isBorderDisplayed(columnHeaderElement, siblingBorderStyle)) {
        if (auxHeaderElement.style[subjectBorderStyle] === ColumnSettingsBorderUtils.UNSET_PX) {
          ColumnSettingsStyleUtils.applyDefaultStyles(auxElements, cellStyle, header);          
        }
      // if data column does have a border - unset the aux border if it has one
      } else {
        ColumnSettingsBorderUtils.unsetSubjectBorder(auxElements, columnElements, subjectBorder, 0);
      }
    }
  }

  // prettier-ignore
  public static updateAuxiliaryColumns(etc: EditableTableComponent, currentColumnDetails: ColumnDetailsT,
      leftColumnDetails: ColumnDetailsT, rightColumnDetails: ColumnDetailsT) {
    const currentColumn = currentColumnDetails || leftColumnDetails; // when last column removed - use the left one instead
    if (!currentColumn) return;
    const {cellStyle, header: {defaultStyle: headerStyle}, addColumnCellsElementsRef,
      auxiliaryTableContentInternal: {displayAddColumnCell, displayIndexColumn}} = etc;
    if (!rightColumnDetails && displayAddColumnCell) {
      ColumnSettingsAuxBorderUtils.toggleAuxiliaryBorder(
        addColumnCellsElementsRef, currentColumn.elements, 'left', cellStyle, headerStyle);
    }
    if (!leftColumnDetails && displayIndexColumn) {
      const rowElements = ExtractElements.textRowsArrFromTBody(etc.tableBodyElementRef as HTMLElement, etc.contents, 0);
      const indexCells = rowElements.map((row) => row.children[0]) as HTMLElement[];
      ColumnSettingsAuxBorderUtils.toggleAuxiliaryBorder(
        indexCells, currentColumn.elements, 'right', cellStyle, headerStyle);
    }
  }
}
