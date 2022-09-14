import {ColumnSizerElement} from '../columnSizerElement/columnSizerElement';
import {ColumnSizerEvents} from '../columnSizerElement/columnSizerEvents';
import {EditableTableComponent} from '../../editable-table-component';

export class TableEvents {
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains(ColumnSizerElement.COLUMN_SIZER_CLASS)) {
      this.tableElementEventState.selectedColumnSizer = event.target as HTMLElement;
    }
  }

  // prettier-ignore
  public static onMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const { tableElementEventState: { selectedColumnSizer }, overlayElementsState: { columnSizers } } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseUp(selectedColumnSizer, columnSizers.list, event.target as HTMLElement);
      delete this.tableElementEventState.selectedColumnSizer;
    }
  }

  // prettier-ignore
  public static onMouseMove(this: EditableTableComponent, event: MouseEvent) {
    const { tableElementEventState: { selectedColumnSizer }, overlayElementsState: {columnSizers}, columnsDetails } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseMove(selectedColumnSizer, columnSizers.list, columnsDetails, event.movementX);
    }
  }

  // prettier-ignore
  public static onMouseLeave(this: EditableTableComponent) {
    const { tableElementEventState: { selectedColumnSizer }, overlayElementsState: {columnSizers} } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseLeave(selectedColumnSizer, columnSizers.list);
      delete this.tableElementEventState.selectedColumnSizer;
    }
  }
}
