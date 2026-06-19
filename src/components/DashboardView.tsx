import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar as CalendarIcon, Bell, Layers, Clock as ClockIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Task, Reminder, BacklogItem, UserProfile, CalendarEvent, EventCategory } from '../types';
import { isSameDay, parseISO, format, isWithinInterval, startOfDay, endOfDay, addDays } from 'date-fns';

interface DashboardViewProps {
  tasks: Task[];
  reminders: Reminder[];
  backlogs: BacklogItem[];
  events: CalendarEvent[];
  userProfile: UserProfile;
  eventCategories: EventCategory[];
}

export function DashboardView({ tasks, reminders, backlogs, events, userProfile, eventCategories }: DashboardViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const priorityTasks = activeTasks.filter(t => t.priority === 'high').slice(0, 3);

  const todaysEvents = events.filter(e => {
    const start = startOfDay(parseISO(e.date));
    const end = endOfDay(e.endDate ? parseISO(e.endDate) : start);
    return isWithinInterval(new Date(), { start, end });
  }).sort((a, b) => a.date.localeCompare(b.date));

  const upcomingClassesCount = events.filter(e => 
    e.type === 'class' && 
    isWithinInterval(parseISO(e.date), { 
      start: startOfDay(new Date()), 
      end: endOfDay(addDays(new Date(), 7)) 
    })
  ).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-slate-900 dark:text-white font-display font-bold">
            {getGreeting()}, {userProfile.name.split(' ')[0] || 'Alex'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Here's what's happening with your studies today.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 surface rounded-2xl">
          <ClockIcon size={20} className="text-brand-500" />
          <div className="text-right">
            <p className="text-lg font-mono font-bold text-slate-900 dark:text-white leading-none">
              {format(currentTime, 'hh:mm:ss a')}
            </p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mt-1">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tasks Due Today', value: activeTasks.length.toString(), color: 'bg-blue-500', icon: CheckSquare },
          { label: 'Upcoming Classes', value: upcomingClassesCount.toString(), color: 'bg-purple-500', icon: CalendarIcon },
          { label: 'Pending Reminders', value: reminders.length.toString(), color: 'bg-amber-500', icon: Bell },
          { label: 'Active Backlogs', value: backlogs.length.toString(), color: 'bg-emerald-500', icon: Layers },
        ].map((stat, i) => (
          <div key={i} className="surface p-6 rounded-2xl card-hover">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg", stat.color)}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="surface p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-slate-900 dark:text-white">Today's Schedule</h2>
              <button className="text-brand-500 dark:text-brand-400 text-sm font-semibold hover:underline">View Calendar</button>
            </div>
            <div className="space-y-4">
              {todaysEvents.length > 0 ? todaysEvents.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="text-sm font-mono text-slate-400 dark:text-slate-500 w-16 shrink-0">
                    {item.isAllDay ? 'All Day' : (() => {
                      const date = parseISO(item.date);
                      return format(date, date.getMinutes() === 0 ? 'ha' : 'h:mma').toUpperCase();
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-900 dark:text-white font-medium">{item.title}</h3>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block",
                      (() => {
                        const cat = eventCategories.find(c => c.id === item.categoryId) || eventCategories.find(c => c.id === item.type) || eventCategories[eventCategories.length - 1];
                        return `bg-${cat.color}-100 dark:bg-${cat.color}-900/30 text-${cat.color}-700 dark:text-${cat.color}-300`;
                      })()
                    )}>
                      {eventCategories.find(c => c.id === item.categoryId)?.name || item.type || 'Other'}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No events scheduled for today.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="surface p-6 rounded-2xl">
            <h2 className="text-xl mb-6 text-slate-900 dark:text-white">Priority Tasks</h2>
            <div className="space-y-3">
              {priorityTasks.length > 0 ? priorityTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className={cn("w-1 h-8 rounded-full bg-red-500")}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">High Priority</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-brand-500 focus:ring-brand-500 bg-white dark:bg-slate-700" />
                </div>
              )) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No high priority tasks! 🎉</p>
              )}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">View All Tasks</button>
          </section>
        </div>
      </div>
    </div>
  );
}
