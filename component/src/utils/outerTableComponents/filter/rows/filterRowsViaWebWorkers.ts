import {CellElement} from '../../../../elements/cell/cellElement';
import {FilterRowsInternalUtils} from './filterRowsUtils';

export class FilterRowsViaWebWorkers {
  // cannot use a direct link to a webworker file as parent project may not allow the component to access it
  // const worker = new Worker(new URL('./worker.js', import.meta.url))
  // using a string literal instead, ref:
  // https://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
  public static createWorkerBlobURL(caseSensitive: boolean) {
    const code = `
      self.onmessage = function (event) {
        const {chunk, filterText} = event.data;
        const result = chunk.map((text) => text${caseSensitive ? '' : '.toLocaleLowerCase()'}.includes(filterText));
        self.postMessage(result);
      };
    `;
    const blob = new Blob([code], {type: 'application/javascript'});
    return URL.createObjectURL(blob);
  }

  private static workerToggleRow(start: number, colCells: HTMLElement[], event: MessageEvent) {
    const result = event.data;
    result.forEach((display: boolean, index: number) => {
      const row = (colCells[start + index] as HTMLElement).parentElement as HTMLElement;
      row.style.display = display ? '' : 'none';
    });
  }

  // prettier-ignore
  private static executeWorker(start: number, end: number,
      colCells: HTMLElement[], textArray: string[], filterText: string, workerBlobURL: string) {
    const worker = new Worker(workerBlobURL);
    worker.onmessage = FilterRowsViaWebWorkers.workerToggleRow.bind(this, start, colCells);
    const chunk = textArray.slice(start, end);
    worker.postMessage({chunk, filterText});
  }

  public static filter(objectURL: string, colCells: HTMLElement[], filterText: string) {
    const textArray = colCells.map((cell) => CellElement.getText(cell));
    const chunkSize = FilterRowsInternalUtils.CHUNK_SIZE;
    const numWorkers = Math.ceil(textArray.length / chunkSize);
    for (let i = 0; i < numWorkers; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;
      FilterRowsViaWebWorkers.executeWorker(start, end, colCells, textArray, filterText, objectURL);
    }
  }
}
