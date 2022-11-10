import {TableDimensionsInternal} from '../../types/tableDimensionsInternal';
import {EditableTableComponent} from '../../editable-table-component';
import {TableElement} from '../../elements/table/tableElement';
import {TableDimensions} from '../../types/tableDimensions';
import {PropertiesOfType} from '../../types/utilityTypes';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {StringDimension} from '../../types/dimensions';
import {RegexUtils} from '../regex/regexUtils';
import {StaticTable} from './staticTable';

// TO-DO when not at maximum length - have a setting option to resize all columns to the limit as resizing to small and
// back does not preserve the original width. Alternatively go as far as checking that data has not been changed since
// the resize and if not - automatically set to the original ratio
// TO-DO once the add columns column and left side row index tabs are present - take them into consideration

// table width is considered static when the user sets its width
export class StaticTableWidthUtils {
  private static readonly MINIMAL_TABLE_WIDTH = 70;
  public static NEW_COLUMN_WIDTH = 100;

  // REF-11
  private static togglePreserveNarrowColumns(isSetValue: boolean, tableElement: HTMLElement, preserve?: boolean) {
    if (!preserve) {
      // the reason why this is only executed when preserveNarrowColumns is false is because when the narrow columns
      // overflow the table width - 'block' causes the border to remain at the set width and not cover the full table
      // 'block' causes the table offset width to be the same as the currently set css width pixel value
      tableElement.style.display = isSetValue ? 'block' : '';
    }
  }

  // when the client has not provided the 'width' value for the table, but a 'maxWidth' is present, need to
  // temporarily set the width at the start in order to help the MaximumColumns class to determine what columns fit
  // prettier-ignore
  public static setTempMaxWidth(etc: EditableTableComponent, isSetValue: boolean) {
    const {tableElementRef, tableDimensionsInternal: { maxWidth, preserveNarrowColumns }} = etc;
    // WORK - when at max width (no preserve) and removing the last column - upon hovering the new last column;
    // the sizer is dashed
    if (tableElementRef && maxWidth !== undefined) {
      tableElementRef.style.width = isSetValue ? `${maxWidth}px` : ''; // '' defaults width back to min-content
      StaticTableWidthUtils.togglePreserveNarrowColumns(isSetValue, tableElementRef, preserveNarrowColumns); // REF-11
      // WORK - on delete - temporary change the table width to allow resize
    }
  }

  // prettier-ignore
  public static setTableWidth(etc: EditableTableComponent) {
    const {tableDimensionsInternal: {preserveNarrowColumns, width}, tableElementRef, } = etc;
    if (tableElementRef && width !== undefined) {
      tableElementRef.style.width = `${width}px`;
      StaticTableWidthUtils.togglePreserveNarrowColumns(true, tableElementRef, preserveNarrowColumns); // REF-11
    }
  }

  private static setNewColumnWidth(tableWidth: number, numberOfColumns: number) {
    const totalColumnsWidth = tableWidth - TableElement.TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH;
    StaticTableWidthUtils.NEW_COLUMN_WIDTH = totalColumnsWidth / numberOfColumns;
  }

  private static resetAllColumnSizes(columnsDetails: ColumnsDetailsT, tableWidth: number) {
    StaticTableWidthUtils.setNewColumnWidth(tableWidth, columnsDetails.length);
    columnsDetails.forEach((columnDetails) => {
      columnDetails.elements[0].style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
    });
  }

  public static changeWidthsBasedOnColumnInsertRemove(etc: EditableTableComponent, isInsert: boolean) {
    const {tableElementRef, tableDimensionsInternal, columnsDetails} = etc;
    if (!tableElementRef) return;
    if (tableDimensionsInternal.width !== undefined) {
      StaticTableWidthUtils.resetAllColumnSizes(columnsDetails, tableDimensionsInternal.width);
      // isInsert check was initially not needed as this was not getting called when a column had been removed, however
      // it has been identified that the table offsetWidth does not immediately update when the column widths are very
      // narrow (even above the minimal column limit set by the MINIMAL_COLUMN_WIDTH variable), hence it was added
    } else if (isInsert && StaticTable.isTableAtMaxWidth(tableElementRef, tableDimensionsInternal)) {
      StaticTableWidthUtils.resetAllColumnSizes(columnsDetails, tableDimensionsInternal.maxWidth as number);
    }
  }

  // prettier-ignore
  private static setPreserveNarrowColumnsProp(tableDimensions: TableDimensions,
      tableDimensionsInternal: TableDimensionsInternal) {
    tableDimensionsInternal.preserveNarrowColumns = tableDimensions.preserveNarrowColumns;
    tableDimensionsInternal.preserveNarrowColumns ??= true; // if tableDimensions.preserveNarrowColumns was undefined
  }

  private static setDefaultDimension(tableDimensionsInternal: TableDimensionsInternal, parentElement: HTMLElement) {
    // 100% width of the parent element
    tableDimensionsInternal.maxWidth = parentElement.offsetWidth;
    tableDimensionsInternal.isPercentage = true;
  }

  private static processDimension(width: number) {
    return width < StaticTableWidthUtils.MINIMAL_TABLE_WIDTH ? StaticTableWidthUtils.MINIMAL_TABLE_WIDTH : width;
  }

  private static isParentWidthUndetermined(width: string) {
    return width === 'fit-content' || width === 'min-content' || width === 'max-content';
  }

  private static setDimension(etc: EditableTableComponent, key: keyof PropertiesOfType<TableDimensions, StringDimension>) {
    const {tableDimensions, tableDimensionsInternal, tableElementRef, parentElement} = etc;
    if (!tableElementRef || !parentElement) return;
    const clientValue = tableDimensions[key] as string;
    // this will parse px, % and will also work if the user forgets to add px
    let extractedNumber = Number(RegexUtils.extractIntegerStrs(clientValue)[0]);
    if (clientValue.includes('%')) {
      // if true then holds an unlimited size (dynamic table)
      if (StaticTableWidthUtils.isParentWidthUndetermined(parentElement.style.width)) return;
      if (extractedNumber > 100) extractedNumber = 100;
      const width = parentElement.offsetWidth * (extractedNumber / 100);
      tableDimensionsInternal[key] = StaticTableWidthUtils.processDimension(width);
      tableDimensionsInternal.isPercentage = true;
    } else {
      tableDimensionsInternal[key] = StaticTableWidthUtils.processDimension(extractedNumber);
    }
  }

  // CAUTION-3
  public static setInternalTableDimensions(etc: EditableTableComponent) {
    const {tableDimensions, tableDimensionsInternal} = etc;
    const parentElement = etc.parentElement as HTMLElement;
    // width and maxWidth are mutually exclusive and if both are present width is the only one that is used
    if (tableDimensions.width !== undefined) {
      StaticTableWidthUtils.setDimension(etc, 'width');
    } else if (tableDimensions.maxWidth !== undefined) {
      StaticTableWidthUtils.setDimension(etc, 'maxWidth');
    } else if (
      !tableDimensions.unlimitedSize &&
      !StaticTableWidthUtils.isParentWidthUndetermined(parentElement.style.width)
    ) {
      StaticTableWidthUtils.setDefaultDimension(tableDimensionsInternal, parentElement);
    }
    // else the table holds an unlimited size (dynamic table)
    StaticTableWidthUtils.setPreserveNarrowColumnsProp(tableDimensions, tableDimensionsInternal);
  }
}
