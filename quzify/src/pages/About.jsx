import './About.css';

export default function About() {
  return (
    <div style={{ maxWidth: '700px', margin: '4rem auto', textAlign: 'center' }}>
      <h2 className="about-title">О проекте</h2>
      <p>
        Веб-приложение для управления тестами: создание, редактирование, прохождение и статистика.
        Фронтенд на React, бэкенд на Node.js.
      </p>

      <div >
        <h3>Контакты</h3>
        <p><strong>GitHub:</strong> <a href="https://github.com/Stepassshhhhka" target="_blank" rel="noopener noreferrer">https://github.com/Stepassshhhhka</a></p>
      </div>
    </div>
  );
}
