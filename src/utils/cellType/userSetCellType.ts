import {USER_SET_COLUMN_TYPE, ACTIVE_COLUMN_TYPE, DATE_COLUMN_TYPE, TEXT_DIV_COLUMN_TYPE} from '../../enums/columnType';
import {CategoryCellElement} from '../../elements/cell/cellsWithTextDiv/categoryCell/categoryCellElement';
import {CategoryDropdownItem} from '../../elements/dropdown/categoryDropdown/categoryDropdownItem';
import {DateCellElement} from '../../elements/cell/cellsWithTextDiv/dateCell/dateCellElement';
import {DataCellElement} from '../../elements/cell/dataCell/dataCellElement';
import {EditableTableComponent} from '../../editable-table-component';
import {DisplayedCellTypeName} from './displayedCellTypeName';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {CellEvents} from '../../elements/cell/cellEvents';
import {CellTypeTotalsUtils} from './cellTypeTotalsUtils';
import {VALIDABLE_CELL_TYPE} from '../../enums/cellType';
import {ColumnType} from '../../types/columnType';

export class UserSetCellType {
  // prettier-ignore
  private static purgeInvalidCell(etc: EditableTableComponent, columnsDetails: ColumnsDetailsT,
      rowIndex: number, columnIndex: number) {
    const relativeRowIndex = rowIndex + 1;
    const cellElement = columnsDetails[columnIndex].elements[relativeRowIndex];
    return CellEvents.setCellToDefaultIfNeeded(etc, relativeRowIndex, columnIndex, cellElement, false);
  }

  private static purgeInvalidCells(etc: EditableTableComponent, columnIndex: number) {
    const {contents, columnsDetails} = etc;
    let updateTableEvent = false;
    contents.slice(1).forEach((_, rowIndex) => {
      const isUpdated = UserSetCellType.purgeInvalidCell(etc, columnsDetails, rowIndex, columnIndex);
      if (isUpdated && !updateTableEvent) updateTableEvent = true;
    });
    if (updateTableEvent) etc.onTableUpdate(contents);
  }

  // prettier-ignore
  private static purgeInvalidCellsIfValidable(etc: EditableTableComponent,
      newTypeEnum: VALIDABLE_CELL_TYPE, columnIndex: number) {
    if (VALIDABLE_CELL_TYPE[newTypeEnum]) UserSetCellType.purgeInvalidCells(etc, columnIndex);
    if (etc.columnsDetails[columnIndex].activeType.validation) UserSetCellType.purgeInvalidCells(etc, columnIndex);
  }

  private static set(etc: EditableTableComponent, newTypeEnum: USER_SET_COLUMN_TYPE, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    const {cellTypeTotals, elements} = columnDetails;
    columnDetails.activeColumnType =
      newTypeEnum === USER_SET_COLUMN_TYPE.Auto
        ? CellTypeTotalsUtils.getActiveColumnType(cellTypeTotals, elements.length - 1)
        : ACTIVE_COLUMN_TYPE[newTypeEnum as keyof typeof ACTIVE_COLUMN_TYPE] || newTypeEnum;
    columnDetails.userSetColumnType = newTypeEnum;
    columnDetails.activeType = columnDetails.types.find((type) => type.name === newTypeEnum) as ColumnType;
  }

  // prettier-ignore
  public static setIfNew(this: EditableTableComponent, newType: string, columnIndex: number) {
    const codeTypeName = DisplayedCellTypeName.get(newType); // from displayed name to code
    // WORK - TYPE - change the naming convention
    const newTypeEnumStr = USER_SET_COLUMN_TYPE[codeTypeName as keyof typeof USER_SET_COLUMN_TYPE] || codeTypeName;
    const previousTypeEnum = this.columnsDetails[columnIndex].userSetColumnType;
    if (newTypeEnumStr !== previousTypeEnum) {
      UserSetCellType.set(this, newTypeEnumStr, columnIndex);
      UserSetCellType.purgeInvalidCellsIfValidable(this, newTypeEnumStr as keyof typeof VALIDABLE_CELL_TYPE, columnIndex);
      if (TEXT_DIV_COLUMN_TYPE[previousTypeEnum] && !TEXT_DIV_COLUMN_TYPE[newTypeEnumStr]) {
        DataCellElement.convertColumnFromTextDivColumnToData(this, columnIndex);
      } else if (this.columnsDetails[columnIndex].activeType.categories
          || newTypeEnumStr === USER_SET_COLUMN_TYPE.Category) {
        CategoryDropdownItem.populateItems(this, columnIndex);
        // items need to be populated before we know what color each cell text needs to be turned into
        CategoryCellElement.convertColumnTypeToCategory(this, columnIndex, previousTypeEnum);
      } else if (DATE_COLUMN_TYPE[newTypeEnumStr] || this.columnsDetails[columnIndex].activeType.calendar) {
        DateCellElement.convertColumnTypeToDate(this, columnIndex, previousTypeEnum, newTypeEnumStr);
      }
    }
  }
}
