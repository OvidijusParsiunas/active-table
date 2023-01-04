import {NumberOfRowsOptionsContainerElement} from './numberOfRowsOptions/numberOfRowsOptionsContainerElement';
import {NumberOfVisibleRowsElement} from './numberOfVisibleRows/numberOfVisibleRowsElement';
import {PaginationContainerElement} from './paginationContainer/paginationContainerElement';
import {PageButtonContainerElement} from './pageButtons/pageButtonContainerElement';
import {EditableTableComponent} from '../../editable-table-component';

export class PaginationElements {
  public static readonly PAGINATION_TEXT_COMPONENT_CLASS = 'pagination-text-component';

  public static create(etc: EditableTableComponent) {
    const containers = PaginationContainerElement.addPaginationContainers(etc);
    etc.paginationInternal.buttonContainer = PageButtonContainerElement.create(etc, containers);
    if (etc.paginationInternal.numberOfRowsOptionsItemText) {
      NumberOfRowsOptionsContainerElement.create(etc, containers);
    }
    if (etc.paginationInternal.displayNumberOfVisibleRows) {
      etc.paginationInternal.numberOfVisibleRowsElement = NumberOfVisibleRowsElement.create(etc, containers);
    }
  }
}
