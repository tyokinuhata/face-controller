import type { FaceScores } from './faceLandmarker'

export function initializeHTML() {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <h1>顔面コントローラー 🤪</h1>
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
}

export function updateUI(scores: FaceScores) {
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
