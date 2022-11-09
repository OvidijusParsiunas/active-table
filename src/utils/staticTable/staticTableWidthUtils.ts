import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {UNSET_NUMBER_IDENTIFIER} from '../../consts/unsetNumber';
import {TableDimensions} from '../../types/tableDimensions';
import {PropertiesOfType} from '../../types/utilityTypes';
import {StringDimension} from '../../types/dimensions';
import {TableRow} from '../../types/tableContents';
import {RegexUtils} from '../regex/regexUtils';
import {StaticTable} from './staticTable';

// TO-DO - once the add columns column and left side row index tabs are present - take them into consideration
// table width is considered static when the user sets its width
export class StaticTableWidthUtils {
  public static NEW_COLUMN_WIDTH = 100;
  private static TOTAL_HORIZONTAL_SIDE_BORDER_WIDTH = UNSET_NUMBER_IDENTIFIER;

  // when the table width is not set, need to temporarily set it anyway at the start
  // in order to help the MaximumColumns class to determine what columns fit
  // originally used a timeout to unset but it did not work in firefox
  public static setTempMaximumWidth(isSetValue: boolean, tableElement: HTMLElement, maxWidth?: number) {
    if (maxWidth !== undefined) tableElement.style.width = isSetValue ? `${maxWidth}px` : '';
  }

  public static setInitialTableWidth(etc: EditableTableComponent) {
    const {tableDimensionsInternal, tableElementRef} = etc;
    if (tableDimensionsInternal.width !== undefined) {
      (tableElementRef as HTMLElement).style.width = `${tableDimensionsInternal.width}px`;
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

  private static resetAllColumnSizes(etc: EditableTableComponent, tableWidth: number) {
    const {tableElementRef, columnsDetails, contents} = etc;
    if (!tableElementRef) return;
    StaticTableWidthUtils.setNewColumnWidthProp(tableElementRef, tableWidth, contents[0]);
    columnsDetails.forEach((columnDetails) => {
      columnDetails.elements[0].style.width = `${StaticTableWidthUtils.NEW_COLUMN_WIDTH}px`;
    });
  }

  public static changeWidthsBasedOnColumnInsertRemove(etc: EditableTableComponent, isInsert: boolean) {
    const {tableElementRef, tableDimensionsInternal} = etc;
    if (!tableElementRef) return;
    if (tableDimensionsInternal.width !== undefined) {
      StaticTableWidthUtils.resetAllColumnSizes(etc, tableDimensionsInternal.width);
      // isInsert check was initially not needed as this was not getting called when a column had been removed, however
      // it has been identified that the table offsetWidth does not immediately update when the column widths are very
      // narrow (even above the minimal column limit set by the MINIMAL_COLUMN_WIDTH variable), hence it was added
    } else if (isInsert && StaticTable.isTableAtMaxWidth(tableElementRef, tableDimensionsInternal)) {
      StaticTableWidthUtils.resetAllColumnSizes(etc, tableDimensionsInternal.maxWidth as number);
    }
  }

  private static isParentWidthUndetermined(width: string) {
    return width === 'fit-content' || width === 'min-content' || width === 'max-content';
  }

  // prettier-ignore
  private static setDimension(etc: EditableTableComponent, key: keyof PropertiesOfType<TableDimensions, StringDimension>) {
    const {tableDimensions, tableDimensionsInternal, tableElementRef, parentElement} = etc;
    if (!tableElementRef || !parentElement) return;
    const clientValue = tableDimensions[key] as string;
    // this will parse px, % and will also work if the user forgets to add px
    let extractedNumber = Number(RegexUtils.extractIntegerStrs(clientValue)[0]);
    if (clientValue.includes('%')) {
      if (StaticTableWidthUtils.isParentWidthUndetermined(parentElement.style.width)) return;
      if (extractedNumber > 100) extractedNumber = 100;
      tableDimensionsInternal[key] = parentElement.offsetWidth * (extractedNumber / 100);
      tableDimensionsInternal.isPercentage = true;
    } else {
      tableDimensionsInternal[key] = extractedNumber;
    }
  }

  public static setInternalTableDimensions(etc: EditableTableComponent) {
    const {tableDimensions, tableDimensionsInternal} = etc;
    // width and maxWidth are mutually exclusive and if both are present width is the only one that is used
    if (tableDimensions.width !== undefined) {
      StaticTableWidthUtils.setDimension(etc, 'width');
    } else if (tableDimensions.maxWidth !== undefined) {
      StaticTableWidthUtils.setDimension(etc, 'maxWidth');
    }
    tableDimensionsInternal.preserveNarrowColumns ??= tableDimensions.preserveNarrowColumns || true;
  }
}
