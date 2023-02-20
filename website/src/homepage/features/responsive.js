import ActiveTableBrowser from '../../components/table/activeTableBrowser';
import React from 'react';

function mouseMoving(mouseClick, leftTableRef, rightTableRef, event) {
  if (mouseClick.isClicked) {
    mouseClick.offset += event.movementX;
    leftTableRef.current.style.width = `calc(50% + ${mouseClick.offset - 20}px)`;
    rightTableRef.current.style.width = `calc(50% + ${-mouseClick.offset - 20}px)`;
  }
}

function mouseUp(mouseClick) {
  mouseClick.isClicked = false;
}

function mouseDown(mouseClick) {
  mouseClick.isClicked = true;
}

function Resizer(props) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{width: '40px', position: 'relative', cursor: 'col-resize', userSelect: 'none'}}
      onMouseDown={mouseDown.bind(this, props.mouseClick)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: '5px',
          height: '100%',
          backgroundColor: hovered ? '#46a0ff' : '#909090',
          borderRadius: '5px',
          userSelect: 'none',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          width: '14px',
          height: '30px',
          backgroundColor: hovered ? '#2d8bed' : '#757575',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '5px',
          pointerEvents: 'none',
        }}
      >
        <div style={{marginLeft: 'auto', marginRight: 'auto', width: '8px'}}>
          <div style={{width: '2px', top: '0px', float: 'left', marginTop: '2px'}}>
            <div className="resizer-dot"></div>
            <div className="resizer-dot"></div>
            <div className="resizer-dot"></div>
          </div>
          <div style={{width: '2px', top: '0px', float: 'right', marginTop: '2px'}}>
            <div className="resizer-dot"></div>
            <div className="resizer-dot"></div>
            <div className="resizer-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Responsive() {
  const mouseClick = {isClicked: false, offset: 0};
  const leftTableRef = React.useRef(null);
  const rightTableRef = React.useRef(null);
  return (
    <div
      style={{marginTop: '120px', paddingLeft: '4%', paddingRight: '4%'}}
      onMouseMove={mouseMoving.bind(this, mouseClick, leftTableRef, rightTableRef)}
      onMouseUp={mouseUp.bind(this, mouseClick)}
    >
      <div className="feature-style">Responsive design</div>
      <div style={{display: 'flex', marginTop: '20px'}}>
        <div style={{float: 'left', width: 'calc(50% - 20px)'}} ref={leftTableRef}>
          <div style={{width: '100%', float: 'right', display: 'flex'}}>
            <ActiveTableBrowser
              tableStyle={{borderRadius: '5px', width: '100%'}}
              content={[
                ['Planet', 'Diameter', 'Mass', 'Moons'],
                ['Earth', 12756, 5.97, 1],
                ['Mars', 6792, 0.642, 2],
                ['Jupiter', 142984, 1898, 79],
                ['Neptune', 49528, 102, 14],
              ]}
            ></ActiveTableBrowser>
          </div>
        </div>
        <Resizer mouseClick={mouseClick}></Resizer>
        <div style={{float: 'right', width: 'calc(50% - 20px)'}} ref={rightTableRef}>
          <div style={{width: '100%', float: 'left', display: 'flex'}}>
            <ActiveTableBrowser
              tableStyle={{borderRadius: '5px', width: '100%'}}
              content={[
                ['Planet', 'Diameter', 'Mass', 'Moons'],
                ['Earth', 12756, 5.97, 1],
                ['Mars', 6792, 0.642, 2],
                ['Jupiter', 142984, 1898, 79],
                ['Neptune', 49528, 102, 14],
              ]}
            ></ActiveTableBrowser>
          </div>
        </div>
      </div>
    </div>
  );
}
