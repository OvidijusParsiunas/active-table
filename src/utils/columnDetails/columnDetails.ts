import {ColumnDetailsT, ColumnDetailsTPartial, ColumnSizerT} from '../../types/columnDetails';

export class ColumnDetails {
  public static createPartial(cellElement: HTMLElement): ColumnDetailsTPartial {
    return {elements: [cellElement]};
  }

  public static create(cellElement: HTMLElement, columnSizer: ColumnSizerT): ColumnDetailsT {
    return {elements: [cellElement], columnSizer};
  }
}
