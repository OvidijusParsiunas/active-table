import {ActiveTable} from '../../activeTable';

export class StickyProcessUtils {
  public static process(at: ActiveTable) {
    if (typeof at.stickyHeader === 'boolean') {
      at.stickyProps.header = at.stickyHeader;
    } else if (at.overflow?.maxHeight) {
      at.stickyProps.header = true;
    }
  }
}
