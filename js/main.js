// Tệp Điều Khiển Trung Tâm (Main Application Controller)
import { Soundscape } from './audio/soundscape.js';
import { Creature } from './entities/Creature.js';
import { Food } from './entities/Food.js';
import { Environment } from './entities/Environment.js';

const canvas = document.getElementById('aquariumCanvas');
const ctx = canvas.getContext('2d');
const aquarium = document.getElementById('aquarium');
const bgSelect = document.getElementById('bgSelect');
const soundSelect = document.getElementById('soundSelect');
const feedBtn = document.getElementById('feedBtn');
const dayNightBtn = document.getElementById('dayNightBtn');

const soundscape = new Soundscape();
const environment = new Environment();

let isNight = false;
const foods = [];
const creatures = [];

function resizeCanvas() {
  canvas.width = aquarium.clientWidth;
  canvas.height = aquarium.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Khởi tạo Quần thể Sinh thái Biển Đa dạng
function initEcosystem() {
  creatures.length = 0;
  // Khởi tạo Quần thể Cá nhiệt đới
  for (let i = 0; i < 20; i++) {
    creatures.push(new Creature('fish', Math.random() * canvas.width, Math.random() * canvas.height));
  }
  // Bổ sung Sinh vật Đa dạng
  creatures.push(new Creature('turtle', Math.random() * canvas.width, Math.random() * canvas.height));
  creatures.push(new Creature('turtle', Math.random() * canvas.width, Math.random() * canvas.height));
  creatures.push(new Creature('ray', Math.random() * canvas.width, Math.random() * canvas.height));
  for (let i = 0; i < 6; i++) {
    creatures.push(new Creature('jellyfish', Math.random() * canvas.width, Math.random() * canvas.height));
  }
}

const BACKGROUNDS = {
  deepOcean: 'linear-gradient(to bottom, #03045e, #0077b6, #0096c7)',
  tropicalReef: 'linear-gradient(to bottom, #0077b6, #00b4d8, #03045e)',
  midnightGlow: 'linear-gradient(to bottom, #10002b, #240046, #3c096c)',
  sunlitShallow: 'linear-gradient(to bottom, #48cae4, #90e0ef, #0077b6)'
};

bgSelect.addEventListener('change', (e) => {
  aquarium.style.background = BACKGROUNDS[e.target.value];
});
aquarium.style.background = BACKGROUNDS.deepOcean;

soundSelect.addEventListener('change', (e) => {
  soundscape.playMode(e.target.value);
});

// Chuyển đổi Chế độ Đêm (Day/Night Cycle Toggle)
dayNightBtn.addEventListener('click', () => {
  isNight = !isNight;
  dayNightBtn.textContent = isNight ? '☀️ Chuyển Chế Độ Ngày' : '🌙 Chuyển Chế Độ Đêm';
  aquarium.style.filter = isNight ? 'brightness(0.65) contrast(1.15)' : 'none';
});

// Thả Thức ăn và Kích hoạt Âm thanh Sóng xung kích
function spawnFood(x, y) {
  foods.push(new Food(x, y));
  environment.addRipple(x, y);
  soundscape.playBubblePop();
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  spawnFood(e.clientX - rect.left, e.clientY - rect.top);
});

feedBtn.addEventListener('click', () => {
  spawnFood(canvas.width / 2, 40);
});

initEcosystem();

// Vòng Lặp Render Chính (Main Render Loop)
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  environment.update();
  environment.draw(ctx, canvas.width, canvas.height, isNight);

  for (let i = foods.length - 1; i >= 0; i--) {
    const f = foods[i];
    f.update(canvas.height);
    f.draw(ctx);

    creatures.forEach(c => {
      if (!f.eaten && Math.hypot(c.x - f.x, c.y - f.y) < c.size + f.radius) {
        f.eaten = true;
        foods.splice(i, 1);
      }
    });
  }

  creatures.forEach(c => {
    c.update(canvas.width, canvas.height, foods, isNight);
    c.draw(ctx, isNight);
  });

  requestAnimationFrame(animate);
}

animate();