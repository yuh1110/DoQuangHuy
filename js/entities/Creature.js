// Mô-đun Quản lý Sinh vật Biển Đa dạng (Cá, Rùa biển, Cá đuối Manta, Sứa dạ quang)
export class Creature {
  constructor(type, x, y) {
    this.type = type; // 'fish', 'turtle', 'ray', 'jellyfish'
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.targetAngle = this.angle;
    this.tailAngle = 0;

    // Tinh chỉnh tốc độ bơi chậm thư thái
    switch(type) {
      case 'turtle':
        this.size = 32;
        this.speed = 0.45;
        break;
      case 'ray':
        this.size = 38;
        this.speed = 0.55;
        break;
      case 'jellyfish':
        this.size = 20;
        this.speed = 0.3;
        this.pulse = 0;
        break;
      case 'fish':
      default:
        this.size = 12 + Math.random() * 10;
        this.speed = 0.6 + Math.random() * 0.4;
        this.color = ['#ff6b35', '#00b4d8', '#f15bb5', '#fb5607', '#70e000'][Math.floor(Math.random() * 5)];
        break;
    }

    this.changeDirTimer = Math.random() * 200;
  }

  update(canvasWidth, canvasHeight, foods, isNight) {
    // Đổi hướng bơi ngẫu nhiên dịu nhẹ
    this.changeDirTimer--;
    if (this.changeDirTimer <= 0) {
      this.targetAngle += (Math.random() - 0.5) * 1.0;
      this.changeDirTimer = 180 + Math.random() * 250;
    }

    // Định hướng tìm thức ăn
    if (foods.length > 0 && this.type !== 'jellyfish') {
      let closest = null;
      let minDist = 300;
      foods.forEach(f => {
        const d = Math.hypot(f.x - this.x, f.y - this.y);
        if (d < minDist) {
          minDist = d;
          closest = f;
        }
      });
      if (closest) {
        this.targetAngle = Math.atan2(closest.y - this.y, closest.x - this.x);
      }
    }

    // Mượt hóa góc quay (Lerp Angle)
    let diff = this.targetAngle - this.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    this.angle += diff * 0.025;

    // Giới hạn biên bể cá mềm mại
    const margin = 60;
    if (this.x < margin) this.targetAngle = 0;
    if (this.x > canvasWidth - margin) this.targetAngle = Math.PI;
    if (this.y < margin) this.targetAngle = Math.PI / 2;
    if (this.y > canvasHeight - margin) this.targetAngle = -Math.PI / 2;

    // Cập nhật vị trí
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;

    // Nhịp sinh học cơ thể
    this.tailAngle += 0.06;
    if (this.type === 'jellyfish') {
      this.pulse += 0.04;
    }
  }

  draw(ctx, isNight) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const facingLeft = Math.cos(this.angle) < 0;
    ctx.rotate(this.angle);
    if (facingLeft && this.type !== 'jellyfish') {
      ctx.scale(1, -1);
    }

    const s = this.size;

    if (this.type === 'fish') {
      // Vẽ Cá Nhiệt Đới
      const wiggle = Math.sin(this.tailAngle) * 0.2;
      
      // Đuôi
      ctx.save();
      ctx.translate(-s, 0);
      ctx.rotate(wiggle);
      ctx.fillStyle = '#ff4500';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-s * 0.8, -s * 0.5);
      ctx.lineTo(-s * 0.8, s * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Thân
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mắt
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s * 0.5, -s * 0.15, s * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(s * 0.55, -s * 0.15, s * 0.08, 0, Math.PI * 2);
      ctx.fill();

    } else if (this.type === 'turtle') {
      // Vẽ Rùa Biển (Chelonia mydas)
      const flipperMove = Math.sin(this.tailAngle) * 0.25;

      ctx.fillStyle = '#2a9d8f';
      ctx.save();
      ctx.rotate(flipperMove);
      ctx.beginPath();
      ctx.ellipse(s * 0.2, -s * 0.7, s * 0.6, s * 0.25, Math.PI / 3, 0, Math.PI * 2);
      ctx.ellipse(s * 0.2, s * 0.7, s * 0.6, s * 0.25, -Math.PI / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Mai rùa
      ctx.fillStyle = '#e76f51';
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.8, s * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#264653';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Đầu rùa
      ctx.fillStyle = '#2a9d8f';
      ctx.beginPath();
      ctx.arc(s * 0.9, 0, s * 0.25, 0, Math.PI * 2);
      ctx.fill();

    } else if (this.type === 'ray') {
      // Vẽ Cá Đuối Manta
      const wingWave = Math.sin(this.tailAngle) * 0.18;
      ctx.fillStyle = '#3d5a80';
      
      ctx.beginPath();
      ctx.moveTo(s * 0.8, 0);
      ctx.quadraticCurveTo(0, -s * (1.2 + wingWave), -s * 0.6, 0);
      ctx.quadraticCurveTo(0, s * (1.2 + wingWave), s * 0.8, 0);
      ctx.fill();

      // Đuôi dài
      ctx.strokeStyle = '#293241';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-s * 0.6, 0);
      ctx.lineTo(-s * 1.8, 0);
      ctx.stroke();

    } else if (this.type === 'jellyfish') {
      // Vẽ Sửa Dạ Quang Ban Đêm
      const p = Math.sin(this.pulse) * 0.12;
      
      if (isNight) {
        ctx.shadowColor = '#00f5d4';
        ctx.shadowBlur = 16;
      }

      ctx.fillStyle = isNight ? 'rgba(0, 245, 212, 0.75)' : 'rgba(241, 91, 181, 0.55)';
      
      // Dù sứa
      ctx.beginPath();
      ctx.arc(0, 0, s * (1 + p), Math.PI, 0);
      ctx.fill();

      // Tua sứa
      ctx.strokeStyle = isNight ? 'rgba(0, 245, 212, 0.5)' : 'rgba(241, 91, 181, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 4, 0);
        ctx.quadraticCurveTo(i * 6 + Math.sin(this.tailAngle + i) * 8, s * 1.2, i * 4, s * 1.8);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}