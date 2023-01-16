export class RGBAToHex {
  private static readonly REGEX = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/;

  private static extractIndividualNumbers(rgba: string) {
    return rgba.match(RGBAToHex.REGEX) as string[];
  }

  public static convert(rgba: string) {
    return `#${RGBAToHex.extractIndividualNumbers(rgba)
      .slice(1)
      .map((n: string, i: number) =>
        (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')
      )
      .join('')}`;
  }
}
