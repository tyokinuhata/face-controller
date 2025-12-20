import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>face-controller</h1>
  <video id="webcam" autoplay playsinline style="transform: scaleX(-1);"></video>
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
    numFaces: 1
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

  if (results.faceLandmarks && results.faceLandmarks.length > 0) {
    console.log('Face detected')
  } else {
    console.log('No face detected')
  }

  requestAnimationFrame(() => detectFace(faceLandmarker, video))
}

async function main() {
  const video = await setupCamera()
  if (!video) return

  const faceLandmarker = await setupFaceLandmarker()
  await waitForVideoReady(video)

  detectFace(faceLandmarker, video)
}

main()
