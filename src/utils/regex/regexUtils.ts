export class RegexUtils {
  public static extractIntegerValues(targetString: string) {
    return targetString.match(/\d+/g) as RegExpMatchArray;
  }

  public static extractFloatValues(targetString: string) {
    return targetString.match(/-?\d+(\.\d+)?$/g) as RegExpMatchArray;
  }
}
