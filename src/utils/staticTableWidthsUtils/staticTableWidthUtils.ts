import {EditableTableComponent} from '../../editable-table-component';
import {TableDimensions} from '../../types/tableDimensions';
import {Browser} from '../browser/browser';

// table width is considered static when the user sets its width or the width needs to be kept track of for Safari
export class StaticTableWidthUtils {
  public static NEW_COLUMN_WIDTH = 100;

  public static setInitialTableWidth(tableDimensions: TableDimensions, tableElement: HTMLElement) {
    if (tableDimensions.width) {
      tableElement.style.width = `${tableDimensions.width}px`;
      // REF-11
    } else if (Browser.IS_SAFARI) {
      tableElement.style.width = '0px';
    }
  }

  public static changeWidthsBasedOnColumnInsertRemove(etc: EditableTableComponent) {
    const {tableElementRef, tableDimensions, columnsDetails} = etc;
    if (tableDimensions.width) {
      columnsDetails.forEach((columnDetails) => {
        columnDetails.elements[0].style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
      });
      // REF-11
    } else if (Browser.IS_SAFARI && tableElementRef) {
      tableElementRef.style.width = `${tableElementRef.offsetWidth + StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
    }
  }
}
