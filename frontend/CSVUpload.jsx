import React, { useState } from 'react';
import './CSVUpload.css';

// API-URL dynamisch setzen: Railway oder lokal
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CSVUpload = ({ onDataUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Bitte nur CSV-Dateien hochladen!');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simuliere Fortschritt
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch(`${API_URL}/api/upload-csv`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Analyse erfolgreich! Datei: ${result.filename}`);

        // Aktualisiere Dashboard mit neuen Daten
        if (onDataUpdated && result.data) {
          onDataUpdated(result.data);
        }

        // Reset nach 3 Sekunden
        setTimeout(() => {
          setMessage('');
          setProgress(0);
          setUploading(false);
        }, 3000);
      } else {
        setError(`❌ Fehler: ${result.error}`);
        setUploading(false);
        setProgress(0);
      }
    } catch (err) {
      setError(`❌ Verbindungsfehler: ${err.message}`);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="csv-upload-container">
      <div className="upload-card">
        <h3>📂 CSV-Daten hochladen</h3>
        <p className="upload-description">
          Lade eine neue CSV-Datei hoch, um das Dashboard zu aktualisieren.
          <br />
          <small>Format: ecommerce_data.csv (Spalten: transaction_id, customer_id, product_category, ...)</small>
        </p>

        <div className="upload-area">
          <input
            type="file"
            id="csv-file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <label htmlFor="csv-file" className={`upload-button ${uploading ? 'disabled' : ''}`}>
            {uploading ? '⏳ Analysiere...' : '📤 CSV hochladen'}
          </label>
        </div>

        {uploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">{progress}%</p>
          </div>
        )}

        {message && (
          <div className="message success">
            {message}
          </div>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <div className="upload-info">
          <p>ℹ️ Die Analyse kann je nach Dateigröße 30-60 Sekunden dauern.</p>
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;
