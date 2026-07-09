'use client';

import React, { useState } from 'react';

/**
 * VirtualizedDataTable Component
 * @param {Object} props
 * @param {string[]} props.headers - Array of header strings
 * @param {Array<Object<string, any>>} props.data - Array of row objects
 * @param {string} props.title - Table title
 * @param {string} [props.color] - Optional title color
 */
export default function VirtualizedDataTable({ headers, data, title, color }) {
  if (!data || data.length === 0) return null;

  const headerHeight = 50;
  const rowHeight = 60;
  const containerHeight = 400;
  const tableHeight = Math.min(data.length * rowHeight + headerHeight, containerHeight);
  
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const endIndex = Math.min(data.length - 1, Math.floor((scrollTop + containerHeight) / rowHeight) + 2);

  const visibleRows = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleRows.push(
      <div 
        key={i}
        style={{
          position: 'absolute',
          top: `${i * rowHeight}px`,
          left: 0,
          right: 0,
          height: `${rowHeight}px`,
          display: 'flex',
          borderBottom: '1px solid var(--card-border)',
          alignItems: 'center',
          backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--row-alt)',
        }}
        className="virtualized-row"
      >
        {headers.map((header, j) => (
          <div 
            key={j} 
            style={{ 
              flex: 1, 
              padding: '0 16px', 
              minWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={data[i][header] || ''}
          >
            {data[i][header] || '-'}
          </div>
        ))}
      </div>
    );
  }

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', overflow: 'hidden' }}>
      <div style={{ 
        padding: '20px 24px', 
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, color: color || 'inherit' }}>{title} ({data.length} rows)</h3>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: `${headers.length * 150}px` }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            height: `${headerHeight}px`, 
            alignItems: 'center',
            borderBottom: '2px solid var(--card-border)',
            backgroundColor: 'var(--header-bg)',
            fontWeight: 600,
            color: 'var(--muted)'
          }}>
            {headers.map((header, i) => (
              <div key={i} style={{ flex: 1, padding: '0 16px', minWidth: '150px' }}>
                {header}
              </div>
            ))}
          </div>
          
          {/* Virtualized Body */}
          <div 
            style={{ height: `${tableHeight - headerHeight}px`, overflowY: 'auto', position: 'relative' }}
            onScroll={handleScroll}
          >
            <div style={{ height: `${data.length * rowHeight}px`, position: 'relative' }}>
              {visibleRows}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
