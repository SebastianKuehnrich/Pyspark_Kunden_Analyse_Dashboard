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

const Dashboard = ({ data }) => {
  const [showChart1, setShowChart1] = useState(false);
  const [showChart2, setShowChart2] = useState(false);
  const [showChart3, setShowChart3] = useState(false);
  const [filterUmsatz, setFilterUmsatz] = useState('');
  const [filterAktivitaet, setFilterAktivitaet] = useState('');
  const [searchVIP, setSearchVIP] = useState('');

  // Daten aus props (werden von Python generiert)
  const {
    maxDate,
    kundenGesamt,
    inaktiveVips,
    verlorenerUmsatz,
    reportUmsatz,
    reportAktivitaet,
    reportDach,
    topInaktiveVips
  } = data;

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
        <table>
          <thead>
            <tr>
              <th>Segment</th>
              <th>Anzahl Kunden</th>
              <th>Gesamt-Umsatz</th>
              <th>Durchschnitt</th>
            </tr>
          </thead>
          <tbody>
            {filteredUmsatz.map((row, index) => (
              <tr key={index}>
                <td>{row.umsatz_segment}</td>
                <td>{row.anzahl_kunden.toLocaleString('de-DE')}</td>
                <td>{row.segment_umsatz.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td>
                <td>{row.avg_umsatz.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td>
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

      {/* DACH vs International */}
      <div className="card">
        <h2>
          <span>DACH vs International</span>
          <button
            className={`toggle-btn ${showChart3 ? 'active' : ''}`}
            onClick={() => setShowChart3(!showChart3)}
          >
            {showChart3 ? '📊 Diagramm ausblenden' : '📊 Diagramm anzeigen'}
          </button>
        </h2>
        {showChart3 && (
          <div className="chart-container active">
            <Bar data={dachChartData} options={dachChartOptions} />
          </div>
        )}
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Anzahl Kunden</th>
              <th>Gesamt-Umsatz</th>
              <th>Durchschnitt</th>
            </tr>
          </thead>
          <tbody>
            {reportDach.map((row, index) => (
              <tr key={index}>
                <td>{row.ist_dach_kunde}</td>
                <td>{row.anzahl_kunden.toLocaleString('de-DE')}</td>
                <td>{row.gesamt_umsatz.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td>
                <td>{row.avg_umsatz.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td>
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
