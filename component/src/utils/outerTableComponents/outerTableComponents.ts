import {FileButtonElements} from '../../elements/files/buttons/fileButtonElements';
import {PaginationElements} from '../../elements/pagination/paginationElements';
import {OuterContainerElements} from './outerContainerElements';
import {CSVElemets} from '../../elements/CSV/CSVElements';
import {ActiveTable} from '../../activeTable';

export class OuterTableComponents {
  public static create(at: ActiveTable) {
    const outerContainers = OuterContainerElements.create(at);
    if (at.pagination) PaginationElements.create(at, outerContainers);
    if (at.files) FileButtonElements.create(at, outerContainers);
    if (at.csv) CSVElemets.create(at, outerContainers);
  }
}
