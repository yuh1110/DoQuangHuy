// Cấu trúc Vật lý Thức ăn Thả vào Bể cá
export class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 4.5;
    this.vy = 0.5 + Math.random() * 0.3; // Tốc độ rơi chậm tự nhiên
    this.vx = (Math.random() - 0.5) * 0.2; // Trôi dạt nhẹ theo dòng nước
    this.eaten = false;
  }

  update(canvasHeight) {
    if (this.y < canvasHeight - 20) {
      this.y += this.vy;
      this.x += this.vx;
    }
  }

  draw(ctx) {
    if (this.eaten) return;
    ctx.save();
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}