'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileType } from 'lucide-react';
import Papa from 'papaparse';

export default function CsvUploader({ onParsed }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndParseFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndParseFile(selectedFile);
  };

  const validateAndParseFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setFile(selectedFile);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          setError('Failed to parse CSV. It might be corrupted.');
        } else {
          // Pass parsed data and headers up to the parent
          onParsed(results.data, results.meta.fields);
        }
      },
      error: (err) => {
        setError(`Error reading file: ${err.message}`);
      }
    });
  };

  return (
    <div 
      className={`glass-panel animate-fade-in ${isDragging ? 'dragging' : ''}`}
      style={{
        padding: '40px',
        textAlign: 'center',
        border: isDragging ? '2px dashed var(--primary)' : '2px dashed var(--card-border)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '16px', background: 'rgba(232, 121, 92, 0.1)', borderRadius: '50%' }}>
           <UploadCloud size={48} color="var(--primary)" />
        </div>
        
        <div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
            Drop your CSV file here
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
            or click to browse files
          </p>
          
          {file && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--success)', fontSize: '14px', background: 'var(--success-bg)', padding: '8px 16px', borderRadius: '20px' }}>
              <FileType size={16} />
              {file.name}
            </div>
          )}
          
          {error && (
            <p style={{ color: 'var(--danger)', marginTop: '12px', fontSize: '14px' }}>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
