import React from 'react';
import './App.css';
import { Chart } from './components/Chart';
import { LinesMock } from './components/Chart.mock';

function App() {
  return (
    <>
      <Chart
        viewHeight={250}
        viewWidth={500}
        dpiRatio={2}
        options={{ line: { width: 2 }, padding: 50, rowsCount: 5 }}
        lines={LinesMock}
      />
    </>
  );
}

export default App;
