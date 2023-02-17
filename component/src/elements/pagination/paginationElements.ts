import {NumberOfVisibleRowsElement} from './numberOfVisibleRows/numberOfVisibleRowsElement';
import {RowsPerPageSelectElement} from './rowsPerPageSelect/rowsPerPageSelectElement';
import {PageButtonContainerElement} from './pageButtons/pageButtonContainerElement';
import {OuterContainers} from '../../types/outerContainer';
import {ActiveTable} from '../../activeTable';

export class PaginationElements {
  public static readonly PAGINATION_TEXT_COMPONENT_CLASS = 'pagination-text-component';

  public static create(at: ActiveTable, containers: OuterContainers) {
    at._pagination.buttonContainer = PageButtonContainerElement.create(at);
    PageButtonContainerElement.addInitialElements(at, containers);
    if (at._pagination.rowsPerPageOptionsItemText) {
      RowsPerPageSelectElement.create(at, containers);
    }
    if (at._pagination.displayNumberOfVisibleRows) {
      at._pagination.numberOfVisibleRowsElement = NumberOfVisibleRowsElement.create(at, containers);
    }
  }
}
