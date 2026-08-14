// Mô-đun Quản lý và Tổng hợp Âm thanh Thủ tục Web Audio API
export class Soundscape {
  constructor() {
    this.audioCtx = null;
    this.currentSoundNode = null;
    this.isMuted = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stopCurrentSound() {
    if (this.currentSoundNode) {
      try {
        if (this.currentSoundNode.stop) this.currentSoundNode.stop();
        if (this.currentSoundNode.disconnect) this.currentSoundNode.disconnect();
      } catch (e) {
        // Ngắt kết nối node an toàn
      }
      this.currentSoundNode = null;
    }
  }

  playMode(mode) {
    this.init();
    this.stopCurrentSound();

    if (mode === 'mute') {
      this.isMuted = true;
      return;
    }
    this.isMuted = false;

    const ctx = this.audioCtx;

    if (mode === 'deepWater') {
      // Âm thanh Bọt Nước Đại Dương Sâu (Pink Noise + Lowpass Filter + LFO)
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.05;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      this.currentSoundNode = noise;

    } else if (mode === 'oceanWaves') {
      // Âm thanh Sóng Biển Rì Rào với Mô-đun LFO Biên độ
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      lfo.start();
      this.currentSoundNode = osc;

    } else if (mode === 'zenMelody') {
      // Điệu Nhạc Zen Thư Giãn Tần Số Solfeggio
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(174, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      this.currentSoundNode = osc;
    }
  }

  // Tổng hợp hiệu ứng âm thanh Bọt nước nổ (Pop Sound) khi tương tác thả thức ăn
  playBubblePop() {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }
}