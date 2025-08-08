from fastapi import FastAPI, UploadFile, File, Request, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, StreamingResponse
from typing import List
from pathlib import Path
import shutil
import time
import re
import mimetypes
import io
import zipfile

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Wedding Uploads API", version="1.2.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


_filename_safe_re = re.compile(r"[^A-Za-z0-9._-]+")

def _safe_filename(name: str) -> str:
    name = name.strip().replace(" ", "_")
    name = _filename_safe_re.sub("", name)
    return name or f"file_{int(time.time())}"


def _classify_kind(content_type: str | None) -> str:
    if not content_type:
        return "file"
    if content_type.startswith("image/"):
        return "image"
    if content_type.startswith("video/"):
        return "video"
    return "file"


@app.get("/healthz")
async def healthz():
    return {"ok": True}


@app.get("/photos")
async def list_photos(request: Request):
    base = str(request.base_url).rstrip("/")
    items = []
    for p in sorted(UPLOAD_DIR.glob("*")):
        if not p.is_file():
            continue
        stat = p.stat()
        guessed, _ = mimetypes.guess_type(p.name)
        kind = _classify_kind(guessed)
        items.append({
            "filename": p.name,
            "url": f"{base}/uploads/{p.name}",
            "size": stat.st_size,
            "uploaded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(stat.st_mtime)),
            "content_type": guessed or "application/octet-stream",
            "kind": kind,
        })
    return JSONResponse(items)


@app.post("/photos")
async def upload_photos(request: Request, files: List[UploadFile] = File(...)):
    base = str(request.base_url).rstrip("/")
    saved = []
    for f in files:
        safe_name = _safe_filename(f.filename or "upload")
        target = UPLOAD_DIR / safe_name
        if target.exists():
            stem = target.stem
            suffix = target.suffix
            counter = 1
            while True:
                candidate = UPLOAD_DIR / f"{stem}_{counter}{suffix}"
                if not candidate.exists():
                    target = candidate
                    break
                counter += 1
        with target.open("wb") as out:
            shutil.copyfileobj(f.file, out)
        stat = target.stat()
        content_type = f.content_type or mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        kind = _classify_kind(content_type)
        saved.append({
            "filename": target.name,
            "url": f"{base}/uploads/{target.name}",
            "size": stat.st_size,
            "uploaded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(stat.st_mtime)),
            "content_type": content_type,
            "kind": kind,
        })
    return JSONResponse(saved)


@app.get("/photos/download")
async def download_photos(files: List[str] = Query(default=[])):
    if not files:
        raise HTTPException(status_code=400, detail="Specify at least one file")

    # Validate and collect paths
    selected_paths: List[Path] = []
    for name in files:
        # ensure safe name
        safe = _safe_filename(name)
        p = (UPLOAD_DIR / safe).resolve()
        if not p.is_file() or UPLOAD_DIR not in p.parents:
            continue
        selected_paths.append(p)

    if not selected_paths:
        raise HTTPException(status_code=404, detail="No valid files found")

    # Stream ZIP
    def stream_zip():
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
            for path in selected_paths:
                zf.write(path, arcname=path.name)
        buffer.seek(0)
        yield from buffer

    headers = {"Content-Disposition": 'attachment; filename="wedding-photos.zip"'}
    return StreamingResponse(stream_zip(), media_type="application/zip", headers=headers) 