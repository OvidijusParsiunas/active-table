import {EditableTableComponent} from '../../../../editable-table-component';

export class MaximumRows {
  public static canAddMore(etc: EditableTableComponent) {
    const {columnsDetails, maxRows} = etc;
    const numberOfRows = columnsDetails[0]?.elements.length;
    if (numberOfRows !== undefined && maxRows !== undefined && maxRows > 0) {
      if (maxRows <= numberOfRows) return false;
    }
    return true;
  }
}
