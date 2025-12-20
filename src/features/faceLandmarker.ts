import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export interface FaceScores {
  faceDetected: boolean
  eyeBlinkLeft: number | undefined
  eyeBlinkRight: number | undefined
  jawOpen: number | undefined
}

export async function setupFaceLandmarker(): Promise<FaceLandmarker> {
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

export function detectFace(faceLandmarker: FaceLandmarker, video: HTMLVideoElement): FaceScores {
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
