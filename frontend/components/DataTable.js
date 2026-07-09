'use client';

import { useState, useMemo } from 'react';

export default function DataTable({ headers, data, maxHeight = '400px' }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  if (!data || data.length === 0) return null;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage]);

  return (
    <div className="glass-panel animate-fade-in" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} style={{ padding: '16px', borderBottom: '1px solid var(--card-border)', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIdx) => (
              <tr key={rowIdx} style={{ transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                {headers.map((header, colIdx) => (
                  <td key={colIdx} style={{ padding: '12px 16px', borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row[header] !== null && row[header] !== undefined ? (typeof row[header] === 'object' ? JSON.stringify(row[header]) : String(row[header])) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--background)' }}>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, data.length)} of {data.length} entries
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--card-border)', color: currentPage === 1 ? 'var(--muted)' : 'var(--foreground)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--card-border)', color: currentPage === totalPages ? 'var(--muted)' : 'var(--foreground)', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
