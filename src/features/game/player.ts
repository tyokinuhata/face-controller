export class Player {
  private x: number
  private y: number
  private velocityY: number
  private isJumping: boolean

  private readonly size = 30
  private readonly gravity = 0.5
  private readonly jumpPower = -10
  private readonly moveSpeed = 5

  constructor(initialX: number, groundY: number) {
    this.x = initialX
    this.y = groundY - this.size
    this.velocityY = 0
    this.isJumping = false
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = this.jumpPower
      this.isJumping = true
    }
  }

  moveLeft() {
    this.x -= this.moveSpeed
  }

  moveRight() {
    this.x += this.moveSpeed
  }

  update(groundY: number, canvasWidth: number) {
    this.x = Math.max(0, Math.min(canvasWidth - this.size, this.x))

    this.velocityY += this.gravity
    this.y += this.velocityY

    if (this.y >= groundY - this.size) {
      this.y = groundY - this.size
      this.velocityY = 0
      this.isJumping = false
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }

  getX(): number {
    return this.x
  }

  getY(): number {
    return this.y
  }

  getSize(): number {
    return this.size
  }
}
