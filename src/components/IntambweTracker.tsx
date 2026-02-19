import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface StreakData {
  count: number;
  lastCheckIn: string | null;
}

export function IntambweTracker() {
  const [streakData, setStreakData] = useLocalStorage<StreakData>('intambwe-streak-data', {
    count: 0,
    lastCheckIn: null
  });

  const checkIn = () => {
    const today = new Date().toDateString();
    
    if (streakData.lastCheckIn === today) return; // Already checked in

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = 1;
    if (streakData.lastCheckIn === yesterday.toDateString()) {
      newStreak = streakData.count + 1;
    }
    
    setStreakData({
      count: newStreak,
      lastCheckIn: today
    });
  };

  const isCheckedInToday = streakData.lastCheckIn === new Date().toDateString();

  return (
    <div className="bg-forest-900 text-white rounded-2xl shadow-lg p-6 mb-6 relative overflow-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 imigongo-pattern rounded-bl-full pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-lg font-display font-medium text-forest-200 mb-1">Intambwe Streak</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tighter">{streakData.count}</span>
            <span className="text-sm text-forest-300">days</span>
          </div>
        </div>
        
        <button
          onClick={checkIn}
          disabled={isCheckedInToday}
          className={`group relative flex items-center justify-center w-16 h-16 rounded-full transition-all ${
            isCheckedInToday 
              ? 'bg-forest-800 cursor-default' 
              : 'bg-white text-forest-600 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-forest-950/20'
          }`}
        >
          {isCheckedInToday && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 rounded-full border-2 border-forest-400 opacity-50"
            />
          )}
          <Flame 
            size={32} 
            className={`transition-colors ${isCheckedInToday ? 'text-forest-400' : 'text-forest-600 fill-forest-600'}`} 
          />
        </button>
      </div>
      
      <div className="mt-4 text-xs text-forest-400 font-medium">
        {isCheckedInToday 
          ? "Great job! You've taken a step today." 
          : "Take a step. Mark your progress."}
      </div>
    </div>
  );
}
