import { useState } from 'react';
import './TestForm.css';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export default function CreateTest() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Введите название теста';
    if (!description.trim()) newErrors.description = 'Введите описание';
    if (!difficulty) newErrors.difficulty = 'Выберите сложность';
    if (questions.length === 0) newErrors.questions = 'Добавьте хотя бы один вопрос';

    const questionDetails = [];
    questions.forEach((q, idx) => {
      const qErr = {};
      if (!q.text.trim()) qErr.text = 'Введите текст вопроса';
      if (q.answers.length < 2) {
        qErr.answers = 'Минимум 2 варианта ответа';
      } else {
        if (!q.answers.some(a => a.isCorrect)) qErr.correct = 'Укажите правильный ответ';
        const emptyAnswers = q.answers
          .map((a, i) => (!a.text.trim() ? `Ответ ${i + 1} не заполнен` : null))
          .filter(Boolean);
        if (emptyAnswers.length) qErr.answerTexts = emptyAnswers;
      }
      if (Object.keys(qErr).length) questionDetails.push({ index: idx, errors: qErr });
    });

    if (questionDetails.length) newErrors.questionsDetails = questionDetails;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    setSaveSuccess(false);
    if (validate()) {
      console.log('Тест сохранён:', {
        title,
        description,
        difficulty,
        questions: questions.map(q => ({
          text: q.text,
          answers: q.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect })),
        })),
      });
      setSaveSuccess(true);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: generateId(),
        text: '',
        answers: [
          { id: generateId(), text: '', isCorrect: false },
          { id: generateId(), text: '', isCorrect: false },
        ],
      },
    ]);
    if (errors.questions) setErrors(prev => ({ ...prev, questions: '' }));
  };

  const removeQuestion = id => setQuestions(questions.filter(q => q.id !== id));

  const handleQuestionText = (id, text) =>
    setQuestions(questions.map(q => (q.id === id ? { ...q, text } : q)));

  const addAnswer = questionId =>
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? { ...q, answers: [...q.answers, { id: generateId(), text: '', isCorrect: false }] }
          : q
      )
    );

  const removeAnswer = (questionId, answerId) =>
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? { ...q, answers: q.answers.filter(a => a.id !== answerId) }
          : q
      )
    );

  const handleAnswerText = (questionId, answerId, text) =>
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? { ...q, answers: q.answers.map(a => (a.id === answerId ? { ...a, text } : a)) }
          : q
      )
    );

  const setCorrect = (questionId, answerId) =>
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? { ...q, answers: q.answers.map(a => ({ ...a, isCorrect: a.id === answerId })) }
          : q
      )
    );

  return (
    <div className="creator-container">
      <h2 className="creator-title">Создание теста</h2>

      {/* Основные поля */}
      <div className="form-fields">
        <div className="field">
          <label className="field-label">Название</label>
          <input
            type="text"
            className={`field-input ${errors.title ? 'input-error' : ''}`}
            value={title}
            onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: '' })); }}
            placeholder="Основы JavaScript"
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="field">
          <label className="field-label">Описание</label>
          <textarea
            className={`field-input ${errors.description ? 'input-error' : ''}`}
            value={description}
            onChange={e => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: '' })); }}
            placeholder="Проверка базовых знаний"
            rows="3"
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="field">
          <label className="field-label">Сложность</label>
          <select
            className={`field-input ${errors.difficulty ? 'input-error' : ''}`}
            value={difficulty}
            onChange={e => { setDifficulty(e.target.value); if (errors.difficulty) setErrors(prev => ({ ...prev, difficulty: '' })); }}
          >
            <option value="">-- Выберите --</option>
            <option value="easy">Лёгкая</option>
            <option value="medium">Средняя</option>
            <option value="hard">Сложная</option>
          </select>
          {errors.difficulty && <span className="error-text">{errors.difficulty}</span>}
        </div>
      </div>

      {/* Вопросы */}
      <div className="questions-section">
        <h3 className="section-subtitle">Вопросы</h3>
        {errors.questions && <div className="error-text block-error">{errors.questions}</div>}

        {questions.map((q, qIndex) => {
          const qDetail = errors.questionsDetails?.find(e => e.index === qIndex)?.errors;
          return (
            <div key={q.id} className="question-card">
              <div className="question-header">
                <span className="question-number">Вопрос {qIndex + 1}</span>
                <button
                  className="btn-remove-question"
                  onClick={() => removeQuestion(q.id)}
                >
                  Удалить
                </button>
              </div>
              <div className="field">
                <input
                  type="text"
                  className={`field-input ${qDetail?.text ? 'input-error' : ''}`}
                  value={q.text}
                  onChange={e => handleQuestionText(q.id, e.target.value)}
                  placeholder="Текст вопроса"
                />
                {qDetail?.text && <span className="error-text">{qDetail.text}</span>}
              </div>

              <div className="answers-block">
                {q.answers.map((a, aIndex) => (
                  <div key={a.id} className="answer-row">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={a.isCorrect}
                        onChange={() => setCorrect(q.id, a.id)}
                      />
                    </label>
                    <input
                      type="text"
                      className={`field-input answer-input ${qDetail?.answerTexts?.[aIndex] ? 'input-error' : ''}`}
                      value={a.text}
                      onChange={e => handleAnswerText(q.id, a.id, e.target.value)}
                      placeholder={`Ответ ${aIndex + 1}`}
                    />
                    <button
                      className="btn-remove-answer"
                      onClick={() => removeAnswer(q.id, a.id)}
                      disabled={q.answers.length <= 2}
                    >
                      ✕
                    </button>
                    {qDetail?.answerTexts?.[aIndex] && (
                      <span className="error-text full-width-error">{qDetail.answerTexts[aIndex]}</span>
                    )}
                  </div>
                ))}
                {qDetail?.answers && <div className="error-text">{qDetail.answers}</div>}
                {qDetail?.correct && <div className="error-text">{qDetail.correct}</div>}
                <button className="btn-add-answer" onClick={() => addAnswer(q.id)}>
                  + Добавить ответ
                </button>
              </div>
            </div>
          );
        })}

        <button className="btn-add-question" onClick={addQuestion}>
          + Добавить вопрос
        </button>
      </div>

      <div className="save-section">
        <button className="btn-save" onClick={handleSave}>
          Сохранить тест
        </button>
        {saveSuccess && <span className="success-message">Тест успешно сохранён!</span>}
      </div>
    </div>
  );
}
