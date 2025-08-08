import { Timeline } from './components/Timeline'
import { QRCodeBlock } from './components/QRCodeBlock'
import { TelegramShareButton } from './components/TelegramShareButton'
import { TelegramPostEmbed } from './components/TelegramPostEmbed'
import { weddingTimeline } from './data/timeline'

const TELEGRAM_LINK = 'https://t.me/+pH6dblq2c99hMGZi'
// Replace with a real post link like https://t.me/username/123
const TELEGRAM_POST_URL = 'https://t.me/s/test/1'

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
          <a href="#share" className="btn btn-ghost">Где делиться фото</a>
        </div>
      </header>

      <section id="timeline">
        <h2>Тайминг</h2>
        <Timeline timeline={weddingTimeline} />
      </section>

      <section id="share">
        <h2>Фото и видео гостей</h2>
        <p className="label-fancy">Поделитесь моментами ✨</p>
        <p className="muted">Пожалуйста, делитесь лучшими кадрами в нашем Telegram‑канале. Там же вы сможете посмотреть фото и видео от других гостей.</p>
        <div className="actions-row">
          <QRCodeBlock url={TELEGRAM_LINK} title="Сканируйте QR‑код" />
          <div className="callout">
            <p className="note">Или откройте ссылку:</p>
            <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="btn btn-primary">Открыть канал</a>
            <p className="note" style={{ marginTop: 12 }}>Поделиться приглашением:</p>
            <div className="tg-share"><TelegramShareButton url={TELEGRAM_LINK} text="Присоединяйтесь к нашему свадебному каналу!" /></div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <p className="note">Актуальные посты из канала:</p>
          <TelegramPostEmbed postUrl={TELEGRAM_POST_URL} />
        </div>
      </section>

      <footer className="footer">
        <p className="love">С любовью, Миша и Оля</p>
      </footer>
    </div>
  )
} 