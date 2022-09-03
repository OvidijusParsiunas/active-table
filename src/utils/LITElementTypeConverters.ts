export class LITElementTypeConverters {
  public static convertToBoolean(value: string | null): boolean {
    return typeof value === 'string' ? value === 'true' : Boolean(value);
  }
}
