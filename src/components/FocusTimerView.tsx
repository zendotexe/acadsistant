import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Flame, Clock, Award, Book, Settings2, Trash2, CheckCircle2, Coffee } from 'lucide-react';
import { cn } from '../lib/utils';
import { Course, FocusSession } from '../types';
import { Modal } from './Modal';

interface FocusTimerViewProps {
  courses: Course[];
  focusSessions: FocusSession[];
  setFocusSessions: (sessions: FocusSession[]) => void;
}

export function FocusTimerView({ courses, focusSessions, setFocusSessions }: FocusTimerViewProps) {
  // Config
  const [workTime, setWorkTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [showConfig, setShowConfig] = useState(false);

  // Timer Finished Modal State
  const [finishModal, setFinishModal] = useState<{ isOpen: boolean; title: string; body: string; type: 'work' | 'break' } | null>(null);

  // Timer State
  const [mode, setMode] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound Player (synthesizes audio using Web Audio API so it's bulletproof)
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(660, audioCtx.currentTime); // Mi
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 500);
    } catch (e) {
      console.warn('Audio Context not allowed by browser autoplay policy / iframe rules.', e);
    }
  };

  // Synchronize timer duration on mode/setting changes
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'work') setTimeLeft(workTime * 60);
      else if (mode === 'short-break') setTimeLeft(shortBreak * 60);
      else if (mode === 'long-break') setTimeLeft(longBreak * 60);
    }
  }, [workTime, shortBreak, longBreak, mode, isRunning]);

  // Main Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedCourseId]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playBeep();

    // Log the focus session
    const durationMin = mode === 'work' ? workTime : mode === 'short-break' ? shortBreak : longBreak;
    const newSession: FocusSession = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      durationMinutes: durationMin,
      courseId: mode === 'work' ? (selectedCourseId || undefined) : undefined,
      category: mode
    };
    
    setFocusSessions([newSession, ...focusSessions]);

    // Flip mode automatically and notify
    if (mode === 'work') {
      setFinishModal({
        isOpen: true,
        title: 'Focus Session Complete!',
        body: 'Incredible progress! You maintained focus and logged some excellent productivity points. Now, kick back and take a well-deserved short break! ☕',
        type: 'work'
      });
      setMode('short-break');
    } else {
      setFinishModal({
        isOpen: true,
        title: 'Recharge Time Finished!',
        body: 'Brilliant! Your mental battery is fully replendished. Take a deep breath and start your next concentration session! 🚀',
        type: 'break'
      });
      setMode('work');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'work') setTimeLeft(workTime * 60);
    else if (mode === 'short-break') setTimeLeft(shortBreak * 60);
    else if (mode === 'long-break') setTimeLeft(longBreak * 60);
  };

  const handleModeChange = (newMode: 'work' | 'short-break' | 'long-break') => {
    setIsRunning(false);
    setMode(newMode);
  };

  const formats = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get total duration of the current configuration
  const totalSeconds = mode === 'work' ? workTime * 60 : mode === 'short-break' ? shortBreak * 60 : longBreak * 60;
  const progressPercentage = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Calculate statistics
  const totalWorkMinutes = focusSessions
    .filter(s => s.category === 'work')
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const completedSessionsCount = focusSessions.filter(s => s.category === 'work').length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl dark:text-white font-display font-bold">Focus Timer</h1>
          <p className="text-slate-500 dark:text-slate-400">Pomodoro focus sessions to supercharge your study efficiency.</p>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Settings2 size={18} /> Configure
        </button>
      </header>

      {showConfig && (
        <div className="surface p-6 rounded-[2rem] border border-slate-150 dark:border-slate-850 shadow-sm animate-in fade-in slide-in-from-top-4 duration-350">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Timer Settings (Minutes)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Work Session</label>
              <input
                type="number"
                min="1"
                max="120"
                value={workTime}
                onChange={(e) => setWorkTime(Math.max(1, parseInt(e.target.value) || 25))}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Short Break</label>
              <input
                type="number"
                min="1"
                max="60"
                value={shortBreak}
                onChange={(e) => setShortBreak(Math.max(1, parseInt(e.target.value) || 5))}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Long Break</label>
              <input
                type="number"
                min="1"
                max="90"
                value={longBreak}
                onChange={(e) => setLongBreak(Math.max(1, parseInt(e.target.value) || 15))}
                className="input-base"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main interactive timer interface */}
        <div className="lg:col-span-2 surface p-8 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Decorative background glow that changes depending on focus vs break */}
          <div className={cn(
            "absolute -top-32 w-80 h-80 rounded-full blur-3xl opacity-20 transition-all duration-700",
            mode === 'work' ? "bg-red-500" : "bg-emerald-500"
          )}></div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8 relative z-10 shadow-inner">
            <button
              onClick={() => handleModeChange('work')}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold transition-all",
                mode === 'work' 
                  ? "bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              )}
            >
              Work Focus
            </button>
            <button
              onClick={() => handleModeChange('short-break')}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold transition-all",
                mode === 'short-break' 
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              )}
            >
              Short Break
            </button>
            <button
              onClick={() => handleModeChange('long-break')}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold transition-all",
                mode === 'long-break' 
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              )}
            >
              Long Break
            </button>
          </div>

          {/* Circular Countdown Progress Ring */}
          <div className="relative w-72 h-72 flex items-center justify-center mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="132"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="144"
                cy="144"
                r="132"
                className={cn(
                  "transition-all duration-300",
                  mode === 'work' ? "stroke-red-500" : mode === 'short-break' ? "stroke-emerald-500" : "stroke-indigo-500"
                )}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 132}
                strokeDashoffset={2 * Math.PI * 132 * (1 - progressPercentage / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center flex flex-col justify-center items-center">
              <span className="text-5xl font-mono font-bold tracking-tight text-slate-800 dark:text-white">
                {formats(timeLeft)}
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest mt-2",
                mode === 'work' ? "text-red-500" : mode === 'short-break' ? "text-emerald-500" : "text-indigo-500"
              )}>
                {mode === 'work' ? 'Focusing' : 'Break Time'}
              </span>
            </div>
          </div>

          {/* Course Association Selector */}
          {mode === 'work' && (
            <div className="w-full max-w-sm mb-6 relative z-10">
              <label className="block text-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                <Book size={12} /> Associate Course Target
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                disabled={isRunning}
                className="input-base text-center text-xs rounded-xl shadow-xs"
              >
                <option value="">No specific course (General Study)</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={resetTimer}
              className="p-3 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-full transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
              title="Reset Session"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={toggleTimer}
              className={cn(
                "p-5 rounded-full text-white transition-all transform hover:scale-105 shadow-xl flex items-center justify-center",
                isRunning 
                  ? "bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500" 
                  : (mode === 'work' ? "bg-red-500 hover:bg-red-600 shadow-red-200 dark:shadow-none" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 dark:shadow-none")
              )}
            >
              {isRunning ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
            </button>
          </div>
        </div>

        {/* Focus Stats Side Rail */}
        <div className="space-y-6">
          <div className="surface p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Award size={18} className="text-brand-500" /> Focus Report
            </h2>
            <div className="space-y-5">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center text-red-500">
                  <Flame size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-slate-950 dark:text-white">{totalWorkMinutes} min</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Total Concentration Time</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-slate-950 dark:text-white">{completedSessionsCount}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Focus Sessions Finished</p>
                </div>
              </div>
            </div>
          </div>

          <div className="surface p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between mb-4">
              <span>Past Focus Activity</span>
              {focusSessions.length > 0 && (
                <button 
                  onClick={() => setFocusSessions([])}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  Clear All
                </button>
              )}
            </h2>
            
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
              {focusSessions.length > 0 ? (
                focusSessions.map((session) => {
                  const correlatedCourse = courses.find(c => c.id === session.courseId);
                  const isWork = session.category === 'work';
                  const isLong = session.category === 'long-break';

                  return (
                    <div key={session.id} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl flex items-center justify-between border border-slate-100/50 dark:border-slate-800">
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {isWork 
                            ? (correlatedCourse ? `${correlatedCourse.code} Session` : 'General Focus Session') 
                            : (isLong ? 'Long Recharging Break' : 'Short Break Relax')}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(session.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={cn(
                        "text-xs px-2.5 py-1 rounded-lg font-mono font-bold",
                        isWork 
                          ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" 
                          : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                      )}>
                        {isWork ? '+' : ''}{session.durationMinutes}m
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">Your focus logs will show here once you finish a study interval.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {finishModal && (
        <Modal
          isOpen={finishModal.isOpen}
          onClose={() => setFinishModal(null)}
          title={finishModal.title}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center shadow-md",
              finishModal.type === 'work' 
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500" 
                : "bg-brand-50 dark:bg-brand-950/40 text-brand-500"
            )}>
              {finishModal.type === 'work' ? <Coffee size={32} /> : <CheckCircle2 size={32} />}
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {finishModal.body}
            </p>

            <button
              onClick={() => setFinishModal(null)}
              className={cn(
                "w-full py-3 rounded-xl font-bold text-sm text-white shadow-md active:scale-98 transition-all hover:brightness-105",
                finishModal.type === 'work' ? "bg-emerald-500 hover:bg-emerald-600" : "bg-brand-500 hover:bg-brand-600"
              )}
            >
              Start Session Phase
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
