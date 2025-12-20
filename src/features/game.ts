import type { FaceScores } from './faceLandmarker'

export interface GameState {
  playerX: number
  playerY: number
  velocityY: number
  isJumping: boolean
}

export function gameLoop(canvas: HTMLCanvasElement, scores: FaceScores, state: GameState) {
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
