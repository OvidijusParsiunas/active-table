import {PaginationElements} from '../../elements/pagination/paginationElements';
import {OuterContainerElements} from './outerContainerElements';
import {CSVElemets} from '../../elements/CSV/CSVElements';
import {CSVInternalUtils} from './CSV/CSVInternalUtils';
import {ActiveTable} from '../../activeTable';

export class OuterTableComponents {
  public static create(at: ActiveTable) {
    if (at.csvButtons) CSVInternalUtils.process(at.csvButtons, at._csv);
    const outerContainers = OuterContainerElements.create(at);
    if (at.pagination) PaginationElements.create(at, outerContainers);
    if (at.csvButtons) CSVElemets.create(at, outerContainers);
  }
}
