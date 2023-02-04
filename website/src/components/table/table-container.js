import React from 'react';

export default function TableContainer({children, customStyle}) {
  return (
    <div className="example-container">
      <div style={{width: '100%', ...customStyle}}>{children}</div>
    </div>
  );
}
