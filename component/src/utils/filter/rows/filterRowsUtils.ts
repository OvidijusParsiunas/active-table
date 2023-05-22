import {FilterRowsViaWebWorkers} from './filterRowsViaWebWorkers';
import {FilterRowsViaPromises} from './filterRowsViaPromises';

export class FilterRowsUtils {
  public static readonly CHUNK_SIZE = 2;

  public static getFilterFunc(isCaseSensitive: boolean) {
    return window.Worker
      ? FilterRowsViaWebWorkers.filter.bind(this, FilterRowsViaWebWorkers.createWorkerBlobURL(isCaseSensitive))
      : FilterRowsViaPromises.filter.bind(this, isCaseSensitive);
  }
}
