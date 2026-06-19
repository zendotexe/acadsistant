import React, { useState } from 'react';
import { Bell, Plus, X, AlarmClock, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Reminder, CalendarEvent } from '../types';
import { Modal } from './Modal';
import { format } from 'date-fns';

interface RemindersViewProps {
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
}

export function RemindersView({ reminders, setReminders, events, setEvents }: RemindersViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', time: '' });

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.title || !newReminder.time) return;

    const reminderId = Math.random().toString(36).substr(2, 9);
    const reminderTime = new Date(newReminder.time);

    const reminder: Reminder = {
      id: reminderId,
      title: newReminder.title,
      time: reminderTime,
      active: true,
    };

    // Also add to calendar
    const calendarEvent: CalendarEvent = {
      id: `reminder-${reminderId}`,
      title: newReminder.title,
      date: reminderTime.toISOString(),
      categoryId: 'reminder',
    };

    setReminders([...reminders, reminder]);
    setEvents([...events, calendarEvent]);
    setNewReminder({ title: '', time: '' });
    setIsModalOpen(false);
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    setEvents(events.filter(e => e.id !== `reminder-${id}`));
  };

  const toggleActive = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl dark:text-white font-display font-bold">Reminders</h1>
          <p className="text-slate-500 dark:text-slate-400">Never miss a deadline or a meeting again.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200 flex items-center gap-2"
        >
          <Plus size={18} /> Set Reminder
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.length > 0 ? reminders.map((reminder) => (
          <div key={reminder.id} className={cn(
            "surface p-6 rounded-3xl relative overflow-hidden group transition-all",
            !reminder.active && "opacity-60"
          )}>
            <div className={cn("absolute top-0 left-0 w-1.5 h-full bg-brand-500")}></div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                Reminder
              </span>
              <button 
                onClick={() => deleteReminder(reminder.id)}
                className="text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{reminder.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
              <AlarmClock size={14} /> {format(new Date(reminder.time), 'MMM d, yyyy hh:mm a')}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <button 
                onClick={() => toggleActive(reminder.id)}
                className={cn(
                  "flex-1 py-2 text-xs font-bold rounded-xl transition-colors",
                  reminder.active ? "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" : "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50"
                )}
              >
                {reminder.active ? 'Dismiss' : 'Re-activate'}
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 surface rounded-3xl border border-dashed">
            <p className="text-slate-400 dark:text-slate-500">No reminders set. Stay focused! 🎯</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set New Reminder">
        <form onSubmit={addReminder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reminder Title</label>
            <input 
              autoFocus
              type="text" 
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              className="input-base"
              placeholder="e.g. Submit Scholarship Application"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
            <input 
              type="datetime-local" 
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              className="input-base"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200 mt-4"
          >
            Set Reminder
          </button>
        </form>
      </Modal>
    </div>
  );
}
