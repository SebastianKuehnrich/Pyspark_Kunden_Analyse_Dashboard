// App.jsx - Hauptkomponente
import React from 'react';
import Dashboard from './Dashboard';
import data from './data.json';

function App() {
  return (
    <div className="App">
      <Dashboard data={data} />
    </div>
  );
}

export default App;

