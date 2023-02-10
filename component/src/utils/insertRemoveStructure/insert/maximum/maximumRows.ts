import {ActiveTable} from '../../../../activeTable';

export class MaximumRows {
  public static canAddMore(at: ActiveTable) {
    const {_columnsDetails, maxRows} = at;
    const numberOfRows = _columnsDetails[0]?.elements.length;
    if (numberOfRows !== undefined && maxRows !== undefined && maxRows > 0) {
      if (maxRows <= numberOfRows) return false;
    }
    return true;
  }
}
