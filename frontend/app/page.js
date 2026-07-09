'use client';

import { useState, useEffect } from 'react';
import CsvUploader from '../components/CsvUploader';
import VirtualizedDataTable from '../components/VirtualizedDataTable';
import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [importResults, setImportResults] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let interval;
    if (isImporting) {
      interval = setInterval(() => {
        setDisplayProgress(prev => {
          // If actual progress overtakes display, jump to it
          if (importProgress > prev) return importProgress;
          // Smoothly flow towards 99% (Zeno's paradox loading)
          return prev + (99 - prev) * 0.05;
        });
      }, 300);
    } else {
      setDisplayProgress(0);
    }
    return () => clearInterval(interval);
  }, [isImporting, importProgress]);

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };

  const handleParsed = (data, headers) => {
    setCsvData(data);
    setCsvHeaders(headers);
    setImportResults(null);
    setImportProgress(0);
  };

  const handleConfirmImport = async () => {
    setIsImporting(true);
    setImportProgress(0);
    
    let totalImported = 0;
    let totalSkipped = 0;
    let successfullyParsed = [];
    let skipped = [];

    const batchSize = 10; // Send 10 rows at a time for better progress granularity
    const totalBatches = Math.ceil(csvData.length / batchSize);

    try {
      for (let i = 0; i < csvData.length; i += batchSize) {
        const batch = csvData.slice(i, i + batchSize);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ records: batch })
        });

        const result = await res.json();
        if (res.ok) {
          totalImported += result.total_imported;
          totalSkipped += result.total_skipped;
          successfullyParsed = [...successfullyParsed, ...result.successfullyParsed];
          skipped = [...skipped, ...result.skipped];
        } else {
          console.error('Batch error:', result.error);
        }

        const currentBatchIndex = Math.floor(i / batchSize) + 1;
        setImportProgress(Math.round((currentBatchIndex / totalBatches) * 100));
      }

      setImportResults({
        total_imported: totalImported,
        total_skipped: totalSkipped,
        successfullyParsed,
        skipped
      });

    } catch (err) {
      console.error('Failed to import:', err);
      alert('Import failed during streaming. Please check the backend connection.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ textAlign: 'center', flex: 2 }}>
          <h1 style={{ fontSize: '36px', marginBottom: '8px', color: 'var(--foreground)' }}>
            GrowEasy CRM Importer
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '16px' }}>Intelligently extract CRM leads from any CSV format using AI.</p>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={toggleTheme} className="btn" style={{ padding: '8px', borderRadius: '50%', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            {isDarkMode ? <Sun size={24} color="var(--foreground)" /> : <Moon size={24} color="var(--foreground)" />}
          </button>
        </div>
      </header>

      {!importResults ? (
        <>
          <section>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Step 1: Upload CSV</h2>
            <CsvUploader onParsed={handleParsed} />
          </section>

          {csvData.length > 0 && (
            <section className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '24px' }}>Step 2: Preview</h2>
                <button 
                  className={`btn ${isImporting ? 'btn-disabled' : 'btn-primary'}`} 
                  onClick={handleConfirmImport}
                  disabled={isImporting}
                >
                  {isImporting ? `Processing... ${Math.round(displayProgress)}%` : 'Step 3: Confirm Import'}
                </button>
              </div>
              
              {isImporting && (
                <div style={{ width: '100%', height: '8px', background: 'var(--card-border)', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                  <div className="progress-bar-striped" style={{ width: `${displayProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                </div>
              )}

              <VirtualizedDataTable headers={csvHeaders} data={csvData} title="Raw CSV Data" />
            </section>
          )}
        </>
      ) : (
        <section className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px' }}>Step 4: AI Extraction Results</h2>
            <button 
              className="btn btn-primary" 
              onClick={() => { setCsvData([]); setCsvHeaders([]); setImportResults(null); }}
            >
              Import Another File
            </button>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
             <div className="glass-panel" style={{ flex: 1, padding: '24px', textAlign: 'center' }}>
               <div style={{ fontSize: '36px', color: 'var(--success)', fontWeight: 'bold' }}>{importResults.total_imported}</div>
               <div style={{ color: 'var(--muted)' }}>Successfully Imported</div>
             </div>
             <div className="glass-panel" style={{ flex: 1, padding: '24px', textAlign: 'center' }}>
               <div style={{ fontSize: '36px', color: 'var(--danger)', fontWeight: 'bold' }}>{importResults.total_skipped}</div>
               <div style={{ color: 'var(--muted)' }}>Skipped Records</div>
             </div>
          </div>

          {importResults.successfullyParsed?.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <VirtualizedDataTable 
                headers={['created_at', 'name', 'email', 'country_code', 'mobile_without_country_code', 'company', 'city', 'state', 'country', 'lead_owner', 'crm_status', 'crm_note', 'data_source', 'possession_time', 'description']} 
                data={importResults.successfullyParsed} 
                title="Imported Records"
                color="var(--success)"
              />
            </div>
          )}

          {importResults.skipped?.length > 0 && (
            <div>
              <VirtualizedDataTable 
                headers={['reason', 'original']} 
                data={importResults.skipped.map(s => ({ reason: s.reason, original: JSON.stringify(s.original) }))} 
                title="Skipped Records"
                color="var(--danger)"
              />
            </div>
          )}

        </section>
      )}

    </main>
  );
}
