import {PossibleStringDimensions, StringDimensionUtils} from './stringDimensionUtils';
import {TableDimensionsInternal} from '../../types/tableDimensionsInternal';
import {MaxStructureDimensions} from '../../types/maxStructureDimensions';
import {EditableTableComponent} from '../../editable-table-component';
import {GenericElementUtils} from '../elements/genericElementUtils';
import {TableDimensions} from '../../types/tableDimensions';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {TableContents} from '../../types/tableContents';
import {OverflowUtils} from '../overflow/overflowUtils';

export class TableDimensionsUtils {
  public static readonly MINIMAL_TABLE_WIDTH = 70;

  // REF-19
  // prettier-ignore
  private static setIsColumnIndexCellTextWrapped(tableDimensions: TableDimensions,
      tableDimensionsInternal: TableDimensionsInternal, displayIndexColumn: boolean) {
    if (displayIndexColumn) { 
      if (tableDimensions.wrapIndexCellText) {
        tableDimensionsInternal.isColumnIndexCellTextWrapped = true;
      } else if (tableDimensionsInternal.isColumnIndexCellTextWrapped === undefined) {
        tableDimensionsInternal.isColumnIndexCellTextWrapped = false;
      }
    }
  }

  // prettier-ignore
  private static setMaxStructureDimension(tableDimensions: TableDimensions,
      tableDimensionsInternal: TableDimensionsInternal, maxKey: keyof MaxStructureDimensions) {
    if (tableDimensions[maxKey] !== undefined) {
      tableDimensionsInternal[maxKey] = tableDimensions[maxKey] || 1;
    }
  }

  // prettier-ignore
  private static setMaxStructureDimensions(tableDimensions: TableDimensions,
      tableDimensionsInternal: TableDimensionsInternal) {
    TableDimensionsUtils.setMaxStructureDimension(tableDimensions, tableDimensionsInternal, 'maxColumns');
    TableDimensionsUtils.setMaxStructureDimension(tableDimensions, tableDimensionsInternal, 'maxRows');
  }

  // prettier-ignore
  private static setPreserveNarrowColumnsProp(tableDimensions: TableDimensions,
      tableDimensionsInternal: TableDimensionsInternal) {
    tableDimensionsInternal.preserveNarrowColumns = tableDimensions.preserveNarrowColumns === undefined
      ? true : tableDimensions.preserveNarrowColumns;
  }

  private static setDefaultDimension(tableDimensionsInternal: TableDimensionsInternal, parentElement: HTMLElement) {
    // 100% width of the parent element
    tableDimensionsInternal.maxWidth = parentElement.offsetWidth;
    tableDimensionsInternal.wasPercentage = true;
  }

  // prettier-ignore
  private static setDimension(etc: EditableTableComponent, key: keyof PossibleStringDimensions<TableDimensions>) {
    const {tableDimensions, tableDimensionsInternal, tableElementRef, parentElement} = etc;
    if (!tableElementRef || !parentElement) return;
    const numberDimension = StringDimensionUtils.generateNumberDimensionFromClientString(key,
      parentElement, tableDimensions, true, TableDimensionsUtils.MINIMAL_TABLE_WIDTH);
      if (etc.overflow) OverflowUtils.unsetBorderDimensions(numberDimension)
    if (numberDimension !== undefined) {
      tableDimensionsInternal[key] = numberDimension.number;
      tableDimensionsInternal.wasPercentage = numberDimension.wasPercentage;
    }
  }

  // CAUTION-3
  // prettier-ignore
  public static setInternalTableDimensions(etc: EditableTableComponent) {
    const {tableDimensions, tableDimensionsInternal, auxiliaryTableContentInternal: {displayIndexColumn}} = etc;
    const parentElement = etc.parentElement as HTMLElement;
    // width and maxWidth are mutually exclusive and if both are present width is the only one that is used
    if (tableDimensions.width !== undefined) {
      TableDimensionsUtils.setDimension(etc, 'width');
    } else if (tableDimensions.maxWidth !== undefined) {
      TableDimensionsUtils.setDimension(etc, 'maxWidth');
    } else if (
      !tableDimensions.unlimitedSize &&
      !GenericElementUtils.isParentWidthUndetermined(parentElement.style.width)
    ) {
      TableDimensionsUtils.setDefaultDimension(tableDimensionsInternal, parentElement);
    }
    // else the table automatically holds an unlimited size via table-controlled-width class (dynamic table)
    TableDimensionsUtils.setPreserveNarrowColumnsProp(tableDimensions, tableDimensionsInternal);
    TableDimensionsUtils.setMaxStructureDimensions(tableDimensions, tableDimensionsInternal);
    TableDimensionsUtils.setIsColumnIndexCellTextWrapped(tableDimensions, tableDimensionsInternal, displayIndexColumn);
  }

  public static cleanupContentsThatDidNotGetAdded(contents: TableContents, columnsDetails: ColumnsDetailsT) {
    if (contents[0]?.length - columnsDetails.length > 0) contents.forEach((row) => row.splice(columnsDetails.length));
    if (contents.length > columnsDetails[0]?.elements.length) contents.splice(columnsDetails[0].elements.length);
  }

  public static hasSetTableWidthBeenBreached(etc: EditableTableComponent) {
    const {width, maxWidth} = etc.tableDimensionsInternal;
    const tableOffset = etc.offsetWidth;
    const setWidth = width || maxWidth;
    if (setWidth) {
      // tableOffset is usually rounded, hence using Math.ceil on setWidth to correctly compare them
      return Math.ceil(setWidth) < tableOffset;
    }
    return false;
  }
}
