import {CellElement} from '../../../../elements/cell/cellElement';
import {ChunkFilterData} from '../../../../types/filterInternal';

export class FilterRowsViaWebWorkers {
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
        ${FilterRowsViaWebWorkers.TRAVERSE_MATCHING_INDEXES}
      } else {
        ${FilterRowsViaWebWorkers.TRAVERSE_CHUNK}
      }
    };
  `;

  private static processOtherColumnsIfPresent(blobURL: string, chunksData: ChunkFilterData[], matchingIndexes: number[]) {
    if (chunksData.length > 1 && matchingIndexes.length > 0) {
      FilterRowsViaWebWorkers.execute(blobURL, chunksData.slice(1), matchingIndexes);
    }
  }

  // cannot use a direct link to a webworker file as parent project may not allow the component to access it
  // const worker = new Worker(new URL('./worker.js', import.meta.url))
  // using a string literal instead, ref:
  // https://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
  public static createWorkerBlobURL() {
    const blob = new Blob([FilterRowsViaWebWorkers.CODE], {type: 'application/javascript'});
    return URL.createObjectURL(blob);
  }

  private static hideRows(blobURL: string, chunksData: ChunkFilterData[], event: MessageEvent) {
    const {colCells} = chunksData[0];
    const {matchingIndexes, notMatchingIndexes} = event.data;
    notMatchingIndexes.forEach((index: number) => {
      const row = (colCells[index] as HTMLElement).parentElement as HTMLElement;
      row.style.display = 'none';
    });
    FilterRowsViaWebWorkers.processOtherColumnsIfPresent(blobURL, chunksData, matchingIndexes);
  }

  private static toggleRows(blobURL: string, chunksData: ChunkFilterData[], event: MessageEvent) {
    const matchingIndexes: number[] = [];
    const {colCells} = chunksData[0];
    const result = event.data;
    result.forEach((display: boolean, index: number) => {
      const row = (colCells[index] as HTMLElement).parentElement as HTMLElement;
      if (display) {
        row.style.display = '';
        matchingIndexes.push(index);
      } else {
        row.style.display = 'none';
      }
    });
    FilterRowsViaWebWorkers.processOtherColumnsIfPresent(blobURL, chunksData, matchingIndexes);
  }

  // prettier-ignore
  public static execute(blobURL: string, chunksData: ChunkFilterData[], indexArray?: number[]) {
    const worker = new Worker(blobURL);
    worker.onmessage = indexArray ? FilterRowsViaWebWorkers.hideRows.bind(this, blobURL, chunksData)
      : FilterRowsViaWebWorkers.toggleRows.bind(this, blobURL, chunksData);
    const chunkData = chunksData[0];
    worker.postMessage({
      chunk: chunkData.colCells.map((cell) => CellElement.getText(cell)),
      filterText: chunkData.filterText,
      isCaseSensitive: chunkData.isCaseSensitive,
      indexArray,
    });
  }
}
