export class LITElementTypeConverters {
  public static convertToBoolean(value: string | null): boolean {
    return typeof value === 'string' ? value === 'true' : Boolean(value);
  }

  public static convertToFunction(value: string | null | Function): Function {
    if (typeof value === 'function') {
      return value;
    }
    if (typeof value === 'string') {
      const evaluatedExpression = eval(value);
      if (typeof evaluatedExpression === 'function') return evaluatedExpression;
    }
    return () => {};
  }
}
