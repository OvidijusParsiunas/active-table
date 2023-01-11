import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {ChangeColumnType} from '../columnType/changeColumnType';
import {CellEvents} from '../../elements/cell/cellEvents';
import {ColumnDetailsT} from '../../types/columnDetails';

export class ResetColumnStructure {
  public static reset(etc: EditableTableComponent, columnDetails: ColumnDetailsT, columnIndex: number) {
    const {elements, activeType, settings} = columnDetails;
    elements.slice(1).forEach((cellElement) => {
      if (!settings.isCellTextEditable) CellEvents.unsetEvents(cellElement);
    });
    ChangeColumnType.setNewStructureBasedOnType(etc, columnIndex, activeType);
    ColumnSettingsBorderUtils.resetBorderOverwritingState(columnDetails);
  }
}
