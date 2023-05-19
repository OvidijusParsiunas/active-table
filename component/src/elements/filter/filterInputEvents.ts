import {ExtractElements} from '../../utils/elements/extractElements';
import {ActiveTable} from '../../activeTable';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
// WORK - ability to toggle if case senseitive
export class FilterInputEvents {
  private static readonly CHUNK_SIZE = 4;

  private static toggleRowBasedOnFilterSync(dataRows: Element[], filterText: string, columnIndex: number) {
    dataRows.forEach((rowElement) => {
      const cellText = rowElement.children[columnIndex];
      const cellTextL = (cellText.textContent as string).toLocaleLowerCase();
      const doesCellTextContainFilterInput = cellTextL.includes(filterText);
      (rowElement as HTMLElement).style.display = doesCellTextContainFilterInput ? '' : 'none';
    });
  }

  private static workerToggleRow(start: number, dataRows: Element[], event: MessageEvent) {
    const result = event.data;
    result.forEach((display: boolean, index: number) => {
      (dataRows[start + index] as HTMLElement).style.display = display ? '' : 'none';
    });
  }

  // prettier-ignore
  private static executeWorker(start: number, end: number,
      dataRows: Element[], textArray: string[], filterText: string, workerBlobURL: string) {
    const worker = new Worker(workerBlobURL);
    worker.onmessage = FilterInputEvents.workerToggleRow.bind(this, start, dataRows);
    const chunk = textArray.slice(start, end);
    worker.postMessage({chunk, filterText});
  }

  private static processUsingWorkers(dataRows: Element[], filterText: string, columnIndex: number, objectURL: string) {
    const textArray = dataRows.map((row) => row.children[columnIndex].textContent) as string[];
    const chunkSize = FilterInputEvents.CHUNK_SIZE;
    const numWorkers = Math.ceil(textArray.length / chunkSize);
    for (let i = 0; i < numWorkers; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;
      FilterInputEvents.executeWorker(start, end, dataRows, textArray, filterText, objectURL);
    }
  }

  // cannot use a direct link to a webworker file as parent project may not allow the component to access it
  // const worker = new Worker(new URL('./worker.js', import.meta.url))
  // using a string literal instead, ref:
  // https://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
  private static createWorkerBlobURL() {
    const code = `
      self.onmessage = function (event) {
        const {chunk, filterText} = event.data;
        const result = chunk.map((text) => text.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()));
        self.postMessage(result);
      };
    `;
    const blob = new Blob([code], {type: 'application/javascript'});
    return URL.createObjectURL(blob);
  }

  // WORK - be careful about pagination
  public static setEvents(at: ActiveTable, inputElement: HTMLInputElement, columnIndex: number) {
    const {_tableBodyElementRef, content} = at;
    const processRows = window.Worker
      ? FilterInputEvents.processUsingWorkers
      : FilterInputEvents.toggleRowBasedOnFilterSync;
    const workerBlobURL = FilterInputEvents.createWorkerBlobURL();
    inputElement.oninput = () => {
      const filterText = inputElement.value.toLocaleLowerCase();
      const dataRows = ExtractElements.textRowsArrFromTBody(_tableBodyElementRef as HTMLElement, content).slice(1);
      processRows(dataRows, filterText, columnIndex, workerBlobURL);
    };
  }
}
