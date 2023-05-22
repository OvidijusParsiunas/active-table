import {CellElement} from '../../../elements/cell/cellElement';
import {FilterRowsUtils} from './filterRowsUtils';

export class FilterRowsViaPromises {
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
    for (let i = 0; i < dataRows.length / FilterRowsUtils.CHUNK_SIZE; i += 1) {
      const chunkIndex = i * FilterRowsUtils.CHUNK_SIZE;
      const chunk = dataRows.slice(chunkIndex, chunkIndex + FilterRowsUtils.CHUNK_SIZE);
      FilterRowsViaPromises.processString(chunk, filterText, columnIndex, isCaseSensitive);
    }
  }
}
