import {BordersOverwrittenBySiblings, ColumnDetailsT} from '../../types/columnDetails';
import {DefaultColumnsSettings} from '../../types/columnsSettingsDefault';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {ExtractElements} from '../elements/extractElements';
import {ResetColumnStyles} from './resetColumnStyles';
import {ActiveTable} from '../../activeTable';

// REF-23
export class ColumnSettingsFrameBorderUtils {
  // prettier-ignore
  private static toggleFrameBorder(frameElements: HTMLElement[], columnElements: HTMLElement[],
      subjectBorder: keyof BordersOverwrittenBySiblings, columnsSettings: DefaultColumnsSettings) {
    if (frameElements.length > 0) {
      // subject is the frame column and sibling is the data column
      const {subjectBorderStyle, siblingBorderStyle} = ColumnSettingsBorderUtils.getColumnBorderStyles(subjectBorder);
      const frameHeaderElement = frameElements[0] as HTMLElement;
      const columnHeaderElement = columnElements[0];
      // if data column does not have a border, set the frame border (if we had unset it)
      if (!ColumnSettingsBorderUtils.isBorderDisplayed(columnHeaderElement, siblingBorderStyle)) {
        if (frameHeaderElement.style[subjectBorderStyle] === ColumnSettingsBorderUtils.UNSET_PX) {
          ResetColumnStyles.applyDefaultStyles(frameElements, columnsSettings);          
        }
      // if data column does have a border - unset the frame border if it has one
      } else {
        ColumnSettingsBorderUtils.unsetSubjectBorder(frameElements, columnElements, subjectBorder, 0);
      }
    }
  }

  // prettier-ignore
  public static updateFrameColumns(at: ActiveTable, currentColumnDetails: ColumnDetailsT,
      leftColumnDetails: ColumnDetailsT, rightColumnDetails: ColumnDetailsT) {
    const currentColumn = currentColumnDetails || leftColumnDetails; // when last column removed - use the left one instead
    if (!currentColumn) return;
    const {_defaultColumnsSettings: defColumnsSettings, _addColumnCellsElementsRef,
      _frameComponents: {displayAddNewColumn, displayIndexColumn}} = at;
    if (!rightColumnDetails && displayAddNewColumn) {
      ColumnSettingsFrameBorderUtils.toggleFrameBorder(
        _addColumnCellsElementsRef, currentColumn.elements, 'left', defColumnsSettings);
    }
    if (!leftColumnDetails && displayIndexColumn) {
      const rowElements = ExtractElements.textRowsArrFromTBody(at._tableBodyElementRef as HTMLElement, at.content, 0);
      const indexCells = rowElements.map((row) => row.children[0]) as HTMLElement[];
      ColumnSettingsFrameBorderUtils.toggleFrameBorder(indexCells, currentColumn.elements, 'right', defColumnsSettings);
    }
  }
}
