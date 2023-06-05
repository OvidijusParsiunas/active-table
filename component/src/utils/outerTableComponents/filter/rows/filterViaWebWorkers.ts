import {ChunkFilterData} from '../../../../types/visibilityInternal';
import {CellElement} from '../../../../elements/cell/cellElement';
import {FilterInternalUtils} from './filterInternalUtils';

// REF-42
export class FilterViaWebWorkers {
  private static readonly TRAVERSE_CHUNK = `
    const result = chunk.map((text) => (isCaseSensitive ? text : text.toLocaleLowerCase()).includes(filterText));
    self.postMessage(result);
  `;

  private static readonly TRAVERSE_MATCHING_INDEXES = `
    const matchingIndexes = [];
    const notMatchingIndexes = [];
    indexArray.forEach((index) => {
      const text = chunk[index];
      const isMatching = (isCaseSensitive ? text : text.toLocaleLowerCase()).includes(filterText);
      if (isMatching) {
        matchingIndexes.push(index);
      } else {
        notMatchingIndexes.push(index);
      }
    });
    self.postMessage({matchingIndexes, notMatchingIndexes});
  `;

  private static readonly CODE = `
    self.onmessage = function (event) {
      const {chunk, indexArray, filterText, isCaseSensitive} = event.data;
      if (indexArray) {
        ${FilterViaWebWorkers.TRAVERSE_MATCHING_INDEXES}
      } else {
        ${FilterViaWebWorkers.TRAVERSE_CHUNK}
      }
    };
  `;

  // prettier-ignore
  private static processOtherColumnsIfPresent(
      finish: () => void, blobURL: string, chunksData: ChunkFilterData[], matchingIndexes: number[]) {
    FilterInternalUtils.ACTIVE_WORKERS -= 1;
    if (chunksData.length > 1 && matchingIndexes.length > 0) {
      FilterViaWebWorkers.execute(finish, blobURL, chunksData.slice(1), matchingIndexes);
    } else if (FilterInternalUtils.ACTIVE_WORKERS === 0)
      finish();
  }

  // cannot use a direct link to a webworker file as parent project may not allow the component to access it
  // const worker = new Worker(new URL('./worker.js', import.meta.url))
  // using a string literal instead, ref:
  // https://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
  public static createWorkerBlobURL() {
    const blob = new Blob([FilterViaWebWorkers.CODE], {type: 'application/javascript'});
    return URL.createObjectURL(blob);
  }

  private static hideRows(finish: () => void, blobURL: string, chunksData: ChunkFilterData[], event: MessageEvent) {
    const {colCells} = chunksData[0];
    const {matchingIndexes, notMatchingIndexes} = event.data;
    notMatchingIndexes.forEach((index: number) => {
      const row = (colCells[index] as HTMLElement).parentElement as HTMLElement;
      row.classList.add(FilterInternalUtils.HIDDEN_ROW_CLASS);
    });
    FilterViaWebWorkers.processOtherColumnsIfPresent(finish, blobURL, chunksData, matchingIndexes);
  }

  private static toggleRows(finish: () => void, blobURL: string, chunksData: ChunkFilterData[], event: MessageEvent) {
    const matchingIndexes: number[] = [];
    const {colCells} = chunksData[0];
    const result = event.data;
    result.forEach((display: boolean, index: number) => {
      const row = (colCells[index] as HTMLElement).parentElement as HTMLElement;
      if (display) {
        row.classList.remove(FilterInternalUtils.HIDDEN_ROW_CLASS);
        matchingIndexes.push(index);
      } else {
        row.classList.add(FilterInternalUtils.HIDDEN_ROW_CLASS);
      }
    });
    FilterViaWebWorkers.processOtherColumnsIfPresent(finish, blobURL, chunksData, matchingIndexes);
  }

  // prettier-ignore
  public static execute(finish: () => void, blobURL: string, chunksData: ChunkFilterData[], indexArray?: number[]) {
    const worker = new Worker(blobURL);
    FilterInternalUtils.ACTIVE_WORKERS += 1;
    worker.onmessage = indexArray ? FilterViaWebWorkers.hideRows.bind(this, finish, blobURL, chunksData)
      : FilterViaWebWorkers.toggleRows.bind(this, finish, blobURL, chunksData);
    const chunkData = chunksData[0];
    worker.postMessage({
      chunk: chunkData.colCells.map((cell) => CellElement.getText(cell)),
      filterText: chunkData.filterText,
      isCaseSensitive: chunkData.isCaseSensitive,
      indexArray,
    });
  }
}
