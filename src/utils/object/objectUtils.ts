import {GenericObject} from '../../types/genericObject';

export class ObjectUtils {
  public static createTwoWayObject(object: GenericObject): GenericObject {
    Object.keys(object).forEach((key) => {
      object[object[key]] = key;
    });
    return object;
  }

  public static assignViaIteration(sourceObject: GenericObject, targetObject: GenericObject) {
    Object.keys(sourceObject).forEach((key: string) => {
      targetObject[key] = sourceObject[key];
    });
  }
}
