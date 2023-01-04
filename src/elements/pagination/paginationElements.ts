import {NumberOfRowsOptionsContainerElement} from './numberOfRowsOptions/numberOfRowsOptionsContainerElement';
import {NumberOfVisibleRowsElement} from './numberOfVisibleRows/numberOfVisibleRowsElement';
import {PageButtonContainerElement} from './pageButtons/pageButtonContainerElement';
import {EditableTableComponent} from '../../editable-table-component';

export class PaginationElements {
  public static readonly PAGINATION_TEXT_COMPONENT_CLASS = 'pagination-text-component';

  public static create(etc: EditableTableComponent) {
    etc.paginationInternal.buttonContainer = PageButtonContainerElement.create(etc);
    if (etc.paginationInternal.numberOfRowsOptionsItemText) NumberOfRowsOptionsContainerElement.create(etc);
    if (etc.paginationInternal.displayNumberOfVisibleRows) {
      etc.paginationInternal.numberOfVisibleRowsElement = NumberOfVisibleRowsElement.create(etc);
    }
  }
}
