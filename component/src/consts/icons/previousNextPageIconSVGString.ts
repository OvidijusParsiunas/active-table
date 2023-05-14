// REF-10
// prettier-ignore
/* eslint-disable max-len */
function buildIcon(transform: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: ${transform}">
      <path d="M5.5 5L11.7929 11.2929C12.1834 11.6834 12.1834 12.3166 11.7929 12.7071L5.5 19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}

export const PREVIOUS_PAGE_ICON_SVG_STRING = buildIcon('rotate(180deg)');

export const NEXT_PAGE_ICON_SVG_STRING = buildIcon('');
