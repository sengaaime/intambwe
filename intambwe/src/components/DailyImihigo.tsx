import React, { useState } from 'react';
import { Plus, Check, Trash2, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  is_main: boolean;
}

export function DailyImihigo() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('intambwe-goals', []);
  const [newGoal, setNewGoal] = useState('');
  const [newOtherGoal, setNewOtherGoal] = useState('');

  const mainGoals = goals.filter(g => g.is_main);
  const otherGoals = goals.filter(g => !g.is_main);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    if (mainGoals.length >= 3) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      text: newGoal.trim(),
      completed: false,
      is_main: true,
    };
    setGoals([...goals, goal]);
    setNewGoal('');
  };

  const addOtherGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOtherGoal.trim()) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      text: newOtherGoal.trim(),
      completed: false,
      is_main: false,
    };
    setGoals([...goals, goal]);
    setNewOtherGoal('');
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const GoalItem = ({ goal, onToggle, onDelete, isMain = false }: { goal: Goal, onToggle: (id: string) => void, onDelete: (id: string) => void, isMain?: boolean }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
        goal.completed 
          ? 'bg-forest-50 border-forest-200' 
          : 'bg-white border-gray-100'
      } ${!isMain ? 'text-sm' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => onToggle(goal.id)}
          className={`rounded-full border-2 flex items-center justify-center transition-all ${
            isMain ? 'w-6 h-6' : 'w-5 h-5'
          } ${
            goal.completed
              ? 'bg-forest-500 border-forest-500 text-white'
              : 'border-gray-300 hover:border-forest-400'
          }`}
        >
          {goal.completed && <Check size={isMain ? 14 : 12} strokeWidth={3} />}
        </button>
        <span className={`font-medium ${goal.completed ? 'text-forest-800 line-through opacity-70' : 'text-gray-800'}`}>
          {goal.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(goal.id)}
        className="text-gray-400 hover:text-red-500 p-2 transition-colors"
      >
        <Trash2 size={isMain ? 16 : 14} />
      </button>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-forest-100 p-6 mb-6">
      {/* Main Goals Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold text-forest-900">Daily Imihigo</h2>
        <span className="text-xs font-mono bg-forest-100 text-forest-700 px-2 py-1 rounded-full">
          {mainGoals.filter(g => g.completed).length}/{mainGoals.length}
        </span>
      </div>

      <form onSubmit={addGoal} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder={mainGoals.length >= 3 ? "Top 3 goals set for today" : "Add a main goal..."}
            disabled={mainGoals.length >= 3}
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-forest-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            type="submit"
            disabled={!newGoal.trim() || mainGoals.length >= 3}
            className="absolute right-2 top-2 p-1 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50 disabled:hover:bg-forest-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      <div className="space-y-3 mb-8">
        <AnimatePresence initial={false}>
          {mainGoals.map((goal) => (
            <GoalItem 
              key={goal.id} 
              goal={goal} 
              onToggle={toggleGoal} 
              onDelete={deleteGoal} 
              isMain={true} 
            />
          ))}
        </AnimatePresence>
        
        {mainGoals.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">
            What are your 3 main priorities today?
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-forest-100 mb-6" />

      {/* Other Goals Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-forest-800 flex items-center gap-2">
          <ListTodo size={20} className="text-forest-500" />
          Imirimo Yindi
        </h3>
        <span className="text-xs font-mono text-forest-500">
          {otherGoals.filter(g => g.completed).length} done
        </span>
      </div>

      <form onSubmit={addOtherGoal} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={newOtherGoal}
            onChange={(e) => setNewOtherGoal(e.target.value)}
            placeholder="Add other tasks..."
            className="w-full pl-4 pr-12 py-2 text-sm rounded-lg border border-gray-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!newOtherGoal.trim()}
            className="absolute right-2 top-1.5 p-1 bg-forest-100 text-forest-700 rounded-md hover:bg-forest-200 disabled:opacity-50 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {otherGoals.map((goal) => (
            <GoalItem 
              key={goal.id} 
              goal={goal} 
              onToggle={toggleGoal} 
              onDelete={deleteGoal} 
              isMain={false} 
            />
          ))}
        </AnimatePresence>
        
        {otherGoals.length === 0 && (
          <div className="text-center py-4 text-gray-300 text-xs italic">
            No other tasks yet.
          </div>
        )}
      </div>
    </div>
  );
}
