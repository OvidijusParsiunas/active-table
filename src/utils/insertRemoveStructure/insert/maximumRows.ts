import {EditableTableComponent} from '../../../editable-table-component';

export class MaximumRows {
  // prettier-ignore
  public static canAddMore(etc: EditableTableComponent) {
    const {columnsDetails, tableDimensionsInternal: {maxRows}} = etc;
    const numberOfRows = columnsDetails[0]?.elements.length;
    if (numberOfRows !== undefined && maxRows !== undefined) {
      if (maxRows <= numberOfRows) return false;      
    }
    return true;
  }
}
