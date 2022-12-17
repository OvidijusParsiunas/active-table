import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {ChangeColumnType} from '../columnType/changeColumnType';
import {CellElement} from '../../elements/cell/cellElement';
import {CellEvents} from '../../elements/cell/cellEvents';
import {ColumnDetailsT} from '../../types/columnDetails';

export class ResetColumnStructure {
  private static resetEventsAndCursor(columnDetails: ColumnDetailsT, cellElement: HTMLElement) {
    if (!columnDetails.settings.isCellTextEditable) CellEvents.unsetEvents(cellElement);
    CellElement.setCursor(cellElement, columnDetails.settings.isCellTextEditable);
  }

  public static reset(etc: EditableTableComponent, columnDetails: ColumnDetailsT, columnIndex: number) {
    const {elements, activeType} = columnDetails;
    elements.slice(1).forEach((cellElement) => ResetColumnStructure.resetEventsAndCursor(columnDetails, cellElement));
    ChangeColumnType.setNewStructureBasedOnType(etc, columnIndex, activeType);
    ColumnSettingsBorderUtils.resetBorderOverwritingState(columnDetails);
  }
}
