import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TakeTest.css';


const MOCK_TEST = {
  _id: '1',
  title: 'Основы JavaScript',
  questions: [
    { _id: 'q1', questionText: 'Чему равен 2 + 2?', options: ['3', '4', '5'], correctAnswer: 1 },
    { _id: 'q2', questionText: 'Что такое NaN?', options: ['Not a number', 'Null', 'No'], correctAnswer: 0 },
  ],
};

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    setTimeout(() => setTest(MOCK_TEST), 200);
  }, [id]);

  const handleSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    const correct = test.questions.filter(q => answers[q._id] === q.correctAnswer).length;
    setScore(correct);
    setSubmitted(true);
  };

  if (!test) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Загрузка...</p>;
  if (submitted) {
    return (
      <div className="take-test-container">
        <h2 className="take-test-title">Тест пройден!</h2>
        <p className="take-test-score">Ваш результат: {score} из {test.questions.length}</p>
        <button onClick={() => navigate('/catalog')} className="btn-save">Вернуться в каталог</button>
      </div>
    );
  }

  return (
    <div className="take-test-container">
      <h2 className="take-test-title">{test.title}</h2>
      <div className="questions-list">
        {test.questions.map((q, idx) => (
          <div key={q._id} className="question-item">
            <p className="question-text">{idx + 1}. {q.questionText}</p>
            {q.options.map((opt, optIdx) => (
              <label key={optIdx} className="option-label">
                <input
                  type="radio"
                  name={`q-${q._id}`}
                  checked={answers[q._id] === optIdx}
                  onChange={() => handleSelect(q._id, optIdx)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < test.questions.length}
        className="btn-save"
        style={{ opacity: Object.keys(answers).length < test.questions.length ? 0.6 : 1 }}
      >
        Завершить тест
      </button>
    </div>
  );
}