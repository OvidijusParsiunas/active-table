import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewColumnElement} from '../../../elements/table/addNewElements/column/addNewColumnElement';
import {EditableTableComponent} from '../../../editable-table-component';
import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {UpdateCellsForColumns} from '../update/updateCellsForColumns';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ExtractElements} from '../../elements/extractElements';
import {ElementDetails} from '../../../types/elementDetails';
import {TableRow} from '../../../types/tableContents';
import {EMPTY_STRING} from '../../../consts/text';
import {LastColumn} from '../shared/lastColumn';
import {MaximumColumns} from './maximumColumns';
import {InsertNewCell} from './insertNewCell';

export class InsertNewColumn {
  // prettier-ignore
  private static updateColumns(
      etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const rowDetails: ElementDetails = { element: rowElement, index: rowIndex };
    const lastColumn: ElementDetails = LastColumn.getDetails(etc.columnsDetails, rowIndex);
    UpdateCellsForColumns.rebindAndFireUpdates(etc, rowDetails, columnIndex, CELL_UPDATE_TYPE.ADD, lastColumn);
  }

  private static insertToAllRows(etc: EditableTableComponent, columnIndex: number, columnData?: TableRow) {
    const rowElements = ExtractElements.textRowsArrFromTBody(etc.tableBodyElementRef as HTMLElement, etc.contents);
    rowElements.forEach((rowElement: Node, rowIndex: number) => {
      const cellText = columnData ? columnData[rowIndex] : EMPTY_STRING;
      InsertNewCell.insertToRow(etc, rowElement as HTMLElement, rowIndex, columnIndex, cellText as string, true);
      setTimeout(() => InsertNewColumn.updateColumns(etc, rowElement as HTMLElement, rowIndex, columnIndex));
    });
  }

  // columnData is in a row format to populate the column by iterating through each row
  public static insert(etc: EditableTableComponent, columnIndex: number, columnData?: TableRow) {
    if (MaximumColumns.canAddMore(etc)) {
      FocusedCellUtils.incrementColumnIndex(etc.focusedElements.cell, columnIndex);
      InsertNewColumn.insertToAllRows(etc, columnIndex, columnData);
      ToggleAdditionElements.update(etc, true, AddNewColumnElement.toggle);
      setTimeout(() => etc.onTableUpdate(etc.contents));
    }
  }

  public static insertEvent(this: EditableTableComponent) {
    InsertNewColumn.insert(this, this.columnsDetails.length);
  }
}
