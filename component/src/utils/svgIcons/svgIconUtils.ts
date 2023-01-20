export class SVGIconUtils {
  public static readonly WHITE_FILTER = `brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(3877%)
    hue-rotate(184deg) brightness(103%) contrast(100%)`;

  public static readonly LIGHT_GREY_FILTER = `brightness(0) saturate(100%) invert(68%) sepia(0%) saturate(317%)
    hue-rotate(84deg) brightness(92%) contrast(93%)`;

  public static readonly HEADER_FILTER = `brightness(0) saturate(100%) invert(34%) sepia(0%) saturate(1075%)
    hue-rotate(211deg) brightness(96%) contrast(90%)`;

  public static readonly DROPDOWN_ITEM_FILTER = `brightness(0) saturate(100%) invert(7%) sepia(23%) saturate(258%)
    hue-rotate(63deg) brightness(99%) contrast(97%)`;

  // REF-10
  public static createSVGElement(svgString: string): SVGGraphicsElement {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    return doc.documentElement as unknown as SVGGraphicsElement;
  }
}
