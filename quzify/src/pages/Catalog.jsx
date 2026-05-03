import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Catalog.css';

const MOCK_TESTS = [
  {
    _id: '1', title: 'Основы JavaScript', description: 'Переменные, типы, функции',
    author: { username: 'admin' }, questions: [{},{},{}], difficulty: 'легкая'
  },
  {
    _id: '2', title: 'История России', description: 'От Рюрика до наших дней',
    author: { username: 'coolteacher' }, questions: [{},{},{},{},{}], difficulty: 'средняя'
  },
  {
    _id: '3', title: 'React для начинающих', description: 'Компоненты, хуки, роутинг',
    author: { username: 'admin' }, questions: [{},{},{},{}], difficulty: 'сложная'
  },
  {
    _id: '4', title: 'Веб-разработка', description: 'HTML, CSS, основы веба',
    author: { username: 'webguru' }, questions: [{},{},{},{},{},{}], difficulty: 'средняя'
  },
];

export default function Catalog() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('все');

  useEffect(() => {
    // Заглушка загрузки
    setTimeout(() => { setTests(MOCK_TESTS); setLoading(false); }, 500);
  }, []);

  const filteredTests = tests.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) &&
    (difficulty === 'все' || t.difficulty === difficulty)
  );

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Загрузка...</p>;

  return (
    <div className="catalog-container">
      <h2 className="catalog-title">Каталог тестов</h2>
      <div className="catalog-filters">
        <input type="text" placeholder="Поиск по названию..." value={search} onChange={e => setSearch(e.target.value)} className="field-input catalog-search-input" />
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="field-input catalog-filter-select">
          <option value="все">Все сложности</option>
          <option value="легкая">Лёгкая</option>
          <option value="средняя">Средняя</option>
          <option value="сложная">Сложная</option>
        </select>
      </div>
      {filteredTests.length === 0 ? (
        <p className="empty-message">Ничего не найдено</p>
      ) : (
        <div className="tests-grid">
          {filteredTests.map(test => (
            <div key={test._id} className="test-card">
              <h3 className="test-card-title">{test.title}</h3>
              <p className="test-card-description">{test.description}</p>
              <span className={`difficulty-badge badge-${test.difficulty}`}>{test.difficulty}</span>
              <div className="test-card-meta">Автор: {test.author?.username} · Вопросов: {test.questions?.length || 0}</div>
              <Link to={`/test/${test._id}`} className="test-card-btn">Пройти</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}