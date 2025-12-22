export class Field {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private readonly groundY: number
  private readonly groundHeight = 100

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.groundY = canvas.height - this.groundHeight
  }

  render() {
    this.renderBackground()
    this.renderGround()
  }

  private renderBackground() {
    this.ctx.fillStyle = '#87CEEB'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private renderGround() {
    this.ctx.fillStyle = '#8B4513'
    this.ctx.fillRect(0, this.groundY, this.canvas.width, this.groundHeight)
  }

  getGroundY(): number {
    return this.groundY
  }

  getCanvasWidth(): number {
    return this.canvas.width
  }
}
