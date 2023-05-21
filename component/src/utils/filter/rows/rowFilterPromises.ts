import {CellElement} from '../../../elements/cell/cellElement';
import {RowFilterUtils} from './rowFilterUtils';

export class RowFilterPromises {
  private static processString(chunk: Element[], filterText: string, columnIndex: number, isCaseSensitive?: boolean) {
    new Promise((resolve) => {
      chunk.forEach((row) => {
        const dataText = CellElement.getText(row.children[columnIndex] as HTMLElement);
        const processedText = isCaseSensitive ? dataText : dataText.toLocaleLowerCase();
        const doesCellTextContainFilterInput = processedText.includes(filterText);
        (row as HTMLElement).style.display = doesCellTextContainFilterInput ? '' : 'none';
      });
      resolve(true);
    });
  }

  public static filter(isCaseSensitive: boolean, dataRows: Element[], filterText: string, columnIndex: number) {
    for (let i = 0; i < dataRows.length / RowFilterUtils.CHUNK_SIZE; i += 1) {
      const chunkIndex = i * RowFilterUtils.CHUNK_SIZE;
      const chunk = dataRows.slice(chunkIndex, chunkIndex + RowFilterUtils.CHUNK_SIZE);
      RowFilterPromises.processString(chunk, filterText, columnIndex, isCaseSensitive);
    }
  }
}
