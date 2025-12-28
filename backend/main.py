import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CORS設定（変更なし） ---
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- テスト用 ---
@app.get("/")
def read_root():
    return {"message": "Fumifumi Backend is active!"}

# --- ★ここが新機能: 音声ファイル受け取り＆保存 ---
@app.post("/api/upload")
async def upload_audio(file: UploadFile = File(...)):
    # 1. 保存先のフォルダを作成（なければ作る）
    os.makedirs("temp", exist_ok=True)
    
    # 2. 保存パスを決める (backend/temp/ファイル名)
    save_path = f"temp/{file.filename}"
    
    print(f"受信開始: {file.filename}")

    # 3. ファイルを保存する
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    print(f"保存完了: {save_path}")

    # 4. フロントに成功を伝える
    return {
        "status": "success",
        "filename": file.filename, 
        "message": "ファイルがサーバーに保存されました"
    }