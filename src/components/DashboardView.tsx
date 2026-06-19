import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Bell, 
  Layers, 
  Clock as ClockIcon, 
  Trash2, 
  Plus, 
  BookOpen, 
  X, 
  Edit3 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Task, Reminder, BacklogItem, UserProfile, CalendarEvent, EventCategory, ClassScheduleItem } from '../types';
import { parseISO, format, isWithinInterval, startOfDay, endOfDay, addDays } from 'date-fns';
import { Modal } from './Modal';

interface DashboardViewProps {
  tasks: Task[];
  reminders: Reminder[];
  backlogs: BacklogItem[];
  events: CalendarEvent[];
  userProfile: UserProfile;
  eventCategories: EventCategory[];
  classSchedules: ClassScheduleItem[];
  setClassSchedules: (schedules: ClassScheduleItem[]) => void;
  onNavigate?: (tab: string) => void;
}

export function DashboardView({ 
  tasks, 
  reminders, 
  backlogs, 
  events, 
  userProfile, 
  eventCategories, 
  classSchedules, 
  setClassSchedules, 
  onNavigate 
}: DashboardViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSchedTab, setActiveSchedTab] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun' | 'All'>('All');
  
  // Manage promo dismissal
  const [showPromo, setShowPromo] = useState(() => {
    return localStorage.getItem('acadsistant-dismiss-schedule-promo') !== 'true';
  });

  // Modal input state for new class
  const [newSubject, setNewSubject] = useState('');
  const [newDay, setNewDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:30');
  const [newRoom, setNewRoom] = useState('');

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

  const upcomingClassesCount = events.filter(e => 
    e.type === 'class' && 
    isWithinInterval(parseISO(e.date), { 
      start: startOfDay(new Date()), 
      end: endOfDay(addDays(new Date(), 7)) 
    })
  ).length;

  const daysShorthand: Record<string, 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = {
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
    'Sun': 'Sunday',
  };

  const getSortedClassesForDay = (day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday') => {
    return classSchedules
      .filter(item => item.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hours12 = h % 12 || 12;
      return `${hours12}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

  const handleAddClass = () => {
    if (!newSubject.trim()) return;
    const newItem: ClassScheduleItem = {
      id: Math.random().toString(36).substr(2, 9),
      subject: newSubject.trim(),
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      room: newRoom.trim() || undefined
    };
    setClassSchedules([...classSchedules, newItem]);
    setNewSubject('');
    setNewRoom('');
  };

  const handleRemoveClass = (id: string) => {
    setClassSchedules(classSchedules.filter(item => item.id !== id));
  };

  const dismissPromo = () => {
    localStorage.setItem('acadsistant-dismiss-schedule-promo', 'true');
    setShowPromo(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-slate-900 dark:text-white font-display font-bold">
            {getGreeting()}, {userProfile.name.split(' ')[0] || 'Alex'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Here's what's happening with your studies today.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 surface rounded-2xl border border-slate-100 dark:border-slate-800">
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
          { label: 'Upcoming Class Events', value: upcomingClassesCount.toString(), color: 'bg-purple-500', icon: CalendarIcon },
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
          {/* Class Schedule Section */}
          <section className="surface p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl text-slate-900 dark:text-white font-display font-bold">Class Schedule Timetable</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Easily map and coordinate your weekly course times</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Edit3 size={14} /> Customize Timetable
              </button>
            </div>

            {/* Onboarding Prompts / Helpers */}
            {classSchedules.length === 0 && showPromo ? (
              <div className="bg-brand-50/50 dark:bg-brand-950/10 border border-brand-100 dark:border-brand-900 rounded-2xl p-5 relative">
                <button 
                  onClick={dismissPromo}
                  className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="flex gap-4">
                  <div className="p-3 bg-brand-500 text-white rounded-xl shrink-0 h-11 w-11 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">📅 Configure Your Weekly Schedule</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Input your direct lectures, exam blocks, or laboratory timetables! This customizer enables easy hour monitoring to schedule your academic day properly.
                    </p>
                    <div className="flex gap-3 pt-1">
                      <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[11px] font-bold transition"
                      >
                        Set Up Now
                      </button>
                      <button 
                        onClick={dismissPromo}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-[11px] font-semibold transition"
                      >
                        Do It Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Timetable Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 pb-2 overflow-x-auto gap-1">
              {(['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSchedTab(tab)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                    activeSchedTab === tab
                      ? "bg-brand-500 text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {tab === 'All' ? 'Week View' : tab}
                </button>
              ))}
            </div>

            {/* Timetable Content */}
            <div className="mt-4">
              {activeSchedTab === 'All' ? (
                /* Week View - Multi-Day Grid Card Rows */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const).map((day) => {
                    const classes = getSortedClassesForDay(day);
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                    return (
                      <div 
                        key={day} 
                        className={cn(
                          "p-4 rounded-xl border transition-all",
                          isToday 
                            ? "bg-brand-50/30 dark:bg-brand-950/10 border-brand-500/50 dark:border-brand-500/30 shadow-xs" 
                            : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={cn("font-bold text-xs", isToday ? "text-brand-600 dark:text-brand-400" : "text-slate-800 dark:text-slate-200")}>
                            {day}
                            {isToday && <span className="ml-1.5 text-[8px] uppercase tracking-wider bg-brand-500 text-white font-extrabold px-1 rounded">Today</span>}
                          </h3>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{classes.length} Classes</span>
                        </div>
                        
                        <div className="space-y-1.5">
                          {classes.length > 0 ? (
                            classes.map((cls) => (
                              <div key={cls.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                                <p className="font-bold text-xs text-slate-850 dark:text-slate-200 truncate">{cls.subject}</p>
                                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                                  <span className="font-mono flex items-center gap-1">
                                    <ClockIcon size={10} />
                                    {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                                  </span>
                                  {cls.room && (
                                    <span className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1 py-0.2 rounded-xs font-mono truncate max-w-[80px]">
                                      {cls.room}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center py-3 italic">Free day</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Day Focused View */
                <div className="space-y-3">
                  {getSortedClassesForDay(daysShorthand[activeSchedTab]).length > 0 ? (
                    getSortedClassesForDay(daysShorthand[activeSchedTab]).map((cls) => (
                      <div 
                        key={cls.id} 
                        className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-brand-100 dark:hover:border-brand-900 transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="p-2 bg-brand-500/10 text-brand-500 dark:text-brand-400 rounded-lg shrink-0">
                            <BookOpen size={18} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-850 dark:text-white text-sm">{cls.subject}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-450">
                              <span className="font-mono flex items-center gap-1">
                                <ClockIcon size={12} />
                                {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                              </span>
                              {cls.room && (
                                <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">
                                  📍 {cls.room}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveClass(cls.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-950/30"
                          title="Delete class"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-slate-50/40 dark:bg-slate-800/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">☕ No scheduled classes for {daysShorthand[activeSchedTab]}.</p>
                      <button 
                        onClick={() => {
                          setNewDay(daysShorthand[activeSchedTab]);
                          setIsEditModalOpen(true);
                        }}
                        className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-500/10 text-brand-500 hover:bg-brand-500 hover:text-white transition-all rounded-lg text-xs font-bold"
                      >
                        <Plus size={12} /> Add Class
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="surface p-6 rounded-2xl">
            <h2 className="text-xl mb-6 text-slate-900 dark:text-white font-display font-bold">Priority Tasks</h2>
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
            <button 
              onClick={() => onNavigate?.('tasks')}
              className="w-full mt-6 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              View All Tasks
            </button>
          </section>
        </div>
      </div>

      {/* Timetable Customization Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Customize Timetable & Class Schedules 🗓️"
      >
        <div className="space-y-6">
          {/* Add Form Block */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>➕ Add New Weekly Class Schedule</span>
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Subject Name / Course Code</label>
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="input-base"
                  placeholder="e.g. CS101 - Intro to Programming"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Day of Week</label>
                  <select 
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="input-base bg-white dark:bg-slate-900"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Room / Venue</label>
                  <input 
                    type="text" 
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="input-base"
                    placeholder="e.g. Rm 302 or Online"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Start Time</label>
                  <input 
                    type="time" 
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">End Time</label>
                  <input 
                    type="time" 
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="input-base"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddClass}
                disabled={!newSubject.trim()}
                className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus size={14} /> Add Class Route
              </button>
            </div>
          </div>

          {/* List of Current Schedules */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enrolled Class Slots ({classSchedules.length})
            </h3>
            
            <div className="max-h-56 overflow-y-auto pr-1 space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-2">
              {classSchedules.length > 0 ? (
                classSchedules.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold text-xs text-slate-850 dark:text-white leading-tight">{cls.subject}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <span className="font-semibold text-brand-500 dark:text-brand-400">{cls.day}</span>
                        <span>•</span>
                        <span className="font-mono">{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</span>
                        {cls.room && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[80px]">📍 {cls.room}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveClass(cls.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-100/40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 italic">No classes added yet. Input classes above to populate your weekly calendar.</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
            >
              Close & Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
