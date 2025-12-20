import type { FaceScores } from './faceLandmarker'

export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private playerX: number
  private playerY: number
  private velocityY: number
  private isJumping: boolean

  private readonly groundY: number
  private readonly playerSize = 30
  private readonly gravity = 0.5
  private readonly jumpPower = -10
  private readonly moveSpeed = 5

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.groundY = canvas.height - 100
    this.playerX = 50
    this.playerY = this.groundY - this.playerSize
    this.velocityY = 0
    this.isJumping = false
  }

  update(scores: FaceScores) {
    if (scores.jawOpen !== undefined && scores.jawOpen >= 0.5 && !this.isJumping) {
      this.velocityY = this.jumpPower
      this.isJumping = true
    }

    if (scores.eyeBlinkLeft !== undefined && scores.eyeBlinkLeft >= 0.5) {
      this.playerX -= this.moveSpeed
    }

    if (scores.eyeBlinkRight !== undefined && scores.eyeBlinkRight >= 0.5) {
      this.playerX += this.moveSpeed
    }

    this.playerX = Math.max(0, Math.min(this.canvas.width - this.playerSize, this.playerX))

    this.velocityY += this.gravity
    this.playerY += this.velocityY

    if (this.playerY >= this.groundY - this.playerSize) {
      this.playerY = this.groundY - this.playerSize
      this.velocityY = 0
      this.isJumping = false
    }

    this.render()
  }

  private render() {
    this.ctx.fillStyle = '#87CEEB'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.fillStyle = '#8B4513'
    this.ctx.fillRect(0, this.groundY, this.canvas.width, 100)

    this.ctx.fillStyle = '#FF0000'
    this.ctx.fillRect(this.playerX, this.playerY, this.playerSize, this.playerSize)
  }
}
