import TableContainer from '@site/src/components/table/table-container';
import React from 'react';

// using child to prevent table re-render
const EventText = React.forwardRef((_, ref) => {
  const [eventText, setEventText] = React.useState({});
  React.useImperativeHandle(ref, () => ({
    updateText: (argument) => {
      setEventText(argument);
    },
  }));
  return <div>Latest event: {JSON.stringify(eventText)}</div>;
});

export default function TableContainerEvents({children}) {
  const dynamicUpdateTableContainer = React.useRef(null);
  const eventTextRef = React.useRef(null);

  if (dynamicUpdateTableContainer.current) {
    dynamicUpdateTableContainer.current.children[0].children[0].children[0].onCellUpdate =
      eventTextRef.current?.updateText;
  }
  return (
    <div>
      <div ref={dynamicUpdateTableContainer}>
        <TableContainer>{children}</TableContainer>
      </div>
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
        <EventText ref={eventTextRef}></EventText>
      </div>
    </div>
  );
}
