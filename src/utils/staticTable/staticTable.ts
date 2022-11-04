import {Browser} from '../browser/browser';

// static table is considered one which has its dimensions pre-set that cannot be changed
export class StaticTable {
  public static isStaticWidth(width?: number) {
    if (width !== undefined) return true;
    return Browser.IS_SAFARI;
  }
}
