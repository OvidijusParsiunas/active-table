import React from 'react';

export function extractChildTableElement(containerElement) {
  return containerElement?.children[0]?.children[0];
}

export default function TableContainer({children, minHeight}) {
  return (
    <div className="documentation-example-container" style={{minHeight: `${minHeight || 343}px`}}>
      <div>{children}</div>
    </div>
  );
}
