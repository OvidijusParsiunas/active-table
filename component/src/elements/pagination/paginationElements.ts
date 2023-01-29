import {NumberOfVisibleRowsElement} from './numberOfVisibleRows/numberOfVisibleRowsElement';
import {PaginationContainerElement} from './paginationContainer/paginationContainerElement';
import {RowsPerPageSelectElement} from './rowsPerPageSelect/rowsPerPageSelectElement';
import {PageButtonContainerElement} from './pageButtons/pageButtonContainerElement';
import {ActiveTable} from '../../activeTable';

export class PaginationElements {
  public static readonly PAGINATION_TEXT_COMPONENT_CLASS = 'pagination-text-component';

  public static create(at: ActiveTable) {
    const containers = PaginationContainerElement.addPaginationContainers(at);
    at.paginationInternal.buttonContainer = PageButtonContainerElement.create(at, containers);
    if (at.paginationInternal.rowsPerPageOptionsItemText) {
      RowsPerPageSelectElement.create(at, containers);
    }
    if (at.paginationInternal.displayNumberOfVisibleRows) {
      at.paginationInternal.numberOfVisibleRowsElement = NumberOfVisibleRowsElement.create(at, containers);
    }
  }
}
