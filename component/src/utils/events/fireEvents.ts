import {ColumnDetailsUtils} from '../columnDetails/columnDetailsUtils';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';
import {CellText} from '../../types/tableContent';
import {ActiveTable} from '../../activeTable';

export class FireEvents {
  // prettier-ignore
  public static onCellUpdate(at: ActiveTable,
      cellText: CellText, rowIndex: number, columnIndex: number, updateType: CELL_UPDATE_TYPE) {
    const updateBody = {text: String(cellText), rowIndex, columnIndex, updateType};
    at.onCellUpdate(updateBody);
    at.dispatchEvent(new CustomEvent('cell-update', {detail: updateBody}));
  }

  public static onContentUpdate(at: ActiveTable) {
    const updateBody = JSON.parse(JSON.stringify(at.content));
    at.onContentUpdate(updateBody);
    at.dispatchEvent(new CustomEvent('content-update', {detail: updateBody}));
  }

  public static onColumnsUpdate(at: ActiveTable) {
    const updateBody = ColumnDetailsUtils.getAllColumnsDetails(at._columnsDetails);
    at.onColumnsUpdate(updateBody);
    at.dispatchEvent(new CustomEvent('columns-update', {detail: updateBody}));
  }

  public static onRender(at: ActiveTable) {
    at.onRender();
    at.dispatchEvent(new CustomEvent('render'));
  }
}
