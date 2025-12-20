import { setupFaceLandmarker, detectFace } from './features/faceLandmarker'
import { Game } from './features/game'
import { setupCamera, waitForVideoReady } from './features/camera'
import { initializeInfoUI, updateUI } from './features/ui'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>顔面コントローラー 🤪</h1>
  <div style="display: flex; gap: 10px;">
    <video id="webcam" autoplay playsinline style="transform: scaleX(-1);"></video>
    <canvas id="canvas" width="640" height="480"></canvas>
  </div>
  <div id="detect-info"></div>
`

async function main() {
  initializeInfoUI()

  const video = await setupCamera()
  if (!video) return

  const faceLandmarker = await setupFaceLandmarker()
  await waitForVideoReady(video)

  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
  const game = new Game(canvas)

  function loop() {
    const scores = detectFace(faceLandmarker, video!)
    updateUI(scores)
    game.update(scores)
    requestAnimationFrame(loop)
  }

  loop()
}

main()
