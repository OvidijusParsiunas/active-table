import {CellStructureUtils} from '../../../utils/cellType/cellStructureUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {DataCellEvents} from './dataCellEvents';
import {CellElement} from '../cellElement';
import {ColumnType} from '../../../types/columnType';

export class DataCellElement {
  private static readonly INVALID_TEXT_COLOR = 'grey';
  public static readonly DEFAULT_TEXT_COLOR = '';

  // prettier-ignore
  private static setCellDataStructure(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cell: HTMLElement) {
    // overwrites all previous cell content
    cell.innerText = (cell.children[0] as HTMLElement).innerText; // CAUTION-1
    CellElement.prepContentEditable(cell, false);
    DataCellEvents.setEvents(etc, cell, rowIndex, columnIndex);
  }

  public static setColumnDataStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.set(etc, columnIndex, DataCellElement.setCellDataStructure);
  }

  public static setStyleBasedOnValidity(textContainerElement: HTMLElement, validation: ColumnType['validation']) {
    textContainerElement.style.color = validation?.(CellElement.getText(textContainerElement))
      ? DataCellElement.DEFAULT_TEXT_COLOR
      : DataCellElement.INVALID_TEXT_COLOR;
  }
}
