import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {UNSET_NUMBER_IDENTIFIER} from '../../consts/unsetNumber';
import {TableRow} from '../../types/tableContents';
import {StaticTable} from './staticTable';

// table width is considered static when the user sets its width or the width needs to be kept track of for Safari
export class StaticTableWidthUtils {
  public static NEW_COLUMN_WIDTH = 100;
  private static TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH = UNSET_NUMBER_IDENTIFIER;

  // the reason why isSafari needs to be passed down via a parameter is because the static methods are used in
  // the component's render function hence Browser.IS_SAFARI has a chance of not being initialised yet
  public static setInitialTableWidth(etc: EditableTableComponent, isSafari: boolean) {
    const {tableDimensions, tableElementRef, contents} = etc;
    if (!tableElementRef) return;
    if (tableDimensions.width !== undefined) {
      tableElementRef.style.width = `${tableDimensions.width}px`;
      // REF-11
    } else if (isSafari) {
      tableElementRef.style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH * contents[0].length}px`;
      if (StaticTable.isTableAtMaxWidth(tableElementRef, tableDimensions)) {
        // because changeWidthsBasedOnColumnInsertRemove is called directly after this method, the columns will be reset
        tableElementRef.style.width = `${tableDimensions.maxWidth}px`;
      }
    }
  }

  private static setNewColumnWidthProp(tableElement: HTMLElement, tableWidth: number, firstRow: TableRow) {
    if (StaticTableWidthUtils.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH === UNSET_NUMBER_IDENTIFIER) {
      StaticTableWidthUtils.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH =
        GenericElementUtils.getElementTotalHorizontalSideBorderWidth(tableElement);
    }
    StaticTableWidthUtils.NEW_COLUMN_WIDTH =
      (tableWidth - StaticTableWidthUtils.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH) / firstRow.length;
  }

  private static resetAllColumnSizes(etc: EditableTableComponent, newTableWidth: number) {
    const {tableElementRef, columnsDetails, contents} = etc;
    if (!tableElementRef) return;
    StaticTableWidthUtils.setNewColumnWidthProp(tableElementRef, newTableWidth, contents[0]);
    columnsDetails.forEach((columnDetails) => {
      columnDetails.elements[0].style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
    });
  }

  // the reason why isSafari needs to be passed down via a parameter is because the static methods are used in
  // the component's render function hence Browser.IS_SAFARI has a chance of not being initialised yet
  public static changeWidthsBasedOnColumnInsertRemove(etc: EditableTableComponent, isInsert: boolean, isSafari: boolean) {
    const {tableElementRef, tableDimensions} = etc;
    if (!tableElementRef) return;
    if (tableDimensions.width !== undefined) {
      StaticTableWidthUtils.resetAllColumnSizes(etc, tableDimensions.width);
      // REF-11
    } else if (isSafari) {
      const columnWidthDelta = isInsert ? StaticTableWidthUtils.NEW_COLUMN_WIDTH : -StaticTableWidthUtils.NEW_COLUMN_WIDTH;
      tableElementRef.style.width = `${Number.parseInt(tableElementRef.style.width) + columnWidthDelta}px`;
    }
    // need the safari part to run in order to update table width and get the new offset
    if (tableDimensions.width === undefined && StaticTable.isTableAtMaxWidth(tableElementRef, tableDimensions)) {
      StaticTableWidthUtils.resetAllColumnSizes(etc, tableDimensions.maxWidth as number);
      if (isSafari) tableElementRef.style.width = `${tableDimensions.maxWidth}px`;
    }
  }
}
