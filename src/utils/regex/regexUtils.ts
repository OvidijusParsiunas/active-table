export class RegexUtils {
  public static extractIntegerStrs(targetString: string) {
    return targetString.match(/\d+/g) as RegExpMatchArray;
  }

  public static extractFloatStrs(targetString: string) {
    return targetString.match(/-?\d+(\.\d+)?$/g) as RegExpMatchArray;
  }
}
