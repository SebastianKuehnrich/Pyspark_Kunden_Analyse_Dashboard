// Dashboard.jsx - React Component
import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Dashboard.css';
import CSVUpload from './CSVUpload';

// Chart.js registrieren
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ data: initialData }) => {
  const [data, setData] = useState(initialData);
  const [showChart1, setShowChart1] = useState(false);
  const [showChart2, setShowChart2] = useState(false);
  const [showChart3, setShowChart3] = useState(false);
  const [filterUmsatz, setFilterUmsatz] = useState('');
  const [filterAktivitaet, setFilterAktivitaet] = useState('');
  const [searchVIP, setSearchVIP] = useState('');
  const [showDachLaender, setShowDachLaender] = useState(true);

  // Callback wenn neue Daten hochgeladen wurden
  const handleDataUpdated = (newData) => {
    setData(newData);
  };

  // Daten aus props (werden von Python generiert)
  const {
    maxDate,
    kundenGesamt,
    inaktiveVips,
    verlorenerUmsatz,
    reportUmsatz,
    reportAktivitaet,
    reportDach,
    reportDachLaender,
    reportAndereLaender,
    topInaktiveVips
  } = data;

  // CSV Download Funktionen
  const downloadCSV = (data, filename, headers) => {
    // CSV Header erstellen
    const csvHeaders = headers.join(',') + '\n';

    // CSV Rows erstellen
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        // Zahlen formatieren und Strings escapen
        if (typeof value === 'number') {
          return value;
        }
        return `"${value}"`;
      }).join(',');
    }).join('\n');

    const csvContent = csvHeaders + csvRows;

    // Blob erstellen und Download triggern
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Spezifische Download-Funktionen
  const downloadUmsatzReport = () => {
    downloadCSV(
      filteredUmsatz,
      'report_umsatz_segment.csv',
      ['umsatz_segment', 'anzahl_kunden', 'segment_umsatz', 'avg_umsatz']
    );
  };

  const downloadAktivitaetReport = () => {
    downloadCSV(
      filteredAktivitaet,
      'report_aktivitaet.csv',
      ['aktivitaet_segment', 'anzahl_kunden', 'segment_umsatz']
    );
  };

  const downloadDachReport = () => {
    downloadCSV(
      reportDach,
      'report_dach.csv',
      ['ist_dach_kunde', 'anzahl_kunden', 'gesamt_umsatz', 'avg_umsatz']
    );
  };

  const downloadVipsReport = () => {
    downloadCSV(
      filteredVips,
      'top_inaktive_vips.csv',
      ['customer_id', 'gesamt_umsatz', 'anzahl_bestellungen', 'letzte_bestellung', 'tage_inaktiv']
    );
  };

  // Chart 1: Umsatz nach Segment
  const umsatzChartData = {
    labels: reportUmsatz.map(row => row.umsatz_segment),
    datasets: [{
      label: 'Umsatz in EUR',
      data: reportUmsatz.map(row => row.segment_umsatz),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 2
    }]
  };

  const umsatzChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      title: {
        display: true,
        text: 'Umsatz nach Kundensegment',
        font: { size: 18 }
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('de-DE') + ' €';
          }
        }
      }
    }
  };

  // Chart 2: Aktivität
  const aktivitaetChartData = {
    labels: reportAktivitaet.map(row => row.aktivitaet_segment),
    datasets: [{
      data: reportAktivitaet.map(row => row.segment_umsatz),
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(255, 99, 132, 0.8)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 2
    }]
  };

  const aktivitaetChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      title: {
        display: true,
        text: 'Umsatz nach Aktivitätsstatus',
        font: { size: 18 }
      },
      legend: {
        position: 'bottom'
      }
    }
  };

  // Chart 3: DACH vs International
  const dachChartData = {
    labels: reportDach.map(row => row.ist_dach_kunde),
    datasets: [{
      label: 'Umsatz in EUR',
      data: reportDach.map(row => row.gesamt_umsatz),
      backgroundColor: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)'
      ],
      borderColor: [
        'rgba(102, 126, 234, 1)',
        'rgba(118, 75, 162, 1)'
      ],
      borderWidth: 2
    }]
  };

  const dachChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'DACH vs International Vergleich',
        font: { size: 18 }
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('de-DE') + ' €';
          }
        }
      }
    }
  };

  // Chart 4: Länder-Analyse (dynamisch je nach Toggle)
  const laenderChartData = {
    labels: showDachLaender
      ? (reportDachLaender || []).map(row => row.country)
      : (reportAndereLaender || []).map(row => row.country),
    datasets: [{
      label: 'Umsatz in EUR',
      data: showDachLaender
        ? (reportDachLaender || []).map(row => row.gesamt_umsatz)
        : (reportAndereLaender || []).map(row => row.gesamt_umsatz),
      backgroundColor: showDachLaender
        ? [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)'
          ]
        : [
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(201, 203, 207, 0.8)'
          ],
      borderColor: showDachLaender
        ? [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ]
        : [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)'
          ],
      borderWidth: 2
    }]
  };

  const laenderChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      title: {
        display: true,
        text: showDachLaender ? 'DACH Top 3 Länder' : 'Top 10 Andere Länder',
        font: { size: 18 }
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('de-DE') + ' €';
          }
        }
      }
    }
  };

  // Filter Funktionen
  const filteredUmsatz = reportUmsatz.filter(row =>
    filterUmsatz === '' || row.umsatz_segment === filterUmsatz
  );

  const filteredAktivitaet = reportAktivitaet.filter(row =>
    filterAktivitaet === '' || row.aktivitaet_segment === filterAktivitaet
  );

  const filteredVips = topInaktiveVips.filter(row =>
    searchVIP === '' || row.customer_id.toString().includes(searchVIP)
  );

  return (
    <div className="container">
      <h1>
        <span>Kunden-Analyse Dashboard</span>
        <span className="author">erstellt von Sebastian</span>
      </h1>
      <p><strong>Erstellt mit PySpark | Tag 6: JOINs | {maxDate}</strong></p>

      {/* Übersicht */}
      <div className="card">
        <h2>Übersicht</h2>
        <div className="stat-box">
          <h3>{kundenGesamt.toLocaleString('de-DE')}</h3>
          <p>Kunden gesamt</p>
        </div>
        <div className="stat-box">
          <h3>{inaktiveVips.toLocaleString('de-DE')}</h3>
          <p>Inaktive VIPs</p>
        </div>
        <div className="stat-box">
          <h3>{verlorenerUmsatz.toLocaleString('de-DE', { minimumFractionDigits: 0 })} EUR</h3>
          <p>Umsatz inaktiver VIPs</p>
        </div>
      </div>

      {/* CSV Upload Komponente */}
      <CSVUpload onDataUpdated={handleDataUpdated} />

      {/* Umsatz nach Segment */}
      <div className="card">
        <h2>
          <span>Umsatz nach Segment</span>
          <button
            className={`toggle-btn ${showChart1 ? 'active' : ''}`}
            onClick={() => setShowChart1(!showChart1)}
          >
            {showChart1 ? '📊 Diagramm ausblenden' : '📊 Diagramm anzeigen'}
          </button>
        </h2>
        {showChart1 && (
          <div className="chart-container active">
            <Bar data={umsatzChartData} options={umsatzChartOptions} />
          </div>
        )}
        <div style={{ margin: '10px 0' }}>
          <label htmlFor="filterUmsatz" style={{ fontWeight: 'bold', marginRight: '10px' }}>
            🔽 Filter nach Segment:
          </label>
          <select
            id="filterUmsatz"
            className="search-box"
            value={filterUmsatz}
            onChange={(e) => setFilterUmsatz(e.target.value)}
            style={{ width: 'auto', display: 'inline-block' }}
          >
            <option value="">Alle anzeigen</option>
            <option value="VIP">VIP</option>
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="Gering">Gering</option>
          </select>
        </div>
        <button className="download-btn" onClick={downloadUmsatzReport}>
          📥 CSV Export Umsatz nach Segment
        </button>
        <table>
          <thead>
            <tr>
              <th>Segment</th>
              <th>Anzahl Kunden</th>
              <th>Gesamt-Umsatz</th>
              <th>Durchschnitt</th>
              <th>Umsatzanteil %</th>
            </tr>
          </thead>
          <tbody>
            {filteredUmsatz.map((row, index) => (
              <tr key={index}>
                <td>{row.umsatz_segment}</td>
                <td>{row.anzahl_kunden.toLocaleString('de-DE')}</td>
                <td>{row.segment_umsatz.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td>
                <td>{row.avg_umsatz.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td>
                <td>
                  <strong style={{ color: row.umsatz_anteil_prozent > 30 ? '#28a745' : '#666' }}>
                    {row.umsatz_anteil_prozent ? row.umsatz_anteil_prozent.toFixed(1) : '0.0'}%
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Aktivität */}
      <div className="card">
        <h2>
          <span>Aktivität</span>
          <button
            className={`toggle-btn ${showChart2 ? 'active' : ''}`}
            onClick={() => setShowChart2(!showChart2)}
          >
            {showChart2 ? '📊 Diagramm ausblenden' : '📊 Diagramm anzeigen'}
          </button>
        </h2>
        {showChart2 && (
          <div className="chart-container active">
            <Pie data={aktivitaetChartData} options={aktivitaetChartOptions} />
          </div>
        )}
        <div style={{ margin: '10px 0' }}>
          <label htmlFor="filterAktivitaet" style={{ fontWeight: 'bold', marginRight: '10px' }}>
            🔽 Filter nach Status:
          </label>
          <select
            id="filterAktivitaet"
            className="search-box"
            value={filterAktivitaet}
            onChange={(e) => setFilterAktivitaet(e.target.value)}
            style={{ width: 'auto', display: 'inline-block' }}
          >
            <option value="">Alle anzeigen</option>
            <option value="Aktiv">Aktiv</option>
            <option value="Inaktiv">Inaktiv</option>
            <option value="Verloren">Verloren</option>
          </select>
        </div>
        <button className="download-btn" onClick={downloadAktivitaetReport}>
          📥 CSV Export Aktivität
        </button>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Anzahl Kunden</th>
              <th>Umsatz</th>
            </tr>
          </thead>
          <tbody>
            {filteredAktivitaet.map((row, index) => (
              <tr key={index}>
                <td>{row.aktivitaet_segment}</td>
                <td>{row.anzahl_kunden.toLocaleString('de-DE')}</td>
                <td>{row.segment_umsatz.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Länder-Analyse */}
      <div className="card">
        <h2>
          <span>Länder-Analyse</span>
          <button
            className={`toggle-btn ${showChart3 ? 'active' : ''}`}
            onClick={() => setShowChart3(!showChart3)}
          >
            {showChart3 ? '📊 Diagramm ausblenden' : '📊 Diagramm anzeigen'}
          </button>
        </h2>
        {showChart3 && (
          <div className="chart-container active">
            <Bar data={laenderChartData} options={laenderChartOptions} />
          </div>
        )}
        <div style={{ margin: '10px 0' }}>
          <button
            onClick={() => setShowDachLaender(true)}
            className={`toggle-btn ${showDachLaender ? 'active' : ''}`}
            style={{ marginRight: '10px' }}
          >
            🇩🇪🇦🇹🇨🇭 DACH Top 3
          </button>
          <button
            onClick={() => setShowDachLaender(false)}
            className={`toggle-btn ${!showDachLaender ? 'active' : ''}`}
          >
            🌍 Top 10 Andere Länder
          </button>
        </div>
        <button className="download-btn" onClick={downloadDachReport}>
          📥 CSV Export Länder
        </button>
        <table>
          <thead>
            <tr>
              <th>Land</th>
              <th>Bestellungen</th>
              <th>Gesamt-Umsatz</th>
              <th>Ø Bestellung</th>
            </tr>
          </thead>
          <tbody>
            {showDachLaender
              ? (reportDachLaender || []).map((row, index) => (
                <tr key={index}>
                  <td><strong>{row.country}</strong></td>
                  <td>{row.anzahl_bestellungen?.toLocaleString('de-DE') || '0'}</td>
                  <td>{row.gesamt_umsatz?.toLocaleString('de-DE', { minimumFractionDigits: 2 }) || '0.00'} EUR</td>
                  <td>{row.avg_bestellung?.toLocaleString('de-DE', { minimumFractionDigits: 2 }) || '0.00'} EUR</td>
                </tr>
              ))
              : (reportAndereLaender || []).map((row, index) => (
                <tr key={index}>
                  <td><strong>{row.country}</strong></td>
                  <td>{row.anzahl_bestellungen?.toLocaleString('de-DE') || '0'}</td>
                  <td>{row.gesamt_umsatz?.toLocaleString('de-DE', { minimumFractionDigits: 2 }) || '0.00'} EUR</td>
                  <td>{row.avg_bestellung?.toLocaleString('de-DE', { minimumFractionDigits: 2 }) || '0.00'} EUR</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Top 10 Inaktive VIP-Kunden */}
      <div className="card">
        <h2>Top 10 Inaktive VIP-Kunden</h2>
        <input
          type="text"
          className="search-box"
          placeholder="🔍 Suche nach Kunden-ID..."
          value={searchVIP}
          onChange={(e) => setSearchVIP(e.target.value)}
        />
        <button className="download-btn" onClick={downloadVipsReport}>
          📥 CSV Export Top 30 Inaktive VIPs
        </button>
        <table>
          <thead>
            <tr>
              <th>Kunden-ID</th>
              <th>Umsatz</th>
              <th>Bestellungen</th>
              <th>Letzte Bestellung</th>
              <th>Tage inaktiv</th>
            </tr>
          </thead>
          <tbody>
            {filteredVips.map((row, index) => (
              <tr key={index}>
                <td>{row.customer_id}</td>
                <td>{row.gesamt_umsatz.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td>
                <td>{row.anzahl_bestellungen}</td>
                <td>{row.letzte_bestellung}</td>
                <td>{row.tage_inaktiv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
        <p>Modul 3: Big-Data Analyst | PySpark JOINs | <strong>erstellt von Sebastian</strong></p>
      </footer>
    </div>
  );
};

export default Dashboard;
