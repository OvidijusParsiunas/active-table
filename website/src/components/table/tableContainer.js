import React from 'react';

export function extractChildTableElement(containerElement) {
  return containerElement?.children[0]?.children[0];
}

export default function TableContainer({children}) {
  return (
    <div className="documentation-example-container">
      <div>{children}</div>
    </div>
  );
}
