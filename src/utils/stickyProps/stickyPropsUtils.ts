import {EditableTableComponent} from '../../editable-table-component';

export class StickyProcessUtils {
  public static process(etc: EditableTableComponent) {
    if (typeof etc.isHeaderSticky === 'boolean') {
      etc.stickyProps.header = etc.isHeaderSticky;
    } else if (etc.overflow?.maxHeight) {
      etc.stickyProps.header = true;
    }
  }
}
