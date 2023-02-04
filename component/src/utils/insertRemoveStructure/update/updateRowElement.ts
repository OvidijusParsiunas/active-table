import {ColumnSizerGenericUtils} from '../../../elements/columnSizer/utils/columnSizerGenericUtils';

export class UpdateRowElement {
  // required to allow the divider and all its elements to inherit its height (in non chrome or firefox browsers)
  public static updateHeaderRowHeight(rowElement: HTMLElement) {
    if (!ColumnSizerGenericUtils.canHeightBeInherited()) rowElement.style.height = `${rowElement.offsetHeight}px`;
  }
}
