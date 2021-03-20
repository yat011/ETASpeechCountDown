import React from 'react';
import './App.css';
import CountDown from './features/countDown/CountDown';
import Transportation from './features/transportation/Transportation';

function App() {
  return (
    <div className="App">
        <CountDown/>
        <Transportation providerNames={"hi"}></Transportation>
    </div>
  );
}

export default App;
