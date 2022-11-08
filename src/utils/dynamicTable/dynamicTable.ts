// It has been identified that when there are is no width set on the table - the default html does not allow
// the table to expand beyond the parent limits and instead automatically reduces the column widths. This is
// problematic as the widths are no longer to what they are set to in state and the resize functionality
// no longer works as intended, hence the dynamic table class allows the table to expand the parent element
// and keep the intended column widths
export class DynamicTable {
  private static readonly DYNAMIC_TABLE_WIDTH_CLASS = 'dynamic-table-width';

  public static setDynamicTableClass(tableElement: HTMLElement) {
    tableElement.classList.add(DynamicTable.DYNAMIC_TABLE_WIDTH_CLASS);
  }
}
