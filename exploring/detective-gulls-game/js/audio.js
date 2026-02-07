// audio.js - Sound Effects using Web Audio API
// All sounds are synthesized - no audio files needed!

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    
    // Try to initialize audio context (may be blocked by browser)
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.2; // Master volume
      this.masterGain.connect(this.audioContext.destination);
      
      console.log('AudioManager initialized');
    } catch (e) {
      console.warn('Audio context not available:', e);
    }
  }
  
  /**
   * Get audio context, resume if suspended
   */
  getAudioContext() {
    if (!this.audioContext) return null;
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }
  
  /**
   * Play poop firing sound
   */
  playPoopFire() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.15);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }
  
  /**
   * Play hit target sound (success)
   */
  playHitTarget() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, now);
    oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }
  
  /**
   * Play take damage sound
   */
  playTakeDamage() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.25);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + 0.25);
  }
  
  /**
   * Play collect pickup sound
   */
  playCollectPickup() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + 0.25);
  }
  
  /**
   * Play level up sound
   */
  playLevelUp() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const notes = [523, 659, 784]; // C, E, G (ascending chord)
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      const startTime = now + (i * 0.1);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      oscillator.connect(gain);
      gain.connect(this.masterGain);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }
  
  /**
   * Play game over sound
   */
  playGameOver() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.8);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + 0.8);
  }
  
  /**
   * Cleanup
   */
  cleanup() {
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
