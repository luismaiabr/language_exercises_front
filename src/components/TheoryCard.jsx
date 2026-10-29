import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookMarked } from 'lucide-react';

export default function TheoryCard({ summary }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!summary) return null;

  return (
    <div className="theory-card">
      <div className="theory-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="theory-title-group">
          <BookMarked size={20} color="#00e5ff" />
          <h2 className="theory-title">Grammatik & Theorie-Zusammenfassung</h2>
        </div>
        <button
          type="button"
          aria-label={isOpen ? 'Theorie einklappen' : 'Theorie ausklappen'}
          style={{ background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer', display: 'flex' }}
        >
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="theory-body">
          {summary}
        </div>
      )}
    </div>
  );
}
