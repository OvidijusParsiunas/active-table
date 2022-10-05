export class Color {
  private static LATEST_PASTELE_COLOR = Color.generateNewPasteleColor();

  private static generateNewPasteleColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
  }

  public static setNewLatestPasteleColor() {
    Color.LATEST_PASTELE_COLOR = Color.generateNewPasteleColor();
  }

  public static getLatestPasteleColor() {
    return Color.LATEST_PASTELE_COLOR;
  }

  public static getLatestPasteleColorAndSetNew() {
    const pasteleColor = Color.getLatestPasteleColor();
    Color.setNewLatestPasteleColor();
    return pasteleColor;
  }
}
