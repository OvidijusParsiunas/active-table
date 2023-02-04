import {ColumnSizerGenericUtils} from '../columnSizer/utils/columnSizerGenericUtils';

export class CellDividerElement {
  public static create() {
    const cellDividerElement = document.createElement('div');
    cellDividerElement.classList.add('cell-divider');
    cellDividerElement.style.height = ColumnSizerGenericUtils.canHeightBeInherited() ? '100%' : 'inherit';
    return cellDividerElement;
  }
}
