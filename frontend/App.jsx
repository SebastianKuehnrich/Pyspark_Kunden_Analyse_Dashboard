// App.jsx - Hauptkomponente
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';

// API-URL dynamisch setzen
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    // Versuche Daten vom Backend zu laden
    fetch(`${API_URL}/api/data`)
      .then(response => {
        if (!response.ok) throw new Error('Backend hat keine Daten');
        return response.json();
      })
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        console.warn('Backend-Daten nicht verfügbar, verwende Fallback-Daten', error);
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
