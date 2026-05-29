import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function HomeFeaturePanel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let rafId = 0;
    let t = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) {
        return;
      }
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const lineY = (x, phase) => {
      const mid = height * 0.55;
      const drift = -(x / width) * height * 0.22; // gentle upward trend
      return (
        mid +
        drift +
        Math.sin(x * 0.018 + phase) * (height * 0.12) +
        Math.sin(x * 0.043 - phase * 1.4) * (height * 0.06)
      );
    };

    const drawSeries = (phase, color, fill) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const y = lineY(x, phase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      if (fill) {
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'rgba(144, 155, 66, 0.28)');
        grad.addColorStop(1, 'rgba(144, 155, 66, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(180, 200, 120, 0.7)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        const leadY = lineY(width, phase);
        ctx.beginPath();
        ctx.arc(width - 2, leadY, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#dfe9b0';
        ctx.shadowColor = 'rgba(196, 210, 138, 0.9)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = Math.max(28, height / 4);
      for (let y = step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawSeries(t, null, true);
      drawSeries(t * 0.7 + 1.6, 'rgba(120, 167, 160, 0.45)', false);
      drawSeries(t, 'rgba(190, 208, 128, 0.95)', false);
    };

    const loop = () => {
      draw();
      t += 0.022;
      rafId = requestAnimationFrame(loop);
    };

    resize();

    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
        resize();
        if (reduceMotion) draw();
      }) : null;
    observer?.observe(canvas);
    window.addEventListener('resize', resize);

    if (reduceMotion) {
      draw();
    } else {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <motion.div
      className="home-feature"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
    >
      <span className="home-feature-eyebrow">ACTIVE MANAGEMENT</span>
      <h3 className="home-feature-title">High value-added investment strategies</h3>
      <p className="home-feature-sub">
        Autonomous investment teams. Global markets. Long-term conviction.
      </p>
      <canvas ref={canvasRef} className="home-feature-chart" aria-hidden="true" />
    </motion.div>
  );
}
