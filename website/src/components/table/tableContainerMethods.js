import TableContainer, {extractChildTableElement} from '@site/src/components/table/tableContainer';
import LiveTableData from './liveTableData';
import React from 'react';

function ResultText(props) {
  return (
    <div>
      Method results:
      <LiveTableData data={props.resultText}></LiveTableData>
    </div>
  );
}

function click(table, resultText, setResultText, propertyName, displayResults) {
  const activeTableReference = extractChildTableElement(table);
  const content = activeTableReference[propertyName]();
  if (displayResults ?? true) {
    let newResultTextArr = [...resultText];
    if (newResultTextArr.length === 1 && newResultTextArr[0] === '') newResultTextArr = [];
    if (newResultTextArr.length > 3) newResultTextArr.pop();
    newResultTextArr.unshift(content);
    setResultText(newResultTextArr);
  }
}

export default function TableContainerMethods({children, propertyName, displayResults}) {
  const tableContainerRef = React.useRef(null);
  const [resultText, setResultText] = React.useState(['']);

  return (
    <div>
      <div ref={tableContainerRef}>
        <TableContainer>{children}</TableContainer>
      </div>
      <div className="documentation-example-container">
        <button
          className="documentation-method-button"
          onClick={() =>
            click(tableContainerRef.current.children[0], resultText, setResultText, propertyName, displayResults)
          }
        >
          Call Method
        </button>
        {(displayResults ?? true) && <ResultText resultText={resultText} />}
      </div>
    </div>
  );
}
