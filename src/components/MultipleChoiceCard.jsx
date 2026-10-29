import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export default function MultipleChoiceCard({ exercise, index, onAnswerSubmitted }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleSelect = (idx) => {
    if (selectedIdx !== null) return; // Prevent changing after revelation
    setSelectedIdx(idx);
    const chosen = exercise.options[idx];
    if (onAnswerSubmitted) {
      onAnswerSubmitted(exercise.id, chosen.text, chosen.is_correct);
    }
  };

  const isAnswered = selectedIdx !== null;
  const selectedOption = isAnswered ? exercise.options[selectedIdx] : null;

  return (
    <div className="exercise-card">
      <div className="exercise-meta">
        <span className="exercise-type-tag">Multiple Choice #{index + 1}</span>
      </div>

      <p className="exercise-question">{exercise.question}</p>

      <div className="options-grid">
        {exercise.options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = opt.is_correct;
          const showAsCorrect = isAnswered && isCorrect;
          const showAsWrong = isAnswered && isSelected && !isCorrect;

          let btnClass = 'option-btn';
          if (isSelected) {
            btnClass += isCorrect ? ' selected-correct' : ' selected-wrong';
          } else if (isAnswered && isCorrect && selectedOption && !selectedOption.is_correct) {
            btnClass += ' highlighted-correct';
          }

          return (
            <button
              key={idx}
              type="button"
              className={btnClass}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
            >
              <div className="option-text-wrapper">
                <div className="option-label">
                  <span>{opt.text}</span>
                </div>

                {/* Instant explanation reveals when selected OR when highlighting correct answer after error */}
                {isAnswered && (isSelected || (showAsCorrect && selectedOption && !selectedOption.is_correct)) && (
                  <div
                    className={`option-explanation ${
                      isCorrect ? 'explanation-correct' : 'explanation-wrong'
                    }`}
                  >
                    {opt.explanation}
                  </div>
                )}
              </div>

              {/* Status icon */}
              {isAnswered && (
                <div style={{ marginLeft: '1rem', marginTop: '2px' }}>
                  {showAsCorrect && <CheckCircle2 size={18} color="#00e5ff" />}
                  {showAsWrong && <XCircle size={18} color="#e09898" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
