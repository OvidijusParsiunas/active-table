import {ColumnTypeInternal} from '../../../../types/columnTypeInternal';
import {SelectCellTextElement} from './select/selectCellTextElement';
import {LabelCellTextElement} from './label/labelCellTextElement';
import {SelectCellElement} from './select/selectCellElement';
import {SelectCellEvents} from './select/selectCellEvents';
import {LabelCellElement} from './label/labelCellElement';
import {LabelCellEvents} from './label/labelCellEvents';
import {ActiveTable} from '../../../../activeTable';

export class SelectCell {
  public static convertCell(at: ActiveTable, columnIndex: number, cellElement: HTMLElement) {
    const columnDetails = at._columnsDetails[columnIndex];
    if (columnDetails.activeType.cellDropdownProps?.isBasicSelect) {
      SelectCellElement.setCellSelectStructure(at, cellElement, columnIndex);
    } else {
      LabelCellElement.setCellLabelStructure(at, cellElement, columnIndex);
    }
  }

  public static convertColumn(at: ActiveTable, columnIndex: number, newType: ColumnTypeInternal) {
    if (newType.cellDropdownProps?.isBasicSelect) {
      SelectCellElement.setColumnSelectStructure(at, columnIndex);
    } else {
      LabelCellElement.setColumnLabelStructure(at, columnIndex);
    }
  }

  public static setEvents(at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {activeType} = at._columnsDetails[columnIndex];
    if (activeType.cellDropdownProps?.isBasicSelect) {
      SelectCellEvents.setEvents(at, cellElement, rowIndex, columnIndex);
    } else {
      LabelCellEvents.setEvents(at, cellElement, rowIndex, columnIndex);
    }
  }

  // prettier-ignore
  public static finaliseEditedText(at: ActiveTable, textElement: HTMLElement, columnIndex: number,
      processMatching = false) {
    const {activeType} = at._columnsDetails[columnIndex];
    if (activeType.cellDropdownProps?.isBasicSelect) {
      SelectCellTextElement.finaliseEditedText(at, textElement, columnIndex);
    } else {
      LabelCellTextElement.finaliseEditedText(at, textElement, columnIndex, processMatching);
    }
  }

  public static setPointerCursorIfCantAdd(cellElement: HTMLElement, activeType: ColumnTypeInternal) {
    cellElement.style.cursor = 'pointer';
    if (!activeType.cellDropdownProps?.canAddMoreOptions) {
      const textElement = cellElement.children[0] as HTMLElement;
      textElement.style.caretColor = 'transparent';
      textElement.style.cursor = 'pointer';
    }
  }
}
