import {ColumnSizerElement} from '../columnSizerElement/columnSizerElement';
import {ColumnSizerEvents} from '../columnSizerElement/columnSizerEvents';
import {EditableTableComponent} from '../../editable-table-component';

export class TableEvents {
  // prettier-ignore
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains(ColumnSizerElement.COLUMN_SIZER_CLASS)) {
      this.tableElementEventState.selectedColumnSizer = event.target as HTMLElement;
      ColumnSizerEvents.tableOnMouseDown(
        this.tableElementEventState.selectedColumnSizer as HTMLElement, this.columnResizerStyle.click?.backgroundColor);
    }
  }

  // prettier-ignore
  public static onMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const { tableElementEventState: { selectedColumnSizer }, columnsDetails, columnResizerStyle } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseUp(
        selectedColumnSizer, columnsDetails, event.target as HTMLElement, columnResizerStyle.hover?.backgroundColor);
      delete this.tableElementEventState.selectedColumnSizer;
    }
  }

  // prettier-ignore
  public static onMouseMove(this: EditableTableComponent, event: MouseEvent) {
    const { tableElementEventState: { selectedColumnSizer }, columnsDetails } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseMove(selectedColumnSizer, columnsDetails, event.movementX);
    }
  }

  // prettier-ignore
  public static onMouseLeave(this: EditableTableComponent) {
    const { tableElementEventState: { selectedColumnSizer }, columnsDetails } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseLeave(selectedColumnSizer, columnsDetails);
      delete this.tableElementEventState.selectedColumnSizer;
    }
  }
}
