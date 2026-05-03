import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/" className="header__logo-link">Quzify</Link>
      </div>
      <nav className="header__nav">
        {!user && (
          <>
            <Link to="/about" className="header__link">О проекте</Link>
            <Link to="/login" className="header__link header__link--login">Войти</Link>
            <Link to="/register" className="header__link header__link--register">Регистрация</Link>
          </>
        )}
        {user && (
          <>
            <Link to="/catalog" className="header__link">Каталог тестов</Link>
            <Link to="/create" className="header__link">Создать тест</Link>
            <Link to="/my-tests" className="header__link">Мои тесты</Link>
            <Link to="/results" className="header__link">Мои результаты</Link>
            <Link to="/about" className="header__link">О проекте</Link>
            <span className="header__user">{user.username}</span>
            <button onClick={handleLogout} className="header__link header__link--logout">Выйти</button>
          </>
        )}
      </nav>
    </header>
  );
}