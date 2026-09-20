import { useRef, useCallback } from 'react';

/**
 * Synthesizes a short temple-bell chime with the Web Audio API so the
 * interaction doesn't depend on a bundled audio asset. Lazily creates a
 * single AudioContext on first user gesture (autoplay-safe).
 */
export default function useBellChime() {
  const ctxRef = useRef(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const ring = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const partials = [
      { freq: 880, gain: 0.16 },
      { freq: 1320, gain: 0.09 },
      { freq: 2100, gain: 0.05 }
    ];

    partials.forEach(({ freq, gain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.7);
    });
  }, [getContext]);

  return ring;
}
