export class CellHighlightUtil {
  public static readonly DEFAULT_HIGHLIGHT_COLOR = '#f7f7f7';

  public static fade(cellElement: HTMLElement, defaultColor: string) {
    cellElement.style.backgroundColor = defaultColor || '';
  }

  public static highlight(cellElement: HTMLElement, hoverColor: string) {
    cellElement.style.backgroundColor = hoverColor;
  }
}
