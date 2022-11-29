import {GenericElementUtils} from '../elements/genericElementUtils';
import {PropertiesOfType} from '../../types/utilityTypes';
import {StringDimension} from '../../types/dimensions';
import {RegexUtils} from '../regex/regexUtils';

export type PossibleStringDimensions<T> = PropertiesOfType<T, StringDimension>;
export type SuccessResult = {width: number; isPercentage: boolean};
type Result = SuccessResult | undefined;

export class StringDimensionUtils {
  private static processDimension(extractedWidth: number, minimalWidth: number) {
    return extractedWidth < minimalWidth ? minimalWidth : extractedWidth;
  }

  // this can also parse numbers incase the client used that
  // prettier-ignore
  public static generateNumberDimensionFromClientString<T>(
      key: keyof PossibleStringDimensions<T>, parentElement: HTMLElement, sourceObj: T, minimalWidth: number): Result {
    const sourcevalue = sourceObj[key] as unknown as string | number;
    const isSourceValueStr = typeof sourcevalue === 'string';
    // parse string or accept the passed in number as px
    let extractedNumber = isSourceValueStr ? Number(RegexUtils.extractIntegerStrs(sourcevalue)[0]) : sourcevalue;
    if (isSourceValueStr && sourcevalue.includes('%')) {
      // if true then holds an unlimited size
      // when this is used for column, this conition should be false
      if (GenericElementUtils.isParentWidthUndetermined(parentElement.style.width)) return;
      if (extractedNumber > 100) extractedNumber = 100;
      const width = parentElement.offsetWidth * (extractedNumber / 100);
      return { width: StringDimensionUtils.processDimension(width, minimalWidth), isPercentage: true };
    }
    return { width: StringDimensionUtils.processDimension(extractedNumber, minimalWidth), isPercentage: false };
  }
}
