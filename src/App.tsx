import React, { useState } from 'react';
import './App.css';
import { Chart } from './components/Chart';

function App() {
  const coordsInitial = [{ x: 90, y: 90 }, { x: 180, y: 90 }, { x: 180, y: 180 }, { x: 270, y: 180 }];

  const [coords, setCoords] = useState(coordsInitial);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== 13) return;

    const values = event.currentTarget.value.split(' ');

    if (values.length > 2 || !values.every((value) => !isNaN(+value))) {
      event.currentTarget.value = 'Error';
      return;
    };

    const newCoord = { x: +values[0], y: +values[1] };
    setCoords([...coords, newCoord]);
    event.currentTarget.value = '';
  };

  return (
    <>
      <Chart viewHeight={250} viewWidth={500} coords={coords} dpiRatio={2} />
      <div>
        <span>Add new point in format (x y) </span>
        <input onKeyDown={onKeyDown} />
      </div>
      {coords.map(({ x, y }, index) => <div key={index}>{x} {y}</div>)}
    </>
  );
}

export default App;
