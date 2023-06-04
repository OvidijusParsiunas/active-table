import {PaginationUtils} from '../outerTableComponents/pagination/paginationUtils';
import {FocusedCellUtils} from '../focusedElements/focusedCellUtils';
import {CustomRowProperties} from '../rows/customRowProperties';
import {CellElement} from '../../elements/cell/cellElement';
import {HeaderText} from '../columnDetails/headerText';
import {FocusedCell} from '../../types/focusedCell';
import {ActiveTable} from '../../activeTable';
import {MoveUtils} from './moveUtils';

export class MoveRow {
  // prettier-ignore
  private static overwrite(at: ActiveTable, sourceText: string[], targetIndex: number) {
    const overwrittenText: string[] = [];
    at._columnsDetails.forEach((columnDetails, columnIndex) => {
      const overwrittenDataText = MoveUtils.setNewElementText(at, sourceText[columnIndex],
        columnDetails.elements[targetIndex], columnIndex, targetIndex);
      overwrittenText.push(overwrittenDataText);
    });
    return overwrittenText;
  }

  private static moveDataRows(at: ActiveTable, targetRowIndex: number, siblingIndex: number) {
    const siblingRowText = at._columnsDetails.map(({elements}) => CellElement.getText(elements[siblingIndex]));
    // overwrite current row using sibling row
    const overwrittenText = MoveRow.overwrite(at, siblingRowText, targetRowIndex);
    // overwrite sibling row using overwritten row
    MoveRow.overwrite(at, overwrittenText, siblingIndex);
  }

  private static resetFocusedCell(at: ActiveTable, initialFocusedCell: Required<FocusedCell>) {
    const {_frameComponents, _focusedElements} = at;
    const {element, rowIndex, columnIndex} = initialFocusedCell;
    if (_frameComponents.displayIndexColumn) {
      FocusedCellUtils.setIndexCell(_focusedElements.cell, element, columnIndex);
    } else {
      FocusedCellUtils.set(_focusedElements.cell, element, rowIndex, columnIndex);
    }
  }

  private static moveHeaderToDataRow(at: ActiveTable) {
    const {_columnsDetails, _focusedElements} = at;
    const initialFocusedCell = {..._focusedElements.cell} as Required<FocusedCell>;
    const dataRowText = _columnsDetails.map(({elements}) => CellElement.getText(elements[1]));
    // overwrite header row using data row
    const overwrittenText = MoveRow.overwrite(at, dataRowText, 0);
    // update header row settings
    _columnsDetails.forEach((column, columnIndex) => {
      FocusedCellUtils.set(_focusedElements.cell, column.elements[0], 0, columnIndex);
      HeaderText.onAttemptChange(at, column.elements[0], columnIndex);
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
