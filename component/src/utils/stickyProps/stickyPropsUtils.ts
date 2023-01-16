import {ActiveTable} from '../../activeTable';

export class StickyProcessUtils {
  public static process(at: ActiveTable) {
    if (typeof at.isHeaderSticky === 'boolean') {
      at.stickyProps.header = at.isHeaderSticky;
    } else if (at.overflow?.maxHeight) {
      at.stickyProps.header = true;
    }
  }
}
