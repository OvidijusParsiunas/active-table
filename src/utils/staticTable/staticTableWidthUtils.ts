import {TableDimensions, TableDimensionsInternal} from '../../types/tableDimensions';
import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {UNSET_NUMBER_IDENTIFIER} from '../../consts/unsetNumber';
import {TableRow} from '../../types/tableContents';
import {RegexUtils} from '../regex/regexUtils';
import {StaticTable} from './staticTable';

// TO-DO - once the add columns column and left side row index tabs are present - take them into consideration
// table width is considered static when the user sets its width or the width needs to be kept track of for Safari
export class StaticTableWidthUtils {
  public static NEW_COLUMN_WIDTH = 100;
  private static TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH = UNSET_NUMBER_IDENTIFIER;

  // because we do not set the table width in non safari browsers, need to temporarily set it at the start
  // in order to help the MaximumColumns class to determine what columns fit in
  private static tempMaximumWidth(tableElement: HTMLElement, maxWidth?: number) {
    if (!tableElement.style.width && maxWidth !== undefined) {
      tableElement.style.width = `${maxWidth}px`;
      setTimeout(() => (tableElement.style.width = ''));
    }
  }

  // the reason why isSafari needs to be passed down via a parameter is because the static methods are used in
  // the component's render function hence Browser.IS_SAFARI has a chance of not being initialised yet
  public static setInitialTableWidth(etc: EditableTableComponent, isSafari: boolean) {
    const {tableDimensionsInternal, tableElementRef, contents} = etc;
    if (!tableElementRef) return;
    if (tableDimensionsInternal.width !== undefined) {
      tableElementRef.style.width = `${tableDimensionsInternal.width}px`;
      // REF-11
    } else if (isSafari) {
      tableElementRef.style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH * contents[0].length}px`;
      if (StaticTable.isTableAtMaxWidth(tableElementRef, tableDimensionsInternal)) {
        // because changeWidthsBasedOnColumnInsertRemove is called directly after this method, the columns will be reset
        tableElementRef.style.width = `${tableDimensionsInternal.maxWidth}px`;
      }
    }
    StaticTableWidthUtils.tempMaximumWidth(tableElementRef, tableDimensionsInternal.maxWidth);
  }

  private static setNewColumnWidthProp(tableElement: HTMLElement, tableWidth: number, firstRow: TableRow) {
    if (StaticTableWidthUtils.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH === UNSET_NUMBER_IDENTIFIER) {
      StaticTableWidthUtils.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH =
        GenericElementUtils.getElementTotalHorizontalSideBorderWidth(tableElement);
    }
    StaticTableWidthUtils.NEW_COLUMN_WIDTH =
      (tableWidth - StaticTableWidthUtils.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH) / firstRow.length;
  }

  private static resetAllColumnSizes(etc: EditableTableComponent, tableWidth: number) {
    const {tableElementRef, columnsDetails, contents} = etc;
    if (!tableElementRef) return;
    StaticTableWidthUtils.setNewColumnWidthProp(tableElementRef, tableWidth, contents[0]);
    columnsDetails.forEach((columnDetails) => {
      columnDetails.elements[0].style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
    });
  }

  // the reason why isSafari needs to be passed down via a parameter is because the static methods are used in
  // the component's render function hence Browser.IS_SAFARI has a chance of not being initialised yet
  public static changeWidthsBasedOnColumnInsertRemove(etc: EditableTableComponent, isInsert: boolean, isSafari: boolean) {
    const {tableElementRef, tableDimensionsInternal} = etc;
    if (!tableElementRef) return;
    if (tableDimensionsInternal.width !== undefined) {
      StaticTableWidthUtils.resetAllColumnSizes(etc, tableDimensionsInternal.width);
      // REF-11
    } else if (isSafari) {
      const columnWidthDelta = isInsert ? StaticTableWidthUtils.NEW_COLUMN_WIDTH : -StaticTableWidthUtils.NEW_COLUMN_WIDTH;
      tableElementRef.style.width = `${Number.parseInt(tableElementRef.style.width) + columnWidthDelta}px`;
    }
    // isInsert check was initially not needed as this was not getting called when a column had been removed, however
    // it has been identified that the table offsetWidth does not immediately update when the column widths are very
    // narrow (even above the minimal column limit set by the MINIMAL_COLUMN_LENGTH variable), hence it was added
    // the reason why this is called after the above statements is because we need the safari part to run first in order
    // to update the table width and get its new offset
    if (isInsert && StaticTable.isTableAtMaxWidth(tableElementRef, tableDimensionsInternal)) {
      StaticTableWidthUtils.resetAllColumnSizes(etc, tableDimensionsInternal.maxWidth as number);
      if (isSafari) tableElementRef.style.width = `${tableDimensionsInternal.maxWidth}px`;
    }
  }

  // prettier-ignore
  private static setInternal(parentElement: HTMLElement, clientDimensions: TableDimensions,
      internalDimensions: TableDimensionsInternal, key: keyof TableDimensions) {
    const clientValue = clientDimensions[key] as string;
    // this will parse px, % and will also work if the user forgets to add px
    const extractedNumber = Number(RegexUtils.extractIntegerStrs(clientValue)[0]);
    if (clientValue.includes('%')) {
      internalDimensions[key] = parentElement.offsetWidth * (extractedNumber / 100);
    } else {
      internalDimensions[key] = extractedNumber;
    }
  }

  public static updateTableDimensions(etc: EditableTableComponent) {
    const {tableDimensions, tableDimensionsInternal} = etc;
    const parentElement = etc.parentElement as HTMLElement;
    // width and maxWidth are mutually exclusive and if both are present width is the only one that is used
    if (tableDimensions.width !== undefined) {
      StaticTableWidthUtils.setInternal(parentElement, tableDimensions, tableDimensionsInternal, 'width');
    } else if (tableDimensions.maxWidth !== undefined) {
      StaticTableWidthUtils.setInternal(parentElement, tableDimensions, tableDimensionsInternal, 'maxWidth');
    }
  }
}
