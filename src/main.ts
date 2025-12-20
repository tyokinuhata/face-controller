import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>face-controller</h1>
  <div style="display: flex; gap: 10px;">
    <video id="webcam" autoplay playsinline style="transform: scaleX(-1);"></video>
    <canvas id="canvas" width="640" height="480"></canvas>
  </div>
  <div id="info">
    <div>Face detected: <span id="faceDetected">-</span></div>
    <div>Eye blink left: <span id="eyeBlinkLeft">-</span></div>
    <div>Eye blink right: <span id="eyeBlinkRight">-</span></div>
    <div>Jaw open: <span id="jawOpen">-</span></div>
  </div>
`

async function setupCamera(): Promise<HTMLVideoElement | undefined> {
  const video = document.querySelector<HTMLVideoElement>('#webcam')!

  let stream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    })
  } catch (error) {
    console.error('Error accessing camera:', error)
    return
  }

  video.srcObject = stream
  return video
}

async function setupFaceLandmarker(): Promise<FaceLandmarker> {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  )

  return await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task',
      delegate: 'GPU'
    },
    runningMode: 'VIDEO',
    numFaces: 1,
    outputFaceBlendshapes: true
  })
}

async function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return

  return new Promise((resolve) => {
    video.addEventListener('loadeddata', () => resolve(), { once: true })
  })
}

interface FaceScores {
  faceDetected: boolean
  eyeBlinkLeft: number | undefined
  eyeBlinkRight: number | undefined
  jawOpen: number | undefined
}

function detectFace(faceLandmarker: FaceLandmarker, video: HTMLVideoElement): FaceScores {
  const results = faceLandmarker.detectForVideo(video, performance.now())

  let leftScore: number | undefined
  let rightScore: number | undefined
  let jawScore: number | undefined
  let faceDetected = false

  if (results.faceLandmarks && results.faceLandmarks.length > 0) {
    faceDetected = true
    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories
      const eyeBlinkLeft = blendshapes.find(b => b.categoryName === 'eyeBlinkLeft')
      const eyeBlinkRight = blendshapes.find(b => b.categoryName === 'eyeBlinkRight')
      const jawOpen = blendshapes.find(b => b.categoryName === 'jawOpen')

      leftScore = eyeBlinkLeft?.score
      rightScore = eyeBlinkRight?.score
      jawScore = jawOpen?.score
    }
  }

  return { faceDetected, eyeBlinkLeft: leftScore, eyeBlinkRight: rightScore, jawOpen: jawScore }
}

function updateUI(scores: FaceScores) {
  const faceDetectedEl = document.querySelector<HTMLSpanElement>('#faceDetected')!
  const eyeBlinkLeftEl = document.querySelector<HTMLSpanElement>('#eyeBlinkLeft')!
  const eyeBlinkRightEl = document.querySelector<HTMLSpanElement>('#eyeBlinkRight')!
  const jawOpenEl = document.querySelector<HTMLSpanElement>('#jawOpen')!

  const { faceDetected, eyeBlinkLeft, eyeBlinkRight, jawOpen } = scores

  faceDetectedEl.textContent = faceDetected ? 'YES' : 'NO'

  if (eyeBlinkLeft !== undefined) {
    eyeBlinkLeftEl.textContent = `${eyeBlinkLeft >= 0.5 ? 'YES' : 'NO'} (${eyeBlinkLeft.toFixed(3)})`
  } else {
    eyeBlinkLeftEl.textContent = '-'
  }

  if (eyeBlinkRight !== undefined) {
    eyeBlinkRightEl.textContent = `${eyeBlinkRight >= 0.5 ? 'YES' : 'NO'} (${eyeBlinkRight.toFixed(3)})`
  } else {
    eyeBlinkRightEl.textContent = '-'
  }

  if (jawOpen !== undefined) {
    jawOpenEl.textContent = `${jawOpen >= 0.5 ? 'YES' : 'NO'} (${jawOpen.toFixed(3)})`
  } else {
    jawOpenEl.textContent = '-'
  }
}

interface GameState {
  playerX: number
  playerY: number
  velocityY: number
  isJumping: boolean
}

function gameLoop(canvas: HTMLCanvasElement, scores: FaceScores, state: GameState) {
  const ctx = canvas.getContext('2d')!
  const groundY = canvas.height - 100
  const playerSize = 30
  const gravity = 0.5
  const jumpPower = -10
  const moveSpeed = 5

  if (scores.jawOpen !== undefined && scores.jawOpen >= 0.5 && !state.isJumping) {
    state.velocityY = jumpPower
    state.isJumping = true
  }

  if (scores.eyeBlinkLeft !== undefined && scores.eyeBlinkLeft >= 0.5) {
    state.playerX -= moveSpeed
  }

  if (scores.eyeBlinkRight !== undefined && scores.eyeBlinkRight >= 0.5) {
    state.playerX += moveSpeed
  }

  state.playerX = Math.max(0, Math.min(canvas.width - playerSize, state.playerX))

  state.velocityY += gravity
  state.playerY += state.velocityY

  if (state.playerY >= groundY - playerSize) {
    state.playerY = groundY - playerSize
    state.velocityY = 0
    state.isJumping = false
  }

  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#8B4513'
  ctx.fillRect(0, groundY, canvas.width, 100)

  ctx.fillStyle = '#FF0000'
  ctx.fillRect(state.playerX, state.playerY, playerSize, playerSize)
}

async function main() {
  const video = await setupCamera()
  if (!video) return

  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!

  const faceLandmarker = await setupFaceLandmarker()
  await waitForVideoReady(video)

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
