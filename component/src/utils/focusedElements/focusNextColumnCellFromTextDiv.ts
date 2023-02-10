import {CellWithTextEvents} from '../../elements/cell/cellsWithTextDiv/cellWithTextEvents';
import {CheckboxCellElement} from '../../elements/cell/checkboxCell/checkboxCellElement';
import {CellElement} from '../../elements/cell/cellElement';
import {ActiveTable} from '../../activeTable';
import {Browser} from '../browser/browser';

export class FocusNextColumnCellFromTextDiv {
  private static focusDifferentColumnCell(at: ActiveTable, columnIndex: number, rowIndex: number) {
    const {elements, activeType, settings} = at._columnsDetails[columnIndex];
    const cellElement = elements[rowIndex];
    if (
      !settings.isCellTextEditable ||
      (rowIndex === 0 && !settings.isHeaderTextEditable) ||
      // REF-29
      (Browser.IS_SAFARI && CheckboxCellElement.isCheckboxCell(cellElement))
    ) {
      return FocusNextColumnCellFromTextDiv.focusOrBlurNext(at, columnIndex, rowIndex);
    }
    if (activeType.cellDropdownProps) {
      // needs to be mousedown in order to set focusedCell
      cellElement.dispatchEvent(new Event('mousedown'));
    } else {
      CellWithTextEvents.programmaticBlur(at);
      // dispatchEvent(new Event('focus')); does not return a selection in firefox for window.document.getSelection()
      CellElement.getTextElement(cellElement).focus();
    }
    cellElement.scrollIntoView({block: 'nearest'});
  }

  private static focusOrBlurNextRowFirstCell(at: ActiveTable, rowIndex: number) {
    const firstColumn = at._columnsDetails[0];
    const nextRowIndex = rowIndex + 1;
    const nextRowFirstCell = firstColumn.elements[nextRowIndex];
    if (nextRowFirstCell) {
      FocusNextColumnCellFromTextDiv.focusDifferentColumnCell(at, 0, nextRowIndex);
    } else {
      const focusedCell = at._focusedElements.cell.element as HTMLElement;
      // if no next cell - blur current as the dropdown will be closed but the cursor would otherwise stay
      (focusedCell.children[0] as HTMLElement).blur();
    }
  }

  public static focusOrBlurNext(at: ActiveTable, columnIndex: number, rowIndex: number) {
    const nextColumn = at._columnsDetails[columnIndex + 1];
    if (nextColumn) {
      FocusNextColumnCellFromTextDiv.focusDifferentColumnCell(at, columnIndex + 1, rowIndex);
    } else {
      FocusNextColumnCellFromTextDiv.focusOrBlurNextRowFirstCell(at, rowIndex);
    }
  }
}
