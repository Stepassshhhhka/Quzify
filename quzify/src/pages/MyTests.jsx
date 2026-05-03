import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './MyTests.css';


const MOCK_MY_TESTS = [
  { _id: '1', title: 'Основы JavaScript', description: 'Переменные, функции, циклы', difficulty: 'легкая', questions: [{},{},{}], createdAt: '2026-04-20' },
  { _id: '2', title: 'React Hooks', description: 'useState, useEffect, useContext', difficulty: 'средняя', questions: [{},{},{},{}], createdAt: '2026-04-25' },
];

export default function MyTests() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Заглушка загрузки с сервера
    setTimeout(() => {
      setTests(MOCK_MY_TESTS);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = (testId) => {
    if (!window.confirm('Удалить тест?')) return;
    setTests(tests.filter(t => t._id !== testId));
  };

  if (loading) return <div className="my-tests-page"><p style={{color:'#fff', textAlign:'center'}}>Загрузка...</p></div>;

  return (
    <div className="my-tests-page">
      <div className="my-tests-container">
        <h2>Мои тесты</h2>
        {tests.length === 0 ? (
          <p className="empty-text">Вы ещё не создали ни одного теста.</p>
        ) : (
          <div className="tests-grid">
            {tests.map(test => (
              <div key={test._id} className="test-card">
                <h3>{test.title}</h3>
                <p>{test.description}</p>
                <span className={`difficulty-badge diff-${test.difficulty}`}>
                  {test.difficulty}
                </span>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => navigate(`/edit/${test._id}`)}>
                     Редактировать
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(test._id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}