import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WrittenExerciseCard({ exercise, index, token, onAnswerEvaluated }) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/exercises/evaluate-written', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token || null,
          exercise_id: exercise.id || null,
          question_prompt: exercise.question,
          user_answer: answer.trim(),
        }),
      });

      if (!response.ok) {
        if (response.status === 410) {
          throw new Error('Sitzung abgelaufen: Der Magic-Link ist nicht mehr gültig.');
        }
        throw new Error(`Auswertungsfehler (${response.status})`);
      }

      const data = await response.json();
      setEvaluation(data);

      if (onAnswerEvaluated) {
        onAnswerEvaluated(exercise.id, answer.trim(), data.is_correct);
      }
    } catch (err) {
      setError(err.message || 'Verbindung zum KI-Dienst fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exercise-card">
      <div className="exercise-meta">
        <span className="exercise-type-tag">Freie Texteingabe #{index + 1}</span>
      </div>

      <p className="exercise-question">{exercise.question}</p>

      <form onSubmit={handleSubmit} className="written-form">
        <textarea
          className="written-textarea"
          placeholder="Schreiben Sie Ihre Antwort auf Deutsch..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={loading || (evaluation && evaluation.is_correct)}
          rows={3}
        />

        <div className="written-actions">
          <button
            type="submit"
            className="btn-cyan"
            disabled={!answer.trim() || loading || (evaluation && evaluation.is_correct)}
          >
            {loading ? (
              <>
                <div className="loading-arch-container">
                  <div className="rotating-arch" />
                </div>
                <span>KI bewertet...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Antwort prüfen</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div style={{ marginTop: '1rem', color: '#e09898', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* AI Dynamic Evaluation Feedback Box */}
      {evaluation && (
        <div
          className={`evaluation-feedback-box ${
            evaluation.is_correct ? 'correct' : 'incorrect'
          }`}
        >
          <div
            className={`feedback-header ${
              evaluation.is_correct ? 'correct' : 'incorrect'
            }`}
          >
            {evaluation.is_correct ? (
              <>
                <CheckCircle2 size={18} />
                <span>Correct! Excellent formulation</span>
              </>
            ) : (
              <>
                <AlertCircle size={18} />
                <span>Correction needed</span>
              </>
            )}
          </div>
          <p className="feedback-body">{evaluation.explanation}</p>
        </div>
      )}
    </div>
  );
}
