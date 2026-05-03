import mainPicture from '../assets/mainPicture.jpg';
import './Home.css';

export default function Home() {
  return (
    <div  style={{ maxWidth: '700px', margin: '4rem auto', textAlign: 'center' }}>
      <img src={mainPicture} alt="Главная" className="home-image" />
      <p className="home-text">
        Проверяйте свои знания, создавайте авторские тесты, анализируйте результаты. Просто и удобно.
      </p>
      <p className="home-subtext">Удачи!</p>
    </div>
  );
}