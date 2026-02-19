import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export function FocusHill() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  
  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = (totalTime - timeLeft) / totalTime; // 0 to 1

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notify
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = () => {
    const newMode = mode === 'focus' ? 'break' : 'focus';
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cubic Bezier calculation
  // P0=(0,80), P1=(20,80), P2=(40,20), P3=(100,20)
  const getClimberPosition = (t: number) => {
    // Ensure t is between 0 and 1
    const clampedT = Math.max(0, Math.min(1, t));
    
    const p0 = { x: 0, y: 80 };
    const p1 = { x: 20, y: 80 };
    const p2 = { x: 40, y: 20 };
    const p3 = { x: 100, y: 20 };

    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    const x = (ax * Math.pow(clampedT, 3)) + (bx * Math.pow(clampedT, 2)) + (cx * clampedT) + p0.x;
    const y = (ay * Math.pow(clampedT, 3)) + (by * Math.pow(clampedT, 2)) + (cy * clampedT) + p0.y;

    return { x, y };
  };

  const climberPos = getClimberPosition(progress);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-forest-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-forest-900">Focus Hill</h2>
        <button 
          onClick={switchMode}
          className="text-xs font-medium px-3 py-1 rounded-full bg-forest-50 text-forest-700 hover:bg-forest-100 transition-colors"
        >
          {mode === 'focus' ? 'Switch to Break' : 'Switch to Focus'}
        </button>
      </div>

      {/* Hill Visualization */}
      <div className="relative h-48 w-full mb-8 bg-forest-50 rounded-xl overflow-hidden border-b-4 border-forest-900">
        {/* Sky/Background */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 50% 0%, #5dc58e 0%, transparent 70%)' 
             }} 
        />
        
        {/* The Hill SVG */}
        <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path 
            d="M0,100 L0,80 C20,80 40,20 100,20 L100,100 Z" 
            fill="currentColor" 
            className="text-forest-200"
          />
          {/* Progress Path (Overlay) */}
          <path 
            d="M0,100 L0,80 C20,80 40,20 100,20 L100,100 Z" 
            fill="currentColor" 
            className="text-forest-500 transition-all duration-1000 ease-linear"
            style={{ 
              clipPath: `inset(0 ${100 - (progress * 100)}% 0 0)` 
            }}
          />
        </svg>

        {/* Climber */}
        <motion.div 
          className="absolute w-6 h-6 bg-forest-900 rounded-full shadow-lg border-2 border-white z-10 flex items-center justify-center"
          animate={{ 
            left: `${climberPos.x}%`,
            top: `${climberPos.y}%`
          }}
          transition={{ duration: 0.5, ease: "linear" }}
          style={{ 
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center">
        <div className="text-5xl font-mono font-bold text-forest-900 mb-6 tracking-tight">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-forest-600 text-white flex items-center justify-center hover:bg-forest-700 active:scale-95 transition-all shadow-lg shadow-forest-600/20"
          >
            {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center hover:bg-forest-200 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
