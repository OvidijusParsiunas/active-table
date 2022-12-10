import {CategoryCellElement} from '../../elements/cell/cellsWithTextDiv/categoryCell/categoryCellElement';
import {DateCellElement} from '../../elements/cell/cellsWithTextDiv/dateCell/dateCellElement';
import {CategoryDropdown} from '../../elements/dropdown/categoryDropdown/categoryDropdown';
import {DataCellElement} from '../../elements/cell/dataCell/dataCellElement';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {CellEvents} from '../../elements/cell/cellEvents';
import {ValidationStyle} from './validationStyle';

export class ChangeColumnType {
  private static setInvalidCellToDefault(etc: EditableTableComponent, rowIndex: number, columnIndex: number) {
    const relativeRowIndex = rowIndex + 1;
    const cellElement = etc.columnsDetails[columnIndex].elements[relativeRowIndex];
    return CellEvents.setCellToDefaultIfNeeded(etc, relativeRowIndex, columnIndex, cellElement, false);
  }

  private static setInvalidCellsToDefault(etc: EditableTableComponent, columnIndex: number) {
    let updateTableEvent = false;
    etc.contents.slice(1).forEach((_, rowIndex) => {
      const isUpdated = ChangeColumnType.setInvalidCellToDefault(etc, rowIndex, columnIndex);
      if (isUpdated && !updateTableEvent) updateTableEvent = true;
    });
    if (updateTableEvent) etc.onTableUpdate(etc.contents);
  }

  private static setNew(etc: EditableTableComponent, newType: string, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    columnDetails.activeType = columnDetails.types.find((type) => type.name === newType) as ColumnTypeInternal;
    return columnDetails.activeType;
  }

  private static changeFunc(etc: EditableTableComponent, newTypeName: string, columnIndex: number) {
    const newType = ChangeColumnType.setNew(etc, newTypeName, columnIndex);
    if (newType.validation && newType.validationProps?.setTextToDefaultOnFail) {
      ChangeColumnType.setInvalidCellsToDefault(etc, columnIndex);
    }
    if (newType.categories) {
      CategoryDropdown.setUpDropdown(etc, columnIndex);
      CategoryCellElement.setColumnCategoryStructure(etc, columnIndex);
    } else if (newType.calendar) {
      DateCellElement.setColumnDateStructure(etc, columnIndex);
    } else {
      DataCellElement.setColumnDataStructure(etc, columnIndex);
    }
  }

  // prettier-ignore
  public static change(this: EditableTableComponent, newTypeName: string, columnIndex: number) {
    const previousType = this.columnsDetails[columnIndex].activeType;
    if (newTypeName !== previousType.name) {
      ValidationStyle.resetValidationStyle(this, columnIndex,
        ChangeColumnType.changeFunc.bind(this, this, newTypeName, columnIndex));
    }
  }
}
