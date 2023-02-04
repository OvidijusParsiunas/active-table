import TableContainer from '@site/src/components/table/table-container';
import React from 'react';

// using child to prevent table re-render
const EventText = React.forwardRef((_, ref) => {
  const [eventsText, setEventsText] = React.useState([]);
  React.useImperativeHandle(ref, () => {
    const closureEventsText = [];
    return {
      updateText: (argument) => {
        if (closureEventsText.length > 3) closureEventsText.pop();
        closureEventsText.unshift(argument);
        setEventsText([...closureEventsText]);
      },
    };
  });
  return (
    <div>
      Latest events:
      {eventsText.map((eventText, index) => (
        <div key={index}>
          {'>'} {JSON.stringify(eventText)}
        </div>
      ))}
    </div>
  );
});

export default function TableContainerEvents({children, propertyName}) {
  const tableContainerRef = React.useRef(null);
  const eventTextRef = React.useRef(null);

  if (tableContainerRef.current) {
    tableContainerRef.current.children[0].children[0].children[0][propertyName] = eventTextRef.current?.updateText;
  }

  return (
    <div>
      <div ref={tableContainerRef}>
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
