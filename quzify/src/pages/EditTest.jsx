import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './TestForm.css';   

export default function EditTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('средняя');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = {
          _id: '1',
          title: 'Основы JavaScript',
          description: 'Тест для новичков',
          difficulty: 'легкая',
          author: 'dev123',
          questions: [
            {
              _id: 'q1',
              questionText: 'Что такое JS?',
              options: ['Язык программирования', 'Еда', 'Машина'],
              correctAnswer: 0,
            },
          ],
        };

        if (user && data.author !== user.id) {
          setFormError('Вы не можете редактировать чужой тест');
          setLoading(false);
          return;
        }

        setTitle(data.title);
        setDescription(data.description);
        setDifficulty(data.difficulty);
        setQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        setFormError('Ошибка загрузки теста');
        setLoading(false);
      }
    };
    fetchTest();
  }, [id, user]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Введите название';
    if (!description.trim()) newErrors.description = 'Введите описание';
    if (!difficulty) newErrors.difficulty = 'Выберите сложность';
    if (questions.length === 0) newErrors.questions = 'Добавьте хотя бы один вопрос';

    const qDetails = [];
    questions.forEach((q, idx) => {
      const qErr = {};
      if (!q.questionText.trim()) qErr.text = 'Введите текст вопроса';
      if (q.options.length < 2) qErr.options = 'Минимум 2 варианта ответа';
      else {
        const emptyOpts = q.options
          .map((opt, i) => (!opt.trim() ? `Вариант ${i + 1} не заполнен` : null))
          .filter(Boolean);
        if (emptyOpts.length) qErr.optionTexts = emptyOpts;
      }
      if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer >= q.options.length)
        qErr.correct = 'Укажите правильный ответ';
      if (Object.keys(qErr).length) qDetails.push({ index: idx, errors: qErr });
    });

    if (qDetails.length) newErrors.questionsDetails = qDetails;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    const options = [...updated[qIndex].options];
    options[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options };
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options = [...updated[qIndex].options, ''];
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    const options = updated[qIndex].options.filter((_, i) => i !== optIndex);
    const correct = updated[qIndex].correctAnswer >= options.length ? 0 : updated[qIndex].correctAnswer;
    updated[qIndex] = { ...updated[qIndex], options, correctAnswer: correct };
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setFormError('');
    try {
      const testData = { title, description, difficulty, questions };
      console.log('Изменения сохранены:', testData);
      navigate('/my-tests');
    } catch {
      setFormError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Загрузка...</p>;
  if (formError) return <div className="creator-container"><div className="error-text">{formError}</div></div>;

  return (
    <div className="creator-container">
      <h2 className="creator-title">Редактирование теста</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <div className="field">
            <label className="field-label">Название</label>
            <input
              type="text"
              className={`field-input ${errors.title ? 'input-error' : ''}`}
              value={title}
              onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: '' })); }}
              placeholder="Название теста"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
          <div className="field">
            <label className="field-label">Описание</label>
            <textarea
              className={`field-input ${errors.description ? 'input-error' : ''}`}
              rows="3"
              value={description}
              onChange={e => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: '' })); }}
              placeholder="Описание"
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
              <option value="легкая">Лёгкая</option>
              <option value="средняя">Средняя</option>
              <option value="сложная">Сложная</option>
            </select>
            {errors.difficulty && <span className="error-text">{errors.difficulty}</span>}
          </div>
        </div>

        <div className="questions-section">
          <h3 className="section-subtitle">Вопросы</h3>
          {errors.questions && <div className="error-text block-error">{errors.questions}</div>}
          {questions.map((q, qIndex) => {
            const qDetail = errors.questionsDetails?.find(e => e.index === qIndex)?.errors;
            return (
              <div key={q._id || qIndex} className="question-card">
                <div className="question-header">
                  <span className="question-number">Вопрос {qIndex + 1}</span>
                  {questions.length > 1 && (
                    <button type="button" className="btn-remove-question" onClick={() => removeQuestion(qIndex)}>
                      Удалить
                    </button>
                  )}
                </div>
                <div className="field">
                  <input
                    type="text"
                    className={`field-input ${qDetail?.text ? 'input-error' : ''}`}
                    value={q.questionText}
                    onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                    placeholder="Текст вопроса"
                  />
                  {qDetail?.text && <span className="error-text">{qDetail.text}</span>}
                </div>

                <div className="answers-block">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="answer-row">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`correct-${q._id || qIndex}`}
                          checked={q.correctAnswer === optIndex}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswer', optIndex)}
                        />
                      </label>
                      <input
                        type="text"
                        className={`field-input answer-input ${qDetail?.optionTexts?.[optIndex] ? 'input-error' : ''}`}
                        value={opt}
                        onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)}
                        placeholder={`Вариант ${optIndex + 1}`}
                      />
                      {q.options.length > 2 && (
                        <button type="button" className="btn-remove-answer" onClick={() => removeOption(qIndex, optIndex)}>
                          ✕
                        </button>
                      )}
                      {qDetail?.optionTexts?.[optIndex] && (
                        <span className="error-text full-width-error">{qDetail.optionTexts[optIndex]}</span>
                      )}
                    </div>
                  ))}
                  {qDetail?.options && <div className="error-text">{qDetail.options}</div>}
                  {qDetail?.correct && <div className="error-text">{qDetail.correct}</div>}
                  <button type="button" className="btn-add-answer" onClick={() => addOption(qIndex)}>
                    + Добавить вариант
                  </button>
                </div>
              </div>
            );
          })}
          <button type="button" className="btn-add-question" onClick={addQuestion}>
            + Добавить вопрос
          </button>
        </div>

        {formError && <div className="error-text block-error">{formError}</div>}
        <div className="save-section">
          <button type="submit" disabled={saving} className="btn-save">
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
}
