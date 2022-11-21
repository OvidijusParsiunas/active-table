export class CellHighlightUtil {
  // there are two ways of enabling cell highlighting:
  // 1 - through the use of the following class
  public static readonly HIGHLIGHTABLE_CELL_CLASS = 'highlightable-cell';
  // 2 - manual cell highighlighting, this is used for cases where we want to control when the color appears
  // or disappears, e.g. keeping the highlight color when header/index dropdowns are opened
  private static readonly HOVER_BACKGROUND_COLOR = '#f7f7f7';

  public static fade(cellElement: HTMLElement) {
    cellElement.style.backgroundColor = '';
  }

  public static highlight(cellElement: HTMLElement) {
    cellElement.style.backgroundColor = CellHighlightUtil.HOVER_BACKGROUND_COLOR;
  }
}
