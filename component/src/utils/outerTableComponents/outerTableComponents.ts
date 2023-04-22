import {PaginationElements} from '../../elements/pagination/paginationElements';
import {OuterContainerElements} from './outerContainerElements';
import {CSVElemets} from '../../elements/CSV/CSVElements';
import {CSVInternalUtils} from './CSV/CSVInternalUtils';
import {ActiveTable} from '../../activeTable';

export class OuterTableComponents {
  public static create(at: ActiveTable) {
    if (at.csv?.buttons) CSVInternalUtils.processButtons(at.csv.buttons, at._csv);
    const outerContainers = OuterContainerElements.create(at);
    if (at.pagination) PaginationElements.create(at, outerContainers);
    if (at.csv) CSVElemets.create(at, outerContainers);
  }
}
