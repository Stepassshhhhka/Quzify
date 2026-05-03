import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyResults.css';

const MOCK_RESULTS = [
  {
    _id: '1',
    test: { _id: '1', title: 'Основы JavaScript' },
    score: 2,
    totalQuestions: 3,
    createdAt: '2026-04-20T10:30:00Z',
  },
  {
    _id: '2',
    test: { _id: '2', title: 'История России' },
    score: 4,
    totalQuestions: 5,
    createdAt: '2026-04-25T14:15:00Z',
  },
];

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setLoading(false);
    }, 400);
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Загрузка...</p>;
  if (!results.length) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Нет пройденных тестов. <Link to="/">Пройти первый</Link></p>;

  return (
    <div className="results-container">
      <h2 className="results-title">Мои результаты</h2>
      <div className="results-table-wrapper">
        <table className="results-table">
          <colgroup>
            <col style={{ width: '42%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Тест</th>
              <th>Результат</th>
              <th>Дата</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td className="cell-test">{r.test?.title || 'Удалённый тест'}</td>
                <td className="cell-score">
                  <span className={`score-badge ${r.score === r.totalQuestions ? 'perfect' : ''}`}>
                    {r.score}/{r.totalQuestions}
                  </span>
                  <span className="percent">({Math.round((r.score / r.totalQuestions) * 100)}%)</span>
                </td>
                <td className="cell-date">{new Date(r.createdAt).toLocaleDateString('ru-RU')}</td>
                <td className="cell-action">
                  <Link to={`/test/${r.test?._id}`} className="retake-link">Пройти снова</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}