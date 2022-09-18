type Array2D<T> = T[][];

export class ArrayUtils {
  public static transpose<T>(array: Array2D<T>) {
    const newArray: Array2D<T> = [];
    const maxLength = Math.max(array.length, array[0].length);
    rowLoop: for (let i = 0; i < maxLength; i += 1) {
      const newRow = [];
      for (let j = 0; j < maxLength; j += 1) {
        // array[j] is undefined when array param rows are longer than their total number
        if (array[j] === undefined) break;
        // array[j][i] is undefined when array param has more rows than their length - there is nothing left to transpose
        if (array[j][i] === undefined) break rowLoop;
        newRow.push(array[j][i]);
      }
      newArray.push(newRow);
    }
    return newArray;
  }
}
