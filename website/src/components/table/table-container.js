import React from 'react';

export default function TableContainer({children}) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'var(--ifm-table-container-background-color)',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        padding: '18px',
        paddingTop: '25px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        border: 'var(--ifm-table-container-border)',
        borderBottom: 'unset',
      }}
    >
      <div style={{width: '100%'}}>{children}</div>
    </div>
  );
}
