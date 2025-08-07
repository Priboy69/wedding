import { Timeline } from './components/Timeline'
import { PhotoUploader } from './components/PhotoUploader'
import { PhotoGallery } from './components/PhotoGallery'
import { weddingTimeline } from './data/timeline'

export default function App() {
  return (
    <div className="container">
      <header className="header hero">
        <h1>Миша ❤ Оля</h1>
        <p className="date">9–10 августа 2025</p>
        <div className="divider">❤</div>
        <p className="subtitle">Приглашаем вас разделить наш особенный день</p>
        <div className="hero-actions">
          <a href="#timeline" className="btn btn-primary">Посмотреть тайминг</a>
          <a href="#photos" className="btn btn-ghost">Галерея</a>
        </div>
      </header>

      <section id="timeline">
        <h2>Тайминг</h2>
        <Timeline timeline={weddingTimeline} />
      </section>

      <section id="photos">
        <h2>Фотографии гостей</h2>
        <p className="muted">Загружайте фото с церемонии и празднования. Форматы: JPG/PNG/HEIC.</p>
        <PhotoUploader />
        <PhotoGallery />
      </section>

      <footer className="footer">
        <p className="love">С любовью, Миша и Оля</p>
      </footer>
    </div>
  )
} 