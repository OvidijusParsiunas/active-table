import React from 'react';

export default function TableContainer({children}) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#f6f8fa',
        borderRadius: '5px',
        padding: '18px',
        paddingTop: '25px',
      }}
    >
      <div style={{width: '100%'}}>{children}</div>
    </div>
  );
}
