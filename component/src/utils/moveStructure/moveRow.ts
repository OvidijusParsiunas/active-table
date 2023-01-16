import {ColumnSettingsUtils} from '../columnSettings/columnSettingsUtils';
import {FocusedCellUtils} from '../focusedElements/focusedCellUtils';
import {CustomRowProperties} from '../rows/customRowProperties';
import {PaginationUtils} from '../pagination/paginationUtils';
import {CellElement} from '../../elements/cell/cellElement';
import {FocusedCell} from '../../types/focusedCell';
import {ActiveTable} from '../../activeTable';
import {MoveUtils} from './moveUtils';

export class MoveRow {
  // prettier-ignore
  private static overwrite(at: ActiveTable, sourceText: string[], targetIndex: number) {
    const overwrittenText: string[] = [];
    at.columnsDetails.forEach((columnDetails, columnIndex) => {
      const overwrittenDataText = MoveUtils.setNewElementText(at, sourceText[columnIndex],
        columnDetails.elements[targetIndex], columnIndex, targetIndex);
      overwrittenText.push(overwrittenDataText);
    });
    return overwrittenText;
  }

  private static moveDataRows(at: ActiveTable, targetRowIndex: number, siblingIndex: number) {
    const {columnsDetails} = at;
    const siblingRowText = columnsDetails.map(({elements}) => CellElement.getText(elements[siblingIndex]));
    // overwrite current row using sibling row
    const overwrittenText = MoveRow.overwrite(at, siblingRowText, targetRowIndex);
    // overwrite sibling row using overwritten row
    MoveRow.overwrite(at, overwrittenText, siblingIndex);
  }

  private static resetFocusedCell(at: ActiveTable, initialFocusedCell: Required<FocusedCell>) {
    const {auxiliaryTableContentInternal, focusedElements, columnsDetails} = at;
    const {element, rowIndex, columnIndex} = initialFocusedCell;
    if (auxiliaryTableContentInternal.displayIndexColumn) {
      FocusedCellUtils.setIndexCell(focusedElements.cell, element, columnIndex);
    } else {
      FocusedCellUtils.set(focusedElements.cell, element, rowIndex, columnIndex, columnsDetails[columnIndex].types);
    }
  }

  private static moveHeaderToDataRow(at: ActiveTable) {
    const {columnsDetails, focusedElements} = at;
    const initialFocusedCell = {...focusedElements.cell} as Required<FocusedCell>;
    const dataRowText = columnsDetails.map(({elements}) => CellElement.getText(elements[1]));
    // overwrite header row using data row
    const overwrittenText = MoveRow.overwrite(at, dataRowText, 0);
    // update header row settings
    columnsDetails.forEach((column, columnIndex) => {
      FocusedCellUtils.set(focusedElements.cell, column.elements[0], 0, columnIndex, column.types);
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(at, column.elements[0], columnIndex);
    });
    // overwrite data row using header row
    MoveRow.overwrite(at, overwrittenText, 1);
    MoveRow.resetFocusedCell(at, initialFocusedCell);
  }

  public static move(at: ActiveTable, rowIndex: number, isToDown: boolean) {
    const siblingIndex = isToDown ? rowIndex + 1 : rowIndex - 1;
    if (rowIndex === 0 || siblingIndex === 0) {
      MoveRow.moveHeaderToDataRow(at);
    } else {
      MoveRow.moveDataRows(at, rowIndex, siblingIndex);
    }
    CustomRowProperties.update(at, rowIndex);
    if (at.pagination) PaginationUtils.updateOnRowMove(at, siblingIndex);
  }
}
