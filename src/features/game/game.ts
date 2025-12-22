import type { FaceScores } from '../faceLandmarker'
import { Player } from './player'
import { Field } from './field'

export class Game {
  private ctx: CanvasRenderingContext2D
  private player: Player
  private field: Field

  private readonly detectionThreshold = 0.5

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
    this.field = new Field(canvas)

    const initialX = 50
    this.player = new Player(initialX, this.field.getGroundY())
  }

  update(scores: FaceScores) {
    if ((scores.jawOpen ?? 0) >= this.detectionThreshold) {
      this.player.jump()
    }

    if ((scores.eyeBlinkLeft ?? 0) >= this.detectionThreshold) {
      this.player.moveLeft()
    }

    if ((scores.eyeBlinkRight ?? 0) >= this.detectionThreshold) {
      this.player.moveRight()
    }

    this.player.update(this.field.getGroundY(), this.field.getCanvasWidth())
    this.render()
  }

  private render() {
    this.field.render()
    this.player.render(this.ctx)
  }
}
