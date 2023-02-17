import {PaginationElements} from '../../elements/pagination/paginationElements';
import {OuterContainerElements} from './outerContainerElements';
import {ActiveTable} from '../../activeTable';
import {CSV} from './CSV/CSV';

export class OuterTableComponents {
  public static create(at: ActiveTable) {
    const outerContainers = OuterContainerElements.create(at);
    if (at.pagination) PaginationElements.create(at, outerContainers);
    if (at.csv) CSV.createElementsAndEvents(at, outerContainers);
  }
}
