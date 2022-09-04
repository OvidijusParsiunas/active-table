import {EditableTableComponent} from '../../editable-table-component';
import {CellElement} from '../../elements/cell/cellElement';

export class AddNewCoulmn {
  private static addCell(etc: EditableTableComponent, rowElement: Element, rowIndex: number, isHeader = false) {
    // prettier-ignore
    const cellElement = CellElement.createCellElement(
      etc, etc.defaultValue, rowIndex, rowElement.children.length, isHeader);
    rowElement.appendChild(cellElement);
    etc.contents[rowIndex].push(etc.defaultValue);
    etc.onCellUpdate(etc.defaultValue, rowIndex, rowElement.children.length);
  }

  private static addCellsToDataRows(etc: EditableTableComponent) {
    if (etc.dataElementRef) {
      Array.from(etc.dataElementRef.children).forEach((dataRow, rowIndex: number) => {
        AddNewCoulmn.addCell(etc, dataRow, rowIndex + 1);
      });
    }
  }

  private static addCellToHeaderRow(etc: EditableTableComponent) {
    if (etc.headerElementRef) {
      const headerRow = etc.headerElementRef.children[0];
      AddNewCoulmn.addCell(etc, headerRow, 0, true);
    }
  }

  public static add(etc: EditableTableComponent) {
    AddNewCoulmn.addCellToHeaderRow(etc);
    AddNewCoulmn.addCellsToDataRows(etc);
    etc.onTableUpdate(etc.contents);
  }
}
