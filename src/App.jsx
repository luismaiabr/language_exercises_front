import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import TheoryCard from './components/TheoryCard.jsx';
import MultipleChoiceCard from './components/MultipleChoiceCard.jsx';
import WrittenExerciseCard from './components/WrittenExerciseCard.jsx';
import {
  SessionExpiredScreen,
  InactiveUserScreen,
  LoadingScreen,
  EmptyLessonsScreen,
} from './components/StateScreens.jsx';

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState('loading'); // 'loading' | 'active' | 'expired' | 'inactive' | 'no_lessons' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);

  const [lessonData, setLessonData] = useState({
    courseName: 'German Theory',
    lessonNum: 1,
    studentName: null,
    theorySummary: null,
    exercises: [],
  });

  const [score, setScore] = useState(0);
  const [answeredExercises, setAnsweredExercises] = useState(new Set());

  // Parse path and params on mount
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get('token');
    const queryEmail = searchParams.get('email');

    // Pattern 1: /lesson/{token}
    const lessonMatch = path.match(/^\/lesson\/([^/]+)/);
    if (lessonMatch && lessonMatch[1]) {
      setToken(lessonMatch[1]);
      fetchLessonByToken(lessonMatch[1]);
      return;
    }

    // Pattern 2: ?token=...
    if (queryToken) {
      setToken(queryToken);
      fetchLessonByToken(queryToken);
      return;
    }

    // Pattern 3: /{email}/ or ?email=...
    const emailMatch = path.match(/^\/([^/]+@[^/]+)/);
    if (emailMatch && emailMatch[1]) {
      setEmail(emailMatch[1]);
      fetchLessonByEmail(emailMatch[1]);
      return;
    }

    if (queryEmail) {
      setEmail(queryEmail);
      fetchLessonByEmail(queryEmail);
      return;
    }

    // Default development fallback: fetch active demo or prompt
    fetchDefaultLesson();
  }, []);

  const fetchLessonByToken = async (currentToken) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/lesson/${currentToken}`);
      if (res.status === 410) {
        setAppState('expired');
        return;
      }
      if (res.status === 403) {
        setAppState('inactive');
        return;
      }
      if (!res.ok) {
        throw new Error(`Fehler beim Laden (${res.status})`);
      }

      const data = await res.json();
      if (!data.is_valid || data.status === 'expired') {
        setAppState('expired');
        return;
      }

      const exercises = data.lesson_exercises || [];
      const theory = exercises.find((e) => e.theory_summary)?.theory_summary || null;

      setLessonData({
        courseName: data.course_name || 'German Theory',
        lessonNum: data.lesson || 1,
        studentName: data.user_name || null,
        theorySummary: theory,
        exercises: exercises,
      });

      setAppState('active');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
      setAppState('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonByEmail = async (currentEmail) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/user/${encodeURIComponent(currentEmail)}/latest-lesson`);
      if (!res.ok) {
        throw new Error(`Fehler beim Abrufen (${res.status})`);
      }

      const data = await res.json();
      if (data.status === 'inactive' || data.status === 'unsubscribed') {
        setAppState('inactive');
        return;
      }
      if (data.status === 'no_lessons') {
        setAppState('no_lessons');
        return;
      }

      const exercises = data.lesson_exercises || [];
      const theory = exercises.find((e) => e.theory_summary)?.theory_summary || null;

      setLessonData({
        courseName: data.course_name || 'German Theory',
        lessonNum: data.lesson || 1,
        studentName: data.user_name || null,
        theorySummary: theory,
        exercises: exercises,
      });

      setAppState('active');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
      setAppState('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultLesson = async () => {
    // Provide a demo lesson for root view / verification
    setLessonData({
      courseName: 'German Theory (Akkusativ & Dativ)',
      lessonNum: 1,
      studentName: 'Max Mustermann',
      theorySummary:
        "In today's lesson, we examine two-way prepositions (Wechselpräpositionen): an, auf, hinter, in, neben, entlang, über, unter, vor, zwischen.\n\n• Akkusativ is used for movement towards a target (Wohin? - Direction/Change of state)\n• Dativ is used for static location or position without directional change (Wo? - Location).",
      exercises: [
        {
          id: 'demo-ex-1',
          exercise_type: 'multiple_choice',
          question: "Wählen Sie die richtige Form: 'Ich stelle das Buch auf _____ Tisch.' (der Tisch)",
          options: [
            {
              text: 'den',
              is_correct: true,
              explanation:
                "Richtig! 'Stellen' indicates an action with direction (Wohin? Akkusativ maskulin: der -> den).",
            },
            {
              text: 'dem',
              is_correct: false,
              explanation:
                "Falsch. 'Dem' ist Dativ. Dativ wird mit 'liegen' oder 'stehen' (Wo?) verwendet, aber 'stellen' verlangt Akkusativ (Wohin?).",
            },
            {
              text: 'das',
              is_correct: false,
              explanation: "Falsch. 'Tisch' ist maskulin (der Tisch), nicht neutral (das).",
            },
            {
              text: 'des',
              is_correct: false,
              explanation: "Falsch. 'Des' ist Genitiv, der hier von 'auf' nicht verlangt wird.",
            },
          ],
        },
        {
          id: 'demo-ex-2',
          exercise_type: 'multiple_choice',
          question: "Wählen Sie die richtige Form: 'Das Bild hängt _____ Wand.' (die Wand)",
          options: [
            {
              text: 'an der',
              is_correct: true,
              explanation:
                "Richtig! 'Hängen' als Zustand verlangt den Dativ (Wo?). Die Wand ist feminin -> Dativ: der Wand.",
            },
            {
              text: 'an die',
              is_correct: false,
              explanation:
                "Falsch. 'An die' ist Akkusativ (Wohin?). Das Bild hängt bereits dort (statischer Zustand -> Dativ).",
            },
            {
              text: 'in dem',
              is_correct: false,
              explanation:
                'Falsch. Ein Bild hängt an einer vertikalen Fläche (an), nicht im Inneren der Wand (in).',
            },
          ],
        },
        {
          id: 'demo-ex-3',
          exercise_type: 'written',
          question: "Übersetzen Sie ins Deutsche: 'The boy runs into the garden.' (der Junge / der Garten / laufen)",
        },
      ],
    });
    setAppState('active');
    setLoading(false);
  };

  const handleAnswerProgress = (exerciseId, answerText, isCorrect) => {
    if (!answeredExercises.has(exerciseId)) {
      setAnsweredExercises((prev) => new Set(prev).add(exerciseId));
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      // Try persisting answer to backend
      fetch(`${API_BASE}/api/answers/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise_id: exerciseId,
          token: token || null,
          answer: answerText,
        }),
      }).catch((err) => console.log('Local answer saved (offline fallback)'));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (appState === 'expired') {
    return <SessionExpiredScreen />;
  }

  if (appState === 'inactive') {
    return <InactiveUserScreen />;
  }

  if (appState === 'no_lessons') {
    return <EmptyLessonsScreen email={email} />;
  }

  return (
    <div className="app-container">
      <Header
        courseName={lessonData.courseName}
        lessonNum={lessonData.lessonNum}
        studentName={lessonData.studentName}
        score={score}
        totalQuestions={lessonData.exercises.length}
      />

      {lessonData.theorySummary && (
        <TheoryCard summary={lessonData.theorySummary} />
      )}

      <main>
        <h2 className="section-title">Heutige Übungen</h2>

        {lessonData.exercises.map((exercise, idx) => {
          if (exercise.exercise_type === 'multiple_choice') {
            return (
              <MultipleChoiceCard
                key={exercise.id || idx}
                exercise={exercise}
                index={idx}
                onAnswerSubmitted={handleAnswerProgress}
              />
            );
          } else if (exercise.exercise_type === 'written') {
            return (
              <WrittenExerciseCard
                key={exercise.id || idx}
                exercise={exercise}
                index={idx}
                token={token}
                onAnswerEvaluated={handleAnswerProgress}
              />
            );
          }
          return null;
        })}
      </main>
    </div>
  );
}
