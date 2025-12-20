import { setupFaceLandmarker, detectFace } from './features/faceLandmarker'
import { gameLoop, type GameState } from './features/game'
import { setupCamera, waitForVideoReady } from './features/camera'
import { initializeHTML, updateUI } from './features/ui'

initializeHTML()

async function main() {
  const video = await setupCamera()
  if (!video) return

  const faceLandmarker = await setupFaceLandmarker()
  await waitForVideoReady(video)

  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
  const state: GameState = {
    playerX: 50,
    playerY: canvas.height - 130,
    velocityY: 0,
    isJumping: false
  }

  function loop() {
    const scores = detectFace(faceLandmarker, video!)
    updateUI(scores)
    gameLoop(canvas, scores, state)
    requestAnimationFrame(loop)
  }

  loop()
}

main()
