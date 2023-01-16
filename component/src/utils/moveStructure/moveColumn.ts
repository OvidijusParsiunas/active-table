import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {FocusedCellUtils} from '../focusedElements/focusedCellUtils';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {ChangeColumnType} from '../columnType/changeColumnType';
import {CellElement} from '../../elements/cell/cellElement';
import {ColumnDetailsT} from '../../types/columnDetails';
import {ActiveTable} from '../../activeTable';
import {MoveUtils} from './moveUtils';

export class MoveColumn {
  // prettier-ignore
  private static overwriteDataElements(at: ActiveTable,
      targetElements: HTMLElement[], targetColIndex: number, sourceCellText: string[]) {
    const overwrittenText: string[] = [];
    targetElements.slice(1).forEach((element, rowIndex) => {
      const relativeIndex = rowIndex + 1;
      const sourceText = sourceCellText[relativeIndex];
      const oldText = MoveUtils.setNewElementText(at, sourceText, element, targetColIndex, relativeIndex);
      overwrittenText.push(oldText);
    });
    return overwrittenText;
  }

  // prettier-ignore
  private static changeSettings(at: ActiveTable, targetColIndex: number, targetHeader: HTMLElement,
      targetColumnDetails: ColumnDetailsT, sourceType: ColumnTypeInternal) {
    ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(at, targetHeader, targetColIndex);
    if (sourceType !== targetColumnDetails.activeType) {
      ChangeColumnType.change.bind(at)(sourceType.name, targetColIndex);
    }
  }

  // prettier-ignore
  private static overwrite(at: ActiveTable, targetColumnDetails: ColumnDetailsT,
      targetColIndex: number, sourceCellText: string[], sourceType: ColumnTypeInternal) {
    const overwrittenText: string[] = [];
    const {elements: targetElements, activeType: targetType} = targetColumnDetails;
    const oldHeaderText = MoveUtils.setNewElementText(at, sourceCellText[0], targetElements[0], targetColIndex, 0);
    overwrittenText.push(oldHeaderText);
    MoveColumn.changeSettings(at, targetColIndex, targetElements[0], targetColumnDetails, sourceType);
    const overwrittenDataText = MoveColumn.overwriteDataElements(at, targetElements, targetColIndex, sourceCellText);
    overwrittenText.push(...overwrittenDataText);
    return { overwrittenText, overwrittenType: targetType };
  }

  private static firstChangeSettingsIfSettingsChanged(at: ActiveTable, columnIndex: number) {
    const {areSettingsDifferent} = ColumnSettingsUtils.parseSettingsChange(at);
    if (areSettingsDifferent) {
      const currentColumn = at.columnsDetails[columnIndex];
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(at, currentColumn.elements[0], columnIndex);
    }
  }

  public static move(at: ActiveTable, columnIndex: number, isToRight: boolean) {
    MoveColumn.firstChangeSettingsIfSettingsChanged(at, columnIndex);
    const currentColumn = at.columnsDetails[columnIndex];
    const siblingIndex = isToRight ? columnIndex + 1 : columnIndex - 1;
    const siblingColumn = at.columnsDetails[siblingIndex];
    const siblingColumnText = at.columnsDetails[siblingIndex].elements.map((element) => CellElement.getText(element));
    // overwrite current column using sibling column
    const overwritten = MoveColumn.overwrite(at, currentColumn, columnIndex, siblingColumnText, siblingColumn.activeType);
    FocusedCellUtils.set(at.focusedElements.cell, siblingColumn.elements[0], 0, siblingIndex, siblingColumn.types);
    // overwrite sibling column using overwritten content
    MoveColumn.overwrite(at, siblingColumn, siblingIndex, overwritten.overwrittenText, overwritten.overwrittenType);
  }
}
