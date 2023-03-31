// REF-10
// prettier-ignore
/* eslint-disable max-len */
function buildIcon(transform: string) {
  return `<?xml version="1.0" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="9" height="12" style="transform: ${transform}">
      <g transform="matrix(0.5 0 0 0.5 0 0)">
        <path d="M0 0L24 0L24 24L0 24L0 0z" stroke="none" fill="none" />
        <path d="M3 18L9 18L9 16L3 16L3 18zM3 6L3 8L21 8L21 6L3 6zM3 13L15 13L15 11L3 11L3 13z" stroke="none" fill="#000000" fill-rule="nonzero" />
      </g>
    </svg>`;
}

export const SORT_ASC_ICON_SVG_STRING = buildIcon('scale(1, -1)');

export const SORT_DESC_ICON_SVG_STRING = buildIcon('');
