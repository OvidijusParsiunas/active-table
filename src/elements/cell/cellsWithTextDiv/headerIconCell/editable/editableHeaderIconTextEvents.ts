import {ColumnSettingsUtils} from '../../../../../utils/columnSettings/columnSettingsUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {DataCellEvents} from '../../../dataCell/dataCellEvents';
import {CellWithTextEvents} from '../../cellWithTextEvents';
import {CellElement} from '../../../cellElement';

export class EditableHeaderIconTextEvents {
  private static blurText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    const cellElement = CellElement.getCellElement(textElement);
    ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(this, cellElement, columnIndex);
    DataCellEvents.blur(this, rowIndex, columnIndex, textElement);
  }

  // in chrome - the focus/blur events are first captured by the cell element, however they are not in firefox/safari,
  // therefore they are defined explicitly below
  public static setEvents(etc: EditableTableComponent, textElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!etc.columnsDetails[columnIndex].settings.isHeaderTextEditable) return;
    textElement.onfocus = CellWithTextEvents.focusText.bind(etc, rowIndex, columnIndex, null);
    textElement.onblur = EditableHeaderIconTextEvents.blurText.bind(etc, rowIndex, columnIndex);
  }
}
