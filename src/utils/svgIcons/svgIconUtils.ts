export class SVGIconUtils {
  public static readonly WHITE_FILTER = `brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(3877%)
    hue-rotate(184deg) brightness(103%) contrast(100%)`;

  public static readonly DARK_GREY_FILTER = `brightness(0) saturate(100%) invert(7%) sepia(23%) saturate(258%)
    hue-rotate(63deg) brightness(99%) contrast(97%)`;

  // REF-10
  public static createSVGElement(svgString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    return doc.documentElement;
  }
}
