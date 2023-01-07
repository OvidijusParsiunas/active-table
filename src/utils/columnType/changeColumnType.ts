import {HeaderIconCellElement} from '../../elements/cell/cellsWithTextDiv/headerIconCell/headerIconCellElement';
import {ConvertToSelectCell} from '../../elements/cell/cellsWithTextDiv/selectCell/convertToSelectCell';
import {DateCellElement} from '../../elements/cell/cellsWithTextDiv/dateCell/dateCellElement';
import {CategoryDropdown} from '../../elements/dropdown/categoryDropdown/categoryDropdown';
import {CheckboxCellElement} from '../../elements/cell/checkboxCell/checkboxCellElement';
import {DataCellElement} from '../../elements/cell/dataCell/dataCellElement';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {ProcessedDataTextStyle} from './processedDataTextStyle';
import {CellElement} from '../../elements/cell/cellElement';
import {CellEvents} from '../../elements/cell/cellEvents';
import {ColumnDetailsT} from '../../types/columnDetails';

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

  public static setNewStructureBasedOnType(etc: EditableTableComponent, columnIndex: number, newType: ColumnTypeInternal) {
    if (newType.categories) {
      CategoryDropdown.setUpDropdown(etc, columnIndex);
      ConvertToSelectCell.convertColumn(etc, columnIndex, newType);
    } else if (newType.calendar) {
      DateCellElement.setColumnDateStructure(etc, columnIndex);
    } else if (newType.checkbox) {
      CheckboxCellElement.setColumnCheckboxStructure(etc, columnIndex);
    } else {
      DataCellElement.setColumnDataStructure(etc, columnIndex);
    }
  }

  // this is required as switching to another type makes it difficult to overwrite text element (as there isn't one) for
  // checkboxes when validation fails
  private static resetCheckboxElements(columnDetails: ColumnDetailsT) {
    columnDetails.elements.slice(1).forEach((element) => {
      element.innerText = CellElement.getText(element);
    });
  }

  private static resetAndChangeFunc(etc: EditableTableComponent, newTypeName: string, columnIndex: number) {
    const columnDetails = etc.columnsDetails[columnIndex];
    if (columnDetails.activeType.checkbox) ChangeColumnType.resetCheckboxElements(columnDetails);
    const newType = ChangeColumnType.setNew(etc, newTypeName, columnIndex);
    if (newType.textValidation.func && newType.textValidation.setTextToDefaultOnFail) {
      ChangeColumnType.setInvalidCellsToDefault(etc, columnIndex);
    }
    ChangeColumnType.setNewStructureBasedOnType(etc, columnIndex, newType);
    if (etc.areIconsDisplayedInHeaders) HeaderIconCellElement.changeHeaderIcon(etc.columnsDetails[columnIndex]);
  }

  // prettier-ignore
  public static change(this: EditableTableComponent, newTypeName: string, columnIndex: number) {
    const previousType = this.columnsDetails[columnIndex].activeType;
    if (newTypeName !== previousType.name) {
      ProcessedDataTextStyle.resetDataCellsStyle(this, columnIndex,
        ChangeColumnType.resetAndChangeFunc.bind(this, this, newTypeName, columnIndex));
    }
  }
}
