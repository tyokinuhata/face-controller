# 顔面コントローラー

- 表情筋を使って2Dゲームを操作するデモ

## 使い方

```bash
$ npm install
$ npm run dev
# その後、ブラウザでカメラアクセスを許可
$ open http://localhost:5173/face-controller/

# 一時的にインターネットからアクセス
$ brew install cloudflared
$ cloudflared tunnel --url http://localhost:5173
$ open https://xxxxxxxxxx.trycloudflare.com
```

## 技術スタック

- Vite
- TypeScript
- MediaPipe Tasks Vision(Face Landmarker)
