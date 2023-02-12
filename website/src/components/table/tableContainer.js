import React from 'react';

export function extractChildTableElement(containerElement) {
  return containerElement?.children[0]?.children[0];
}

export default function TableContainer({children, customStyle}) {
  return (
    <div className="example-container">
      <div style={{width: '100%', ...customStyle}}>{children}</div>
    </div>
  );
}
