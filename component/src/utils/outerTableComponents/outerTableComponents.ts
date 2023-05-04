import {PaginationElements} from '../../elements/pagination/paginationElements';
import {FileButtonElements} from '../../elements/files/fileButtonElements';
import {OuterContainerElements} from './outerContainerElements';
import {ActiveTable} from '../../activeTable';

export class OuterTableComponents {
  public static create(at: ActiveTable) {
    const outerContainers = OuterContainerElements.create(at);
    if (at.pagination) PaginationElements.create(at, outerContainers);
    if (at.files) FileButtonElements.create(at, outerContainers);
  }
}
