import {RowFilterWebWorkers} from './rowFilterWebWorkers';
import {RowFilterPromises} from './rowFilterPromises';

export class RowFilterUtils {
  public static readonly CHUNK_SIZE = 2;

  public static getFilterFunc(isCaseSensitive: boolean) {
    return window.Worker
      ? RowFilterWebWorkers.filter.bind(this, RowFilterWebWorkers.createWorkerBlobURL(isCaseSensitive))
      : RowFilterPromises.filter.bind(this, isCaseSensitive);
  }
}
