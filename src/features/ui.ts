import type { FaceScores } from './faceLandmarker'

export function initializeInfoUI() {
  const infoEl = document.querySelector<HTMLDivElement>('#detect-info')!
  infoEl.innerHTML = `
    <div>Face detected: <span id="faceDetected">-</span></div>
    <div>Eye blink left: <span id="eyeBlinkLeft">-</span></div>
    <div>Eye blink right: <span id="eyeBlinkRight">-</span></div>
    <div>Jaw open: <span id="jawOpen">-</span></div>
  `
}

function updateScoreDisplay(element: HTMLSpanElement, score: number | undefined) {
  if (score !== undefined) {
    element.textContent = `${score >= 0.5 ? 'YES' : 'NO'} (${score.toFixed(3)})`
  } else {
    element.textContent = '-'
  }
}

export function updateUI(scores: FaceScores) {
  const faceDetectedEl = document.querySelector<HTMLSpanElement>('#faceDetected')!
  const eyeBlinkLeftEl = document.querySelector<HTMLSpanElement>('#eyeBlinkLeft')!
  const eyeBlinkRightEl = document.querySelector<HTMLSpanElement>('#eyeBlinkRight')!
  const jawOpenEl = document.querySelector<HTMLSpanElement>('#jawOpen')!

  const { faceDetected, eyeBlinkLeft, eyeBlinkRight, jawOpen } = scores

  faceDetectedEl.textContent = faceDetected ? 'YES' : 'NO'

  updateScoreDisplay(eyeBlinkLeftEl, eyeBlinkLeft)
  updateScoreDisplay(eyeBlinkRightEl, eyeBlinkRight)
  updateScoreDisplay(jawOpenEl, jawOpen)
}
