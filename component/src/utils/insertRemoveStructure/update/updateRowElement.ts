import {ColumnSizerGenericUtils} from '../../../elements/columnSizer/utils/columnSizerGenericUtils';

export class UpdateRowElement {
  private static readonly UNSET = 'unset';

  // required to allow the divider and all its elements to inherit its height (in non chrome or firefox browsers)
  public static updateHeaderRowHeight(rowElement: HTMLElement) {
    if (!ColumnSizerGenericUtils.canHeightBeInherited()) {
      rowElement.style.height = UpdateRowElement.UNSET; // using unset to get highest cell highet
      rowElement.style.height = getComputedStyle(rowElement).height; // rowElement.offsetHeight doesn't get decimal places
    }
  }

  // if this does not capture all events - use in HeaderText.onAttemptChange method instead
  public static updateHeadRowHeightOnKeyDown(tableBody: HTMLElement) {
    if (!ColumnSizerGenericUtils.canHeightBeInherited()) {
      const headerRow = tableBody.children?.[0] as HTMLElement;
      if (headerRow && headerRow.style.height !== UpdateRowElement.UNSET) {
        headerRow.style.height = UpdateRowElement.UNSET; // using unset to get highest cell highet
        setTimeout(() => {
          headerRow.style.height = `${headerRow.offsetHeight}px`;
        });
      }
    }
  }

  public static getUnsetHeightFunc(rowElement: HTMLElement, rowIndex: number) {
    if (!ColumnSizerGenericUtils.canHeightBeInherited() && rowIndex === 0) {
      return () => (rowElement.style.height = UpdateRowElement.UNSET);
    }
    return undefined;
  }
}
