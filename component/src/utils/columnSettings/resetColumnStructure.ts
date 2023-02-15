import {ColumnSettingsBorderUtils} from './columnSettingsBorderUtils';
import {CellEventsReset} from '../../elements/cell/cellEventsReset';
import {ChangeColumnType} from '../columnType/changeColumnType';
import {ColumnDetailsT} from '../../types/columnDetails';
import {FireEvents} from '../events/fireEvents';
import {ActiveTable} from '../../activeTable';

export class ResetColumnStructure {
  public static reset(at: ActiveTable, columnDetails: ColumnDetailsT, columnIndex: number) {
    const {elements, activeType, settings} = columnDetails;
    elements.slice(1).forEach((cellElement) => {
      if (!settings.isCellTextEditable) CellEventsReset.unset(cellElement);
    });
    ChangeColumnType.setNewStructureBasedOnType(at, columnIndex, activeType);
    ColumnSettingsBorderUtils.resetBorderOverwritingState(columnDetails);
    setTimeout(() => FireEvents.onColumnsUpdate(at));
  }
}
