import {GlobalItemColors} from '../../types/itemToColor';
import {ArrayUtils} from '../array/arrayUtils';

export class LabelColorUtils {
  private static LATEST_PASTELE_COLOR = LabelColorUtils.generateNewPasteleColor();

  private static generateNewPasteleColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
  }

  public static setNewLatestPasteleColor() {
    LabelColorUtils.LATEST_PASTELE_COLOR = LabelColorUtils.generateNewPasteleColor();
  }

  public static getLatestPasteleColor() {
    return LabelColorUtils.LATEST_PASTELE_COLOR;
  }

  public static getLatestPasteleColorAndSetNew() {
    const pasteleColor = LabelColorUtils.getLatestPasteleColor();
    LabelColorUtils.setNewLatestPasteleColor();
    return pasteleColor;
  }

  // REF-34
  // these colors are used before the above
  private static generateDefaultColors() {
    return ArrayUtils.shuffle([
      'hsl(154deg 96% 90%)',
      'hsl(50deg 96% 90%)',
      'hsl(171deg 96% 90%)',
      'hsl(76deg 96% 90%)',
      'hsl(315deg 96% 90%)',
      'hsl(251deg 96% 90%)',
      'hsl(209deg 84% 92%)',
      'hsl(0deg 100% 81%)',
      'hsl(29deg 100% 79%)',
      'hsl(31deg 73% 75%)',
      'hsl(137deg 80% 80%)',
      'hsl(60deg 100% 82%)',
      'hsl(219deg 100% 84%)',
      'hsl(93deg 62% 74%)',
      'hsl(54deg 93% 84%)',
      'hsl(146deg 100% 90%)',
      'hsl(334deg 100% 87%)',
      'hsl(19deg 95% 84%)',
      'hsl(203deg 95% 84%)',
      'hsl(76deg 100% 78%)',
      'hsl(0deg 100% 86%)',
      'hsl(42deg 82% 82%)',
      'hsl(97deg 100% 87%)',
    ]);
  }

  // this is a solution for same label text across different columns to have the same colors
  public static generateGlobalItemColors(): GlobalItemColors {
    return {
      newColors: LabelColorUtils.generateDefaultColors(),
      existingColors: {},
    };
  }
}
