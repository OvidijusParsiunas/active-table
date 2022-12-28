import {EditableTableComponent} from '../../editable-table-component';
import {PaginationInternal} from '../../types/paginationInternal';
import {ExtractElements} from '../elements/extractElements';
import {Pagination} from '../../types/pagination';

export class PaginationUtils {
  private static readonly VISIBLE_ROW = '';
  private static readonly HIDDEN_ROW = 'none';

  // prettier-ignore
  private static displayRows(etc: EditableTableComponent, buttonNumber: number) {
      const {paginationInternal: {numberOfEntries, visibleRows}, tableBodyElementRef, contents} = etc;
      const tableRows = ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents);
      const startingRowIndex = numberOfEntries * (buttonNumber - 1) + 1;
      tableRows.slice(startingRowIndex, startingRowIndex + numberOfEntries).forEach((rowElement) => {
        (rowElement as HTMLElement).style.display = PaginationUtils.VISIBLE_ROW;
        visibleRows.push(rowElement as HTMLElement);
      });
    }

  private static hideRows(paginationInternal: PaginationInternal) {
    paginationInternal.visibleRows.forEach((rowElement) => {
      rowElement.style.display = PaginationUtils.HIDDEN_ROW;
    });
    paginationInternal.visibleRows = [];
  }

  public static changeDisplayedRows(etc: EditableTableComponent, buttonNumber: number) {
    PaginationUtils.hideRows(etc.paginationInternal);
    PaginationUtils.displayRows(etc, buttonNumber);
  }

  public static processInternal(pagination: Pagination, paginationInternal: PaginationInternal) {
    paginationInternal.numberOfEntries = pagination.numberOfEntries;
  }

  public static getDefaultInternal(): PaginationInternal {
    return {
      activeButtonNumber: 1,
      visibleRows: [],
      numberOfEntries: 10,
    };
  }
}
