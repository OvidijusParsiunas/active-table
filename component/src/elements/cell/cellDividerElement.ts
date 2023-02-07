import {ColumnSizerGenericUtils} from '../columnSizer/utils/columnSizerGenericUtils';

export class CellDividerElement {
  public static create(rowIndex: number) {
    const cellDividerElement = document.createElement('div');
    cellDividerElement.classList.add('cell-divider');
    // the 100% is needed for the column sizers to automatically get full cell height
    // only applying it there as a bug has been identified where '100%' would cause row dropdown cell overlays
    // to expand to full table height and which in turn produced stuttering when hovering over the first cell
    // in any row when there is an overflow
    if (rowIndex === 0) {
      cellDividerElement.style.height = ColumnSizerGenericUtils.canHeightBeInherited() ? '100%' : 'inherit';
    }
    return cellDividerElement;
  }
}
