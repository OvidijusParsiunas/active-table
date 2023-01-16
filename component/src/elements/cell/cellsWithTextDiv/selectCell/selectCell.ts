import {EditableTableComponent} from '../../../../editable-table-component';
import {ColumnTypeInternal} from '../../../../types/columnTypeInternal';
import {SelectCellTextElement} from './select/selectCellTextElement';
import {LabelCellTextElement} from './label/labelCellTextElement';
import {SelectCellElement} from './select/selectCellElement';
import {SelectCellEvents} from './select/selectCellEvents';
import {LabelCellElement} from './label/labelCellElement';
import {LabelCellEvents} from './label/labelCellEvents';

export class SelectCell {
  public static convertCell(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const columnDetails = etc.columnsDetails[columnIndex];
    if (columnDetails.activeType.selectProps?.isBasicSelect) {
      SelectCellElement.setCellSelectStructure(etc, cellElement, columnIndex);
    } else {
      LabelCellElement.setCellLabelStructure(etc, cellElement, columnIndex);
    }
  }

  public static convertColumn(etc: EditableTableComponent, columnIndex: number, newType: ColumnTypeInternal) {
    if (newType.selectProps?.isBasicSelect) {
      SelectCellElement.setColumnSelectStructure(etc, columnIndex);
    } else {
      LabelCellElement.setColumnLabelStructure(etc, columnIndex);
    }
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {activeType} = etc.columnsDetails[columnIndex];
    if (activeType.selectProps?.isBasicSelect) {
      SelectCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
    } else {
      LabelCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
    }
  }

  // prettier-ignore
  public static finaliseEditedText(etc: EditableTableComponent, textElement: HTMLElement, columnIndex: number,
      processMatching = false) {
    const {activeType} = etc.columnsDetails[columnIndex];
    if (activeType.selectProps?.isBasicSelect) {
      SelectCellTextElement.finaliseEditedText(etc, textElement, columnIndex);
    } else {
      LabelCellTextElement.finaliseEditedText(etc, textElement, columnIndex, processMatching);
    }
  }

  public static setPointerCursorIfCantAdd(cellElement: HTMLElement, activeType: ColumnTypeInternal) {
    cellElement.style.cursor = 'pointer';
    if (!activeType.selectProps?.canAddMoreOptions) {
      const textElement = cellElement.children[0] as HTMLElement;
      textElement.style.caretColor = 'transparent';
      textElement.style.cursor = 'pointer';
    }
  }
}
