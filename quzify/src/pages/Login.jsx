import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      login('mock-token', { id: 'dev123', username: 'DevUser' });
      navigate('/');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Вход</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="field-input" />
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} required className="field-input" />
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading} className="btn-save">{loading ? 'Вход...' : 'Войти'}</button>
      </form>
      <p className="auth-link">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
    </div>
  );
}