import TableContainer, {extractChildTableElement} from '@site/src/components/table/tableContainer';
import LiveTableData from './liveTableData';
import React from 'react';

// using child to prevent table re-render
const EventText = React.forwardRef(({propertyName}, ref) => {
  const [eventsText, setEventsText] = React.useState([propertyName === 'onRender' ? 'Finished rendering' : '']);
  React.useImperativeHandle(ref, () => {
    const closureEventsText = [];
    return {
      updateText: (argument) => {
        if (!ref.current) return;
        if (closureEventsText.length > 3) closureEventsText.pop();
        closureEventsText.unshift(JSON.parse(JSON.stringify(argument)));
        setEventsText([...closureEventsText]);
      },
    };
  });
  return (
    <div>
      Latest events:
      <LiveTableData data={eventsText}></LiveTableData>
    </div>
  );
});

export default function TableContainerEvents({children, propertyName}) {
  const tableContainerRef = React.useRef(null);
  const eventTextRef = React.useRef(null);

  React.useEffect(() => {
    setTimeout(() => {
      if (tableContainerRef.current) {
        const syncReference = tableContainerRef.current;
        if (tableContainerRef.current && eventTextRef.current) {
          const activeTableReference = extractChildTableElement(tableContainerRef.current.children[0]);
          activeTableReference[propertyName] = eventTextRef.current?.updateText;
        } else {
          const activeTableReference = extractChildTableElement(syncReference.children[0]);
          activeTableReference[propertyName] = () => {};
        }
      }
    }, 40); // in a timeout as tableContainerRef.current not always set on start
  }, []);

  return (
    <div>
      <div ref={tableContainerRef}>
        <TableContainer>{children}</TableContainer>
      </div>
      <div className="documentation-example-container">
        <EventText propertyName={propertyName} ref={eventTextRef}></EventText>
      </div>
    </div>
  );
}
