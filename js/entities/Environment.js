// Mô Phỏng Môi Trường Đáy Biển: Cát, Tảo Biển, Caustics & Sóng Xung Kích
export class Environment {
  constructor() {
    this.causticsTime = 0;
    this.ripples = [];
    this.kelps = Array.from({ length: 14 }, (_, i) => ({
      x: i * 110 + Math.random() * 30,
      height: 130 + Math.random() * 90,
      phase: Math.random() * Math.PI * 2
    }));
  }

  addRipple(x, y) {
    this.ripples.push({ x, y, radius: 0, alpha: 1 });
  }

  update() {
    this.causticsTime += 0.015;

    // Cập nhật sóng xung kích mặt nước
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 2.0;
      r.alpha -= 0.018;
      if (r.alpha <= 0) this.ripples.splice(i, 1);
    }
  }

  draw(ctx, width, height, isNight) {
    // 1. Vẽ Đáy Cát Đại Dương
    const sandGrad = ctx.createLinearGradient(0, height - 80, 0, height);
    if (isNight) {
      sandGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
      sandGrad.addColorStop(1, '#020617');
    } else {
      sandGrad.addColorStop(0, 'rgba(20, 83, 45, 0.35)');
      sandGrad.addColorStop(1, '#0f2d1e');
    }
    ctx.fillStyle = sandGrad;
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.quadraticCurveTo(width * 0.3, height - 60, width * 0.6, height - 30);
    ctx.quadraticCurveTo(width * 0.8, height - 70, width, height - 20);
    ctx.lineTo(width, height);
    ctx.fill();

    // 2. Vẽ Tảo Biển Đung Đưa Theo Dòng Nước
    this.kelps.forEach(k => {
      ctx.save();
      ctx.strokeStyle = isNight ? '#005f73' : '#2a9d8f';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(k.x, height);
      
      const sway = Math.sin(this.causticsTime + k.phase) * 20;
      ctx.quadraticCurveTo(k.x + sway, height - k.height * 0.5, k.x + sway * 0.5, height - k.height);
      ctx.stroke();
      ctx.restore();
    });

    // 3. Hiệu Ứng Vệt Ánh Sáng Nắng Xuyên Caustics
    if (!isNight) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let i = 0; i < 5; i++) {
        const rayX = (Math.sin(this.causticsTime * 0.4 + i) * 0.5 + 0.5) * width;
        ctx.beginPath();
        ctx.moveTo(rayX, 0);
        ctx.lineTo(rayX - 120, height);
        ctx.lineTo(rayX + 160, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // 4. Vẽ Sóng Xung Kích Tương Tác
    this.ripples.forEach(r => {
      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }
}