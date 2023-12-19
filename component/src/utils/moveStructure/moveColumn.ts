import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {FocusedCellUtils} from '../focusedElements/focusedCellUtils';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {ChangeColumnType} from '../columnType/changeColumnType';
import {CellHighlightUtils} from '../color/cellHighlightUtils';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {HeaderText} from '../columnDetails/headerText';
import {FireEvents} from '../events/fireEvents';
import {ActiveTable} from '../../activeTable';
import {MoveUtils} from './moveUtils';

export class MoveColumn {
  // prettier-ignore
  private static overwriteDataElements(at: ActiveTable,
      targetElements: HTMLElement[], targetColIndex: number, sourceCellText: string[]) {
    targetElements.slice(1).forEach((element, rowIndex) => {
      const relativeIndex = rowIndex + 1;
      const sourceText = sourceCellText[relativeIndex];
      MoveUtils.setNewElementText(at, sourceText, element, targetColIndex, relativeIndex);
    });
  }

  // prettier-ignore
  private static changeSettings(at: ActiveTable, targetColIndex: number, targetHeader: HTMLElement,
      targetColumnDetails: ColumnDetailsT, sourceType: ColumnTypeInternal) {
    HeaderText.onAttemptChange(at, targetHeader, targetColIndex, {colMove: true});
    if (sourceType !== targetColumnDetails.activeType) {
      ChangeColumnType.change.bind(at)(sourceType.name, targetColIndex);
    }
  }

  // prettier-ignore
  private static overwrite(at: ActiveTable, targetColumnDetails: ColumnDetailsT,
      targetColIndex: number, sourceCellText: string[], sourceType: ColumnTypeInternal, sourceColWidth: string) {
    const {elements: targetElements, activeType: targetType} = targetColumnDetails;
    MoveUtils.setNewElementText(at, sourceCellText[0], targetElements[0], targetColIndex, 0);
    MoveColumn.changeSettings(at, targetColIndex, targetElements[0], targetColumnDetails, sourceType);
    MoveColumn.overwriteDataElements(at, targetElements, targetColIndex, sourceCellText);
    const overwrittenWidth = targetElements[0].style.width;
    targetElements[0].style.width = sourceColWidth; // this is done because column widths are not stored in state (REF-35)
    return { overwrittenType: targetType, overwrittenWidth };
  }

  private static firstChangeSettingsIfSettingsChanged(at: ActiveTable, columnIndex: number) {
    const {areSettingsDifferent} = ColumnSettingsUtils.parseSettingsChange(at);
    if (areSettingsDifferent) {
      const sourceColumn = at._columnsDetails[columnIndex];
      HeaderText.onAttemptChange(at, sourceColumn.elements[0], columnIndex);
    }
  }

  // prettier-ignore
  public static move(at: ActiveTable, columnIndex: number, isToRight: boolean) {
    MoveColumn.firstChangeSettingsIfSettingsChanged(at, columnIndex);
    const sourceColumn = at._columnsDetails[columnIndex];
    const sourceColumnText = at._columnsDetails[columnIndex].elements.map((element) => CellElement.getText(element));
    CellHighlightUtils.fade(sourceColumn.elements[0], sourceColumn?.headerStateColors.default);
    const siblingIndex = isToRight ? columnIndex + 1 : columnIndex - 1;
    const siblingColumn = at._columnsDetails[siblingIndex];
    const siblingColumnText = siblingColumn.elements.map((element) => CellElement.getText(element));
    const siblingColumnWidth = siblingColumn.elements[0].style.width;
    // overwrite current column using sibling column
    const overwritten = MoveColumn.overwrite(at, sourceColumn, columnIndex, siblingColumnText,
      siblingColumn.activeType, siblingColumnWidth);
    FocusedCellUtils.set(at._focusedElements.cell, siblingColumn.elements[0], 0, siblingIndex);
    // overwrite sibling column using overwritten data
    MoveColumn.overwrite(at, siblingColumn, siblingIndex, sourceColumnText,
      overwritten.overwrittenType, overwritten.overwrittenWidth);
    setTimeout(() => FireEvents.onColumnsUpdate(at));
  }
}
