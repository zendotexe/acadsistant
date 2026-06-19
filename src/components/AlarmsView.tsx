import React, { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { Alarm } from '../types';
import { Modal } from './Modal';

interface AlarmsViewProps {
  alarms: Alarm[];
  setAlarms: (alarms: Alarm[]) => void;
}

export function AlarmsView({ alarms, setAlarms }: AlarmsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ time: '07:00', label: '', days: [1, 2, 3, 4, 5] });

  const addAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const alarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      time: newAlarm.time,
      label: newAlarm.label || 'Alarm',
      days: newAlarm.days,
      enabled: true,
    };

    setAlarms([...alarms, alarm]);
    setIsModalOpen(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const toggleDay = (day: number) => {
    if (newAlarm.days.includes(day)) {
      setNewAlarm({ ...newAlarm, days: newAlarm.days.filter(d => d !== day) });
    } else {
      setNewAlarm({ ...newAlarm, days: [...newAlarm.days, day] });
    }
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl dark:text-white font-display font-bold">Alarms</h1>
          <p className="text-slate-500 dark:text-slate-400">Wake up on time for your morning lectures.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200 flex items-center gap-2"
        >
          <Plus size={18} /> Add Alarm
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alarms.length > 0 ? alarms.map((alarm) => (
          <div key={alarm.id} className={cn(
            "surface p-8 rounded-[2.5rem] flex items-center justify-between transition-all group",
            !alarm.enabled && "opacity-60 grayscale"
          )}>
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <p className="text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tighter">{formatTime(alarm.time)}</p>
                <button 
                  onClick={() => deleteAlarm(alarm.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">{alarm.label}</p>
              <div className="flex gap-1 mt-3">
                {dayLabels.map((label, i) => (
                  <span 
                    key={i} 
                    className={cn(
                      "text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold",
                      alarm.days.includes(i) ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" : "text-slate-300 dark:text-slate-600"
                    )}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => toggleAlarm(alarm.id)}
              className={cn(
                "w-14 h-8 rounded-full relative transition-colors duration-300",
                alarm.enabled ? "bg-brand-500" : "bg-slate-200"
              )}
            >
              <div className={cn(
                "absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm",
                alarm.enabled ? "left-7" : "left-1"
              )}></div>
            </button>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 surface rounded-3xl border border-dashed">
            <p className="text-slate-400 dark:text-slate-500">No alarms set. Sleep well! 🌙</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Alarm">
        <form onSubmit={addAlarm} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Alarm Time</label>
            <input 
              type="time" 
              value={newAlarm.time}
              onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
              className="w-full text-4xl font-display font-bold text-center py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Label</label>
            <input 
              type="text" 
              value={newAlarm.label}
              onChange={(e) => setNewAlarm({ ...newAlarm, label: e.target.value })}
              className="input-base"
              placeholder="e.g. Morning Class"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Repeat</label>
            <div className="flex justify-between">
              {dayLabels.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={cn(
                    "w-10 h-10 rounded-full font-bold text-sm transition-all",
                    newAlarm.days.includes(i) 
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-200" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200 mt-4"
          >
            Save Alarm
          </button>
        </form>
      </Modal>
    </div>
  );
}
