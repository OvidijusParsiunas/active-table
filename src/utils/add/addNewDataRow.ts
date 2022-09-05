import {EditableTableComponent} from '../../editable-table-component';
import {CellElement} from '../../elements/cell/cellElement';
import {RowElement} from '../../elements/row/rowElement';
import {TableRow} from '../../types/tableContents';

export class AddNewDataRow {
  private static createNewRowCellData(etc: EditableTableComponent): TableRow {
    const numberOfColumns = etc.contents[0].length;
    return new Array(numberOfColumns).fill(etc.defaultValue);
  }

  private static append(etc: EditableTableComponent, newRowData: TableRow) {
    const newRowElement = RowElement.create(etc, newRowData, etc.contents.length);
    etc.dataElementRef?.appendChild(newRowElement);
    etc.contents.push(newRowData);
    Array.from(newRowElement.children).forEach((value, columnIndex) =>
      etc.onCellUpdate(value.textContent as string, etc.contents.length - 1, columnIndex)
    );
  }

  private static updateLowerRows(etc: EditableTableComponent, startingRowIndex: number) {
    if (etc.dataElementRef) {
      const lowerRows = Array.from(etc.dataElementRef.children).slice(startingRowIndex);
      lowerRows.forEach((rowElement: Node, rowIndex: number) => {
        const relativeRowIndex = rowIndex + startingRowIndex + 1;
        Array.from((rowElement as HTMLElement).children).forEach((cellElement: Node, columnIndex: number) => {
          etc.onCellUpdate(cellElement.textContent as string, relativeRowIndex, columnIndex);
          CellElement.setCellEvents(etc, cellElement as HTMLElement, relativeRowIndex, columnIndex);
        });
      });
    }
  }

  private static insert(etc: EditableTableComponent, newRowData: TableRow, contentsRowIndex: number) {
    const dataIndex = contentsRowIndex + 1;
    const newRowElement = RowElement.create(etc, newRowData, dataIndex);
    etc.dataElementRef?.insertBefore(newRowElement, etc.dataElementRef.children[contentsRowIndex]);
    etc.contents.splice(dataIndex, 0, newRowData);
    Array.from(newRowElement.children).forEach((value, columnIndex) => {
      etc.onCellUpdate(value.textContent as string, dataIndex, columnIndex);
    });
    setTimeout(() => AddNewDataRow.updateLowerRows(etc, dataIndex));
  }

  public static add(this: EditableTableComponent, contentsRowIndex: number) {
    const newRowData = AddNewDataRow.createNewRowCellData(this);
    if (contentsRowIndex < this.contents.length) {
      AddNewDataRow.insert(this, newRowData, contentsRowIndex);
    } else {
      AddNewDataRow.append(this, newRowData);
    }
    this.onTableUpdate(this.contents);
  }
}
