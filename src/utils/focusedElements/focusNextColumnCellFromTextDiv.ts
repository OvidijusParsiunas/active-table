import {CellWithTextEvents} from '../../elements/cell/cellsWithTextDiv/cellWithTextEvents';
import {CheckboxCellElement} from '../../elements/cell/checkboxCell/checkboxCellElement';
import {EditableTableComponent} from '../../editable-table-component';
import {CellElement} from '../../elements/cell/cellElement';
import {Browser} from '../browser/browser';

export class FocusNextColumnCellFromTextDiv {
  private static focusDifferentColumnCell(etc: EditableTableComponent, columnIndex: number, rowIndex: number) {
    const {elements, activeType, settings} = etc.columnsDetails[columnIndex];
    const cellElement = elements[rowIndex];
    if (
      !settings.isCellTextEditable ||
      (rowIndex === 0 && !settings.isHeaderTextEditable) ||
      // REF-29
      (Browser.IS_SAFARI && cellElement.classList.contains(CheckboxCellElement.CHECKBOX_CELL_CLASS))
    ) {
      return FocusNextColumnCellFromTextDiv.focusOrBlurNext(etc, columnIndex, rowIndex);
    }
    if (activeType.categories) {
      // needs to be mousedown in order to set focusedCell
      cellElement.dispatchEvent(new Event('mousedown'));
    } else {
      CellWithTextEvents.programmaticBlur(etc);
      // dispatchEvent(new Event('focus')); does not return a selection in firefox for window.document.getSelection()
      CellElement.getTextElement(cellElement).focus();
    }
    cellElement.scrollIntoView({block: 'nearest'});
  }

  private static focusOrBlurNextRowFirstCell(etc: EditableTableComponent, rowIndex: number) {
    const firstColumn = etc.columnsDetails[0];
    const nextRowIndex = rowIndex + 1;
    const nextRowFirstCell = firstColumn.elements[nextRowIndex];
    if (nextRowFirstCell) {
      FocusNextColumnCellFromTextDiv.focusDifferentColumnCell(etc, 0, nextRowIndex);
    } else {
      const focusedCell = etc.focusedElements.cell.element as HTMLElement;
      // if no next cell - blur current as the dropdown will be closed but the cursor would otherwise stay
      (focusedCell.children[0] as HTMLElement).blur();
    }
  }

  public static focusOrBlurNext(etc: EditableTableComponent, columnIndex: number, rowIndex: number) {
    const nextColumn = etc.columnsDetails[columnIndex + 1];
    if (nextColumn) {
      FocusNextColumnCellFromTextDiv.focusDifferentColumnCell(etc, columnIndex + 1, rowIndex);
    } else {
      FocusNextColumnCellFromTextDiv.focusOrBlurNextRowFirstCell(etc, rowIndex);
    }
  }
}
