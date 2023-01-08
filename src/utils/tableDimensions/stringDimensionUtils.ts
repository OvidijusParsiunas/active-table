import {GenericElementUtils} from '../elements/genericElementUtils';
import {PropertiesOfType} from '../../types/utilityTypes';
import {StringDimension} from '../../types/dimensions';
import {RegexUtils} from '../regex/regexUtils';

export type PossibleStringDimensions<T> = PropertiesOfType<T, StringDimension>;
export type SuccessResult = {number: number; wasPercentage: boolean};
type Result = SuccessResult | undefined;

export class StringDimensionUtils {
  private static processDimension(extractedWidth: number, minimalWidth: number) {
    return extractedWidth < minimalWidth ? minimalWidth : extractedWidth;
  }

  // can also parse numbers incase the client used that
  // if this returns a number 0 for a %, the likelyhood is that the parent element does not have that dimension set
  // prettier-ignore
  public static generateNumberDimensionFromClientString<T>(key: keyof PossibleStringDimensions<T>,
      parentElement: HTMLElement, sourceObj: T, isWidth: boolean, minimalDimension = 0): Result {
    const sourcevalue = sourceObj[key] as unknown as string | number;
    const isSourceValueStr = typeof sourcevalue === 'string';
    // parse string or accept the passed in number as px
    let extractedNumber = isSourceValueStr ? Number(RegexUtils.extractIntegerStrs(sourcevalue)[0]) : sourcevalue;
    if (isSourceValueStr && sourcevalue.includes('%')) {
      // if true then holds an unlimited size
      // when this is used for column, this conition should be false
      if (isWidth && GenericElementUtils.isParentWidthUndetermined(parentElement.style.width)) return;
      if (extractedNumber > 100) extractedNumber = 100;
      const offset = isWidth ? parentElement.offsetWidth : parentElement.offsetHeight;
      const dimension = offset * (extractedNumber / 100);
      return { number: StringDimensionUtils.processDimension(dimension, minimalDimension), wasPercentage: true };
    }
    return { number: StringDimensionUtils.processDimension(extractedNumber, minimalDimension), wasPercentage: false };
  }
}
