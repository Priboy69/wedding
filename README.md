# Свадьба Миши и Оли — лендинг

Фронтенд на React (Vite), бэкенд на FastAPI. Гости видят тайминг и могут загружать/смотреть фото.

## Запуск локально

### 1) Бэкенд (FastAPI)
```
cd server
python3 -m venv .venv
# Linux/WSL:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2) Фронтенд (Vite React)
```
cd client
# Установите Node.js 18+ и npm
npm install
npm run dev
```

Откройте `http://localhost:5173`.

Если бэкенд запущен на другом адресе — создайте файл `client/.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

## Настройки
- Тайминг редактируется в `client/src/data/timeline.ts`.
- Фотографии сохраняются на диск в `server/uploads/` и доступны по URL `/uploads/<filename>`.

## Производство
- Можно собрать фронтенд: `npm run build` (статические файлы в `client/dist`).
- Раздавать фронтенд через любой статический сервер/облако, а API держать отдельно (например, в Docker/серверлесс). 