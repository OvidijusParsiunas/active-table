import TableContainer from '@site/src/components/table/table-container';
import React from 'react';

// using child to prevent table re-render
const ResultText = React.forwardRef((_, ref) => {
  const [resultsText, setResultsText] = React.useState([]);
  React.useImperativeHandle(ref, () => {
    const closureResultsText = [];
    return {
      updateText: (argument) => {
        if (closureResultsText.length > 3) closureResultsText.pop();
        closureResultsText.unshift(argument);
        setResultsText([...closureResultsText]);
      },
    };
  });
  return (
    <div>
      Method results:
      {resultsText.map((eventText, index) => (
        <div key={index}>
          {'>'} {JSON.stringify(eventText)}
        </div>
      ))}
    </div>
  );
});

export default function TableContainerMethods({children, propertyname}) {
  const tableContainerRef = React.useRef(null);
  const eventTextRef = React.useRef(null);
  const updateText = eventTextRef.current?.updateText; // stored in a reference for closure to work

  const click = () => {
    const content = tableContainerRef.current.children[0].children[0].children[0][propertyname]();
    updateText(content);
  };

  return (
    <div>
      <div ref={tableContainerRef}>
        <TableContainer>{children}</TableContainer>
      </div>
      <div className="example-container">
        <button className="method-button" onClick={click}>
          Call Method
        </button>
        <ResultText ref={eventTextRef}></ResultText>
      </div>
    </div>
  );
}
