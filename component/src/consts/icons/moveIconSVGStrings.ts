// REF-10
/* eslint-disable max-len */
function buildIcon(transform: string) {
  return `<?xml version="1.0" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="9" height="9" style="transform: ${transform}">
      <g transform="matrix(0.47368425 0 0 0.47368425 0 0)">
        <g transform="matrix(0.027142858 0 0 0.027142858 0 0)">
          <g>
            <path d="M169 139.73L308.72998 0L349.175 40.484L109.124985 280.544L348.645 520.054L308.74698 559.999L169.01698 420.26904C 92.164986 343.42105 29.286987 280.29904 29.286987 279.99902C 29.286987 279.699 92.165985 216.57303 169.01698 139.72902L169.01698 139.72902L169 139.73zM490.55 139.73L630.27997 0L670.725 40.484L430.675 280.544L670.195 520.054L630.297 559.999L490.56702 420.26904C 413.71503 343.42105 350.83704 280.29904 350.83704 279.99902C 350.83704 279.699 413.71603 216.57303 490.56702 139.72902z" stroke="none" fill="#000000" fill-rule="nonzero" />
          </g>
        </g>
      </g>
    </svg>`;
}

export const MOVE_LEFT_ICON_SVG_STRING = buildIcon('');

export const MOVE_RIGHT_ICON_SVG_STRING = buildIcon('rotate(180deg)');

export const MOVE_UP_ICON_SVG_STRING = buildIcon('rotate(90deg)');

export const MOVE_DOWN_ICON_SVG_STRING = buildIcon('rotate(-90deg)');
