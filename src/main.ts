import { setupFaceLandmarker, detectFace } from './features/faceLandmarker'
import { Game } from './features/game'
import { setupCamera, waitForVideoReady } from './features/camera'
import { initializeHTML, updateUI } from './features/ui'

initializeHTML()

async function main() {
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
