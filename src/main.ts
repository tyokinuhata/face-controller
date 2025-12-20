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

function detectFace(faceLandmarker: FaceLandmarker, video: HTMLVideoElement) {
  const results = faceLandmarker.detectForVideo(video, performance.now())

  const faceDetectedEl = document.querySelector<HTMLSpanElement>('#faceDetected')!
  const eyeBlinkLeftEl = document.querySelector<HTMLSpanElement>('#eyeBlinkLeft')!
  const eyeBlinkRightEl = document.querySelector<HTMLSpanElement>('#eyeBlinkRight')!
  const jawOpenEl = document.querySelector<HTMLSpanElement>('#jawOpen')!

  if (results.faceLandmarks && results.faceLandmarks.length > 0) {
    faceDetectedEl.textContent = 'Yes'

    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories
      const eyeBlinkLeft = blendshapes.find(b => b.categoryName === 'eyeBlinkLeft')
      const eyeBlinkRight = blendshapes.find(b => b.categoryName === 'eyeBlinkRight')
      const jawOpen = blendshapes.find(b => b.categoryName === 'jawOpen')

      const leftScore = eyeBlinkLeft?.score
      const rightScore = eyeBlinkRight?.score
      const jawScore = jawOpen?.score

      if (leftScore !== undefined) {
        eyeBlinkLeftEl.textContent = `${leftScore >= 0.5 ? 'YES' : 'NO'} (${leftScore.toFixed(3)})`
      } else {
        eyeBlinkLeftEl.textContent = '-'
      }

      if (rightScore !== undefined) {
        eyeBlinkRightEl.textContent = `${rightScore >= 0.5 ? 'YES' : 'NO'} (${rightScore.toFixed(3)})`
      } else {
        eyeBlinkRightEl.textContent = '-'
      }

      if (jawScore !== undefined) {
        jawOpenEl.textContent = `${jawScore >= 0.5 ? 'YES' : 'NO'} (${jawScore.toFixed(3)})`
      } else {
        jawOpenEl.textContent = '-'
      }
    }
  } else {
    faceDetectedEl.textContent = 'No'
    eyeBlinkLeftEl.textContent = '-'
    eyeBlinkRightEl.textContent = '-'
    jawOpenEl.textContent = '-'
  }

  requestAnimationFrame(() => detectFace(faceLandmarker, video))
}

function gameLoop(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#8B4513'
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100)

  requestAnimationFrame(() => gameLoop(canvas))
}

async function main() {
  const video = await setupCamera()
  if (!video) return

  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!

  const faceLandmarker = await setupFaceLandmarker()
  await waitForVideoReady(video)

  detectFace(faceLandmarker, video)
  gameLoop(canvas)
}

main()
