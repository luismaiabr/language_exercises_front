import React from 'react';
import { Clock, UserX, AlertTriangle, Sparkles } from 'lucide-react';

export function SessionExpiredScreen({ message }) {
  return (
    <div className="state-screen">
      <div className="state-icon-wrapper">
        <Clock size={36} />
      </div>
      <div className="brand-badge" style={{ marginBottom: '1rem' }}>
        Status 410
      </div>
      <h2 className="state-title">Sitzung abgelaufen</h2>
      <p className="state-message">
        {message ||
          'Dieser Magic-Link hat sein Gültigkeitsfenster überschritten. Um Ihre Antworten zu schützen und den Lernfortschritt aktuell zu halten, ist der Zugriff auf diese Lektion geschlossen.'}
      </p>
    </div>
  );
}

export function InactiveUserScreen({ message, status }) {
  return (
    <div className="state-screen">
      <div className="state-icon-wrapper">
        <UserX size={36} />
      </div>
      <h2 className="state-title">Konto nicht aktiv</h2>
      <p className="state-message">
        {message ||
          'Ihr Konto ist noch nicht für den täglichen Lektionsempfang aktiviert oder das Abonnement pausiert. Bitte wenden Sie sich an die Kursadministration.'}
      </p>
    </div>
  );
}

export function LoadingScreen({ message }) {
  return (
    <div className="state-screen">
      <div className="loading-arch-container" style={{ marginBottom: '1.5rem' }}>
        <div className="rotating-arch" style={{ width: '40px', height: '40px', borderWidth: '3.5px' }} />
      </div>
      <h3 className="state-title" style={{ fontSize: '1.25rem' }}>
        Lade Lektion...
      </h3>
      <p className="state-message" style={{ fontSize: '0.9rem' }}>
        {message || 'Lektionsdaten und Übungen werden geladen.'}
      </p>
    </div>
  );
}

export function EmptyLessonsScreen({ email }) {
  return (
    <div className="state-screen">
      <div className="state-icon-wrapper">
        <Sparkles size={36} />
      </div>
      <h2 className="state-title">Noch keine Lektionen</h2>
      <p className="state-message">
        Für {email ? `"${email}"` : 'diesen Teilnehmer'} wurden bisher noch keine Übungen generiert. Sobald die nächste Theorie-E-Mail eintrifft, stehen die Übungen hier bereit.
      </p>
    </div>
  );
}
