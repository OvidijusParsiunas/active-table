import {ArrayUtils} from '../array/arrayUtils';

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

  // REF-34
  // these colors are used before the above
  public static getDefaultColors() {
    return ArrayUtils.shuffle([
      `hsl(154deg 96% 90%)`,
      `hsl(50deg 96% 90%)`,
      `hsl(171deg 96% 90%)`,
      `hsl(76deg 96% 90%)`,
      `hsl(315deg 96% 90%)`,
      `hsl(251deg 96% 90%)`,
      `hsl(209deg 84% 92%)`,
      `hsl(0deg 100% 81%)`,
      `hsl(29deg 100% 79%)`,
      `hsl(31deg 75% 70%)`,
      `hsl(0deg 0% 81%)`,
      `hsl(137deg 80% 80%)`,
      `hsl(60deg 100% 82%)`,
      `hsl(219deg 100% 84%)`,
      `hsl(93deg 62% 74%)`,
      `hsl(54deg 93% 84%)`,
    ]);
  }
}
