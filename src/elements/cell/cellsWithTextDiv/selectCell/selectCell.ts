import {EditableTableComponent} from '../../../../editable-table-component';
import {ColumnTypeInternal} from '../../../../types/columnTypeInternal';
import {SelectCellTextElement} from './select/selectCellTextElement';
import {LabelCellTextElement} from './label/labelCellTextElement';
import {SelectCellElement} from './select/selectCellElement';
import {SelectCellEvents} from './select/selectCellEvents';
import {LabelCellElement} from './label/labelCellElement';
import {LabelCellEvents} from './label/labelCellEvents';

export class SelectCell {
  public static convertCell(etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const columnDetails = etc.columnsDetails[columnIndex];
    if (columnDetails.activeType.isSelect) {
      SelectCellElement.setCellSelectStructure(etc, cellElement, rowIndex, columnIndex);
    } else {
      LabelCellElement.setCellLabelStructure(etc, cellElement, rowIndex, columnIndex);
    }
  }

  public static convertColumn(etc: EditableTableComponent, columnIndex: number, newType: ColumnTypeInternal) {
    if (newType.isSelect) {
      SelectCellElement.setColumnSelectStructure(etc, columnIndex);
    } else {
      LabelCellElement.setColumnLabelStructure(etc, columnIndex);
    }
  }

  public static resetEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {activeType} = etc.columnsDetails[columnIndex];
    if (activeType.isSelect) {
      SelectCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
    } else {
      LabelCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
    }
  }

  // prettier-ignore
  public static finaliseEditedText(etc: EditableTableComponent, textElement: HTMLElement, columnIndex: number,
      processMatching = false) {
    const {activeType} = etc.columnsDetails[columnIndex];
    if (activeType.isSelect) {
      SelectCellTextElement.finaliseEditedText(etc, textElement, columnIndex);
    } else {
      LabelCellTextElement.finaliseEditedText(etc, textElement, columnIndex, processMatching);
    }
  }
}
