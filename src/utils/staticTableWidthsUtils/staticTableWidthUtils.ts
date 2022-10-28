import {EditableTableComponent} from '../../editable-table-component';
import {TableDimensions} from '../../types/tableDimensions';

// table width is considered static when the user sets its width or the width needs to be kept track of for Safari
export class StaticTableWidthUtils {
  public static NEW_COLUMN_WIDTH = 100;

  // the reason why isSafari needs to be passed down via a parameter is because the static methods are used in
  // the component's render function hence Browser.IS_SAFARI has a chance of not being initialised yet
  public static setInitialTableWidth(tableDimensions: TableDimensions, tableElement: HTMLElement, isSafari: boolean) {
    if (tableDimensions.width) {
      tableElement.style.width = `${tableDimensions.width}px`;
      // REF-11
    } else if (isSafari) {
      tableElement.style.width = '0px';
    }
  }

  // the reason why isSafari needs to be passed down via a parameter is because the static methods are used in
  // the component's render function hence Browser.IS_SAFARI has a chance of not being initialised yet
  public static changeWidthsBasedOnColumnInsertRemove(etc: EditableTableComponent, isSafari: boolean) {
    const {tableElementRef, tableDimensions, columnsDetails} = etc;
    if (tableDimensions.width) {
      columnsDetails.forEach((columnDetails) => {
        columnDetails.elements[0].style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
      });
      // REF-11
    } else if (isSafari && tableElementRef) {
      tableElementRef.style.width = `${tableElementRef.offsetWidth + StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
    }
  }
}
