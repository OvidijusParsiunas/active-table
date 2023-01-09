import {EditableTableComponent} from '../../editable-table-component';
import {VW, VH} from '../../consts/windowDimensionPostfixes';
import {FullStringDimension} from '../../types/dimensions';
import {Render} from '../../utils/render/render';

interface DimensionsToObserve {
  width: boolean;
  height: boolean;
}

export class WindowResize {
  // prettier-ignore
  private static resize(this: EditableTableComponent, observe: DimensionsToObserve) {
    const {tableDimensionsInternal} = this;
    if ((observe.width && window.innerWidth !== tableDimensionsInternal.recordedWindowWidth)
        || (observe.height && window.innerHeight !== tableDimensionsInternal.recordedWindowHeight)) {
      Render.renderTable(this);
    }
  }

  private static extractPostfix(dimension?: FullStringDimension) {
    if (typeof dimension === 'string') {
      if (dimension.includes(VW)) return VW;
      if (dimension.includes(VH)) return VH;
    }
    return '';
  }

  // prettier-ignore
  private static extractDimensionsToObserve(etc: EditableTableComponent) {
    const postfixes = [
      etc.tableDimensions.width, etc.tableDimensions.maxWidth, etc.overflow?.maxHeight, etc.overflow?.maxWidth
    ].map((dimension) => WindowResize.extractPostfix(dimension))
    return {
      width: !!postfixes.find((entry) => entry === VW),
      height: !!postfixes.find((entry) => entry === VH),
    };
  }

  public static observeIfRequired(etc: EditableTableComponent) {
    const dimensionsToObserve = WindowResize.extractDimensionsToObserve(etc);
    if (dimensionsToObserve.width || dimensionsToObserve.height) {
      window.addEventListener('resize', WindowResize.resize.bind(etc, dimensionsToObserve));
    }
  }
}
