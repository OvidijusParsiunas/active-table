import {GenericElementUtils} from '../elements/genericElementUtils';
import {VH, VW} from '../../consts/windowDimensionPostfixes';
import {FullStringDimension} from '../../types/dimensions';
import {PropertiesOfType} from '../../types/utilityTypes';
import {ObjectUtils} from '../object/objectUtils';
import {RegexUtils} from '../regex/regexUtils';
import {CSSStyle} from '../../types/cssStyle';

export type PossibleStringDimensions<T> = PropertiesOfType<T, FullStringDimension>;
export type SuccessResult = {number: number; isPercentage: boolean};
type Result = SuccessResult | undefined;

export class StringDimensionUtils {
  private static processDimension(extractedWidth: number, minimalWidth: number) {
    return extractedWidth < minimalWidth ? minimalWidth : extractedWidth;
  }

  // prettier-ignore
  private static processPercentageDimension(parentElement: HTMLElement, extractedNumber: number,
      isWidth: boolean, minimalDimension: number): Result {
    // if true then holds an unlimited size
    // when this is used for column, this condition should be false
    if (extractedNumber > 100) extractedNumber = 100;
    if (isWidth && GenericElementUtils.isParentWidthUndetermined(parentElement.style.width)) return;
    const offset = isWidth ? parentElement.offsetWidth : parentElement.offsetHeight;
    const dimension = offset * (extractedNumber / 100);
    return { number: StringDimensionUtils.processDimension(dimension, minimalDimension), isPercentage: true };
  }

  // can also parse numbers incase the client used that
  // if this returns a number 0 for a %, the likelyhood is that the parent element does not have that dimension set
  // prettier-ignore
  public static generateNumberDimensionFromClientString<T>(key: keyof PossibleStringDimensions<T>,
      parentElement: HTMLElement, sourceObj: T, isWidth: boolean, minimalDimension = 0): Result {
    const sourcevalue = sourceObj[key] as unknown as string | number;
    const isSourceValueStr = typeof sourcevalue === 'string';
    let extractedNumber = isSourceValueStr ? Number(RegexUtils.extractIntegerStrs(sourcevalue)[0]) : sourcevalue;
    if (isSourceValueStr) {
      if (sourcevalue.includes('%')) {
        return StringDimensionUtils.processPercentageDimension(parentElement, extractedNumber, isWidth, minimalDimension);
      }
      if (sourcevalue.includes(VH)) {
        extractedNumber = window.innerHeight * (extractedNumber / 100);
      } else if (sourcevalue.includes(VW)) {
        extractedNumber = window.innerWidth * (extractedNumber / 100);
      }
    }
    return { number: StringDimensionUtils.processDimension(extractedNumber, minimalDimension), isPercentage: false };
  }

  public static removeAllDimensions(style: CSSStyle) {
    ObjectUtils.removeProperties(style, 'width', 'maxHeight', 'minWidth', 'height', 'minHeight', 'maxHeight');
    return style;
  }
}
