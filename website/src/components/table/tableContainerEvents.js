import TableContainer, {extractChildTableElement} from '@site/src/components/table/tableContainer';
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

export default function TableContainerEvents({children, propertyname}) {
  const tableContainerRef = React.useRef(null);
  const eventTextRef = React.useRef(null);

  if (tableContainerRef.current) {
    const syncReference = tableContainerRef.current;
    setTimeout(() => {
      if (tableContainerRef.current && eventTextRef.current) {
        const activeTableReference = extractChildTableElement(tableContainerRef.current.children[0]);
        activeTableReference[propertyname] = eventTextRef.current?.updateText;
      } else {
        const activeTableReference = extractChildTableElement(syncReference.children[0]);
        activeTableReference[propertyname] = () => {};
      }
    });
  }

  return (
    <div>
      <div ref={tableContainerRef}>
        <TableContainer>{children}</TableContainer>
      </div>
      <div className="example-container">
        <EventText ref={eventTextRef}></EventText>
      </div>
    </div>
  );
}
