import React from 'react';
import { BookOpen, Sparkles, Award } from 'lucide-react';

export default function Header({ courseName, lessonNum, studentName, score, totalQuestions }) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-badge">
          <Sparkles size={13} />
          <span>German AI Platform</span>
        </div>
        {lessonNum && (
          <div className="lesson-badge">
            <Award size={13} />
            <span>Lektion {lessonNum}</span>
          </div>
        )}
      </div>

      <h1 className="app-title">{courseName || 'German Daily Theory'}</h1>
      <p className="app-subtitle">
        {studentName ? `Willkommen, ${studentName}. ` : ''}
        Interaktive Übungen mit sofortiger KI-Prüfung.
      </p>

      {totalQuestions > 0 && (
        <div className="progress-card" style={{ marginTop: '1.5rem' }}>
          <div className="progress-info">
            <span className="progress-label">Fortschritt & Score</span>
            <span className="progress-score">
              {score} / {totalQuestions} <small style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>({percentage}%)</small>
            </span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>
      )}
    </header>
  );
}
