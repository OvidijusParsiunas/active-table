import {CategoryDropdown} from '../../elements/dropdown/categoryDropdown/categoryDropdown';
import {USER_SET_COLUMN_TYPE, ACTIVE_COLUMN_TYPE} from '../../enums/columnType';
import {EditableTableComponent} from '../../editable-table-component';
import {DisplayedCellTypeName} from './displayedCellTypeName';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {CellEvents} from '../../elements/cell/cellEvents';
import {CellTypeTotalsUtils} from './cellTypeTotalsUtils';
import {VALIDABLE_CELL_TYPE} from '../../enums/cellType';
import {ValidateInput} from './validateInput';

export class UserSetCellType {
  // prettier-ignore
  private static purgeInvalidCell(etc: EditableTableComponent, columnsDetails: ColumnsDetailsT,
      rowIndex: number, columnIndex: number) {
    const relativeRowIndex = rowIndex + 1;
    const cellElement = columnsDetails[columnIndex].elements[relativeRowIndex];
    CellEvents.setCellToDefaultIfNeeded(etc, relativeRowIndex, columnIndex, cellElement, false);
  }

  private static purgeInvalidCells(etc: EditableTableComponent, columnIndex: number, newType: VALIDABLE_CELL_TYPE) {
    const {contents, columnsDetails} = etc;
    let updateTableEvent = false;
    contents.slice(1).forEach((row, rowIndex) => {
      const cellText = row[columnIndex] as string;
      if (!ValidateInput.validate(cellText, newType)) {
        UserSetCellType.purgeInvalidCell(etc, columnsDetails, rowIndex, columnIndex);
        updateTableEvent = true;
      }
    });
    if (updateTableEvent) etc.onTableUpdate(contents);
  }

  // prettier-ignore
  private static purgeInvalidCellsIfValidable(etc: EditableTableComponent,
      newTypeEnum: VALIDABLE_CELL_TYPE, columnIndex: number) {
    if (VALIDABLE_CELL_TYPE[newTypeEnum]) UserSetCellType.purgeInvalidCells(etc, columnIndex, newTypeEnum);
  }

  private static set(etc: EditableTableComponent, newTypeEnum: USER_SET_COLUMN_TYPE, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    const {cellTypeTotals, elements} = columnDetails;
    columnDetails.activeColumnType =
      newTypeEnum === USER_SET_COLUMN_TYPE.Auto
        ? CellTypeTotalsUtils.getActiveColumnType(cellTypeTotals, elements.length - 1)
        : ACTIVE_COLUMN_TYPE[newTypeEnum as keyof typeof ACTIVE_COLUMN_TYPE];
    columnDetails.userSetColumnType = newTypeEnum;
  }

  public static setIfNew(this: EditableTableComponent, newType: string, columnIndex: number) {
    const codeTypeName = DisplayedCellTypeName.get(newType); // from displayed name to code
    const newTypeEnum = USER_SET_COLUMN_TYPE[codeTypeName as keyof typeof USER_SET_COLUMN_TYPE];
    if (newTypeEnum !== this.columnsDetails[columnIndex].userSetColumnType) {
      UserSetCellType.set(this, newTypeEnum, columnIndex);
      UserSetCellType.purgeInvalidCellsIfValidable(this, newTypeEnum as keyof typeof VALIDABLE_CELL_TYPE, columnIndex);
      if (newTypeEnum === USER_SET_COLUMN_TYPE.Category) CategoryDropdown.populateItems(this, columnIndex);
    }
  }
}
