// App.jsx - Hauptkomponente
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';

// Fallback-Daten falls data.json nicht vorhanden
const fallbackData = {
  maxDate: new Date().toISOString().split('T')[0],
  kundenGesamt: 0,
  inaktiveVips: 0,
  verlorenerUmsatz: 0,
  reportUmsatz: [],
  reportAktivitaet: [],
  reportDach: [],
  reportDachLaender: [],
  reportAndereLaender: [],
  topInaktiveVips: []
};

function App() {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Versuche data.json zu laden
    fetch('./data.json')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        console.warn('data.json nicht gefunden, verwende Fallback-Daten', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{padding: '20px', textAlign: 'center'}}>Lade Dashboard...</div>;
  }

  return (
    <div className="App">
      <Dashboard data={data} />
    </div>
  );
}

export default App;
