import {GenericObject} from '../../types/genericObject';

export class ObjectUtils {
  public static createTwoWayObject(object: GenericObject): GenericObject {
    Object.keys(object).forEach((key) => {
      object[object[key]] = key;
    });
    return object;
  }
}
