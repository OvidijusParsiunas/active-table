import {VW, VH} from '../../consts/windowDimensionPostfixes';
import {FullStringDimension} from '../../types/dimensions';
import {Render} from '../../utils/render/render';
import {ActiveTable} from '../../activeTable';

interface DimensionsToObserve {
  width: boolean;
  height: boolean;
}

export class WindowResize {
  // prettier-ignore
  private static resize(this: ActiveTable, observe: DimensionsToObserve) {
    const {_tableDimensions} = this;
    if ((observe.width && window.innerWidth !== _tableDimensions.recordedWindowWidth)
        || (observe.height && window.innerHeight !== _tableDimensions.recordedWindowHeight)) {
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

  private static extractDimensionsToObserve(at: ActiveTable) {
    const {tableStyle, _overflow} = at;
    const postfixes = [tableStyle.width, tableStyle.maxWidth, _overflow?.maxHeight, _overflow?.maxWidth].map((dimension) =>
      WindowResize.extractPostfix(dimension)
    );
    return {
      width: !!postfixes.find((entry) => entry === VW),
      height: !!postfixes.find((entry) => entry === VH),
    };
  }

  public static observeIfRequired(at: ActiveTable) {
    const dimensionsToObserve = WindowResize.extractDimensionsToObserve(at);
    if (dimensionsToObserve.width || dimensionsToObserve.height) {
      window.addEventListener('resize', WindowResize.resize.bind(at, dimensionsToObserve));
    }
  }
}
