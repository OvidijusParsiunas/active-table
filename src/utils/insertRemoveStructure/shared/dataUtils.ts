export class DataUtils {
  public static createDataArray(length: number, defaultCellValue: string): string[] {
    return new Array(length).fill(defaultCellValue);
  }
}
