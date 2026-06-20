import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Clock, 
  Tag,
  X,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CalendarEvent, EventCategory } from '../types';
import { Modal } from './Modal';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay
} from 'date-fns';

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string; accent: string }> = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200/50 dark:border-blue-900/30',
    badge: 'bg-blue-200/30 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    accent: 'bg-blue-100/85 dark:bg-blue-950/45 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/30'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-200/50 dark:border-red-900/30',
    badge: 'bg-red-200/30 dark:bg-red-900/30 text-red-850 dark:text-red-300',
    accent: 'bg-red-100/85 dark:bg-red-950/45 text-red-850 dark:text-red-350 border border-red-200/50 dark:border-red-900/30'
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-200/50 dark:border-emerald-900/30',
    badge: 'bg-emerald-200/30 dark:bg-emerald-990 text-emerald-800',
    accent: 'bg-emerald-100/85 dark:bg-emerald-950/45 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/30'
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200/50 dark:border-amber-900/30',
    badge: 'bg-amber-200/30 dark:bg-amber-900/30 text-amber-850 dark:text-amber-300',
    accent: 'bg-amber-100/85 dark:bg-amber-950/45 text-amber-850 dark:text-amber-350 border border-amber-200/50 dark:border-amber-900/30'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    text: 'text-purple-800 dark:text-purple-300',
    border: 'border-purple-200/50 dark:border-purple-900/30',
    badge: 'bg-purple-200/30 dark:bg-purple-900/30 text-purple-850 dark:text-purple-300',
    accent: 'bg-purple-100/85 dark:bg-purple-950/45 text-purple-800 dark:text-purple-300 border border-purple-200/50 dark:border-purple-900/30'
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    text: 'text-pink-800 dark:text-pink-300',
    border: 'border-pink-200/50 dark:border-pink-900/30',
    badge: 'bg-pink-200/30 dark:bg-pink-905 text-pink-800',
    accent: 'bg-pink-100/85 dark:bg-pink-950/45 text-pink-850 border border-pink-200/50 dark:border-pink-900/30'
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    text: 'text-indigo-805 dark:text-indigo-305',
    border: 'border-indigo-200/50 dark:border-indigo-909',
    badge: 'bg-indigo-200/30 dark:bg-indigo-905 text-indigo-800',
    accent: 'bg-indigo-100/85 dark:bg-indigo-950/45 text-indigo-805 border border-indigo-200/50 dark:border-indigo-900/30'
  },
  rose: {
    bg: 'bg-rose-100 dark:bg-rose-905 text-rose-700',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200/50 dark:border-rose-900/30',
    badge: 'bg-rose-205 text-rose-800',
    accent: 'bg-rose-100/85 dark:bg-rose-950/45 text-rose-805 border border-rose-200/50 dark:border-rose-900/30'
  },
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-800 text-slate-705 dark:text-slate-350',
    text: 'text-slate-800 dark:text-slate-300Style',
    border: 'border-slate-200/50 dark:border-slate-800/60',
    badge: 'bg-slate-200/30 dark:bg-slate-800/30 text-slate-800 dark:text-slate-350',
    accent: 'bg-slate-100/85 dark:bg-slate-900/45 text-slate-800 border border-slate-200/50 dark:border-slate-800/50'
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    text: 'text-orange-850 dark:text-orange-300',
    border: 'border-orange-200/50 dark:border-orange-900/30',
    badge: 'bg-orange-200/30 dark:bg-orange-905 text-orange-800',
    accent: 'bg-orange-100/85 dark:bg-orange-950/45 text-orange-80 border border-orange-200/50 dark:border-orange-900/30'
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-905 text-cyan-705',
    text: 'text-cyan-850 dark:text-cyan-300',
    border: 'border-cyan-200/50 dark:border-cyan-900/30',
    badge: 'bg-cyan-200/30 dark:bg-cyan-905 text-cyan-805',
    accent: 'bg-cyan-100/85 dark:bg-cyan-950/45 text-cyan-80 border border-cyan-200/50 dark:border-cyan-900/30'
  }
};

const getColorStyle = (color: string) => {
  return colorMap[color] || colorMap.blue;
};

interface CalendarViewProps {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  eventCategories: EventCategory[];
  setEventCategories: (categories: EventCategory[]) => void;
}

export function CalendarView({ events, setEvents, eventCategories, setEventCategories }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'month' | 'timetable'>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', color: 'blue' });
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    categoryId: eventCategories[0]?.id || 'other',
    time: '09:00',
    isAllDay: false,
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000); // 15 seconds intervals for highly responsive pointer line
    return () => clearInterval(timer);
  }, []);

  const nextAction = () => {
    if (viewMode === 'month') {
      const nextM = addMonths(currentMonth, 1);
      setCurrentMonth(nextM);
      setSelectedDate(startOfMonth(nextM));
    } else {
      setSelectedDate(addDays(selectedDate, 7));
    }
  };

  const prevAction = () => {
    if (viewMode === 'month') {
      const prevM = subMonths(currentMonth, 1);
      setCurrentMonth(prevM);
      setSelectedDate(startOfMonth(prevM));
    } else {
      setSelectedDate(addDays(selectedDate, -7));
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    // If double click or something? For now just select.
    // Google calendar often opens the add modal on click if it's empty.
  };

  const onDateDoubleClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
    setEditingEventId(null);
    setNewEvent({ 
      title: '', 
      categoryId: eventCategories[0]?.id || 'other', 
      time: '09:00',
      isAllDay: false,
      endDate: format(day, 'yyyy-MM-dd')
    });
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setEditingEventId(event.id);
    const eventDate = parseISO(event.date);
    const eventEndDate = event.endDate ? parseISO(event.endDate) : eventDate;
    setNewEvent({
      title: event.title,
      categoryId: event.categoryId || event.type || 'other',
      time: format(eventDate, 'HH:mm'),
      isAllDay: event.isAllDay || false,
      endDate: format(eventEndDate, 'yyyy-MM-dd')
    });
    setSelectedDate(eventDate);
    setIsModalOpen(true);
  };

  const onDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('eventId', eventId);
    // Add a ghost image or styling if needed
    e.currentTarget.classList.add('opacity-50');
  };

  const onDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-slate-50', 'dark:bg-slate-800/50');
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-slate-50', 'dark:bg-slate-800/50');
  };

  const onDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-slate-50', 'dark:bg-slate-800/50');
    const eventId = e.dataTransfer.getData('eventId');
    const event = events.find(ev => ev.id === eventId);
    if (event) {
      const oldDate = parseISO(event.date);
      const newDate = new Date(date);
      newDate.setHours(oldDate.getHours());
      newDate.setMinutes(oldDate.getMinutes());
      
      setEvents(events.map(ev => 
        ev.id === eventId 
          ? { ...ev, date: newDate.toISOString() } 
          : ev
      ));
    }
  };

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const eventDate = new Date(selectedDate);
    if (!newEvent.isAllDay) {
      const [hours, minutes] = newEvent.time.split(':').map(Number);
      eventDate.setHours(hours, minutes);
    } else {
      eventDate.setHours(0, 0, 0, 0);
    }

    const eventEndDate = new Date(newEvent.endDate);
    if (!newEvent.isAllDay) {
      const [hours, minutes] = newEvent.time.split(':').map(Number);
      eventEndDate.setHours(hours + 1, minutes); // Default 1 hour duration if same day
    } else {
      eventEndDate.setHours(23, 59, 59, 999);
    }

    if (editingEventId) {
      setEvents(events.map(ev => 
        ev.id === editingEventId 
          ? { 
              ...ev, 
              title: newEvent.title, 
              categoryId: newEvent.categoryId, 
              date: eventDate.toISOString(),
              endDate: eventEndDate.toISOString(),
              isAllDay: newEvent.isAllDay
            } 
          : ev
      ));
    } else {
      const event: CalendarEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: newEvent.title,
        date: eventDate.toISOString(),
        endDate: eventEndDate.toISOString(),
        isAllDay: newEvent.isAllDay,
        categoryId: newEvent.categoryId,
      };
      setEvents([...events, event]);
    }

    setNewEvent({ 
      title: '', 
      categoryId: eventCategories[0]?.id || 'other', 
      time: '09:00', 
      isAllDay: false, 
      endDate: format(new Date(), 'yyyy-MM-dd') 
    });
    setEditingEventId(null);
    setIsModalOpen(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;
    
    if (editingCategory) {
      setEventCategories(eventCategories.map(c => c.id === editingCategory.id ? { ...c, name: newCategory.name, color: newCategory.color } : c));
      setEditingCategory(null);
    } else {
      const cat: EventCategory = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCategory.name,
        color: newCategory.color,
      };
      setEventCategories([...eventCategories, cat]);
    }
    setNewCategory({ name: '', color: 'blue' });
  };

  const deleteCategory = (id: string) => {
    if (eventCategories.length <= 1) return;
    setEventCategories(eventCategories.filter(c => c.id !== id));
    setEvents(events.map(e => e.categoryId === id ? { ...e, categoryId: eventCategories.find(c => c.id !== id)?.id || 'other' } : e));
  };

  const colors = ['blue', 'red', 'emerald', 'amber', 'purple', 'pink', 'indigo', 'rose', 'slate', 'orange', 'cyan'];

  const renderHeader = () => {
    const getHeaderTitle = () => {
      if (viewMode === 'month') {
        return format(currentMonth, 'MMMM yyyy');
      } else {
        const monday = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const friday = addDays(monday, 4);
        return `${format(monday, 'MMM d')} – ${format(friday, 'MMM d, yyyy')}`;
      }
    };

    return (
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl dark:text-white font-display font-bold">{getHeaderTitle()}</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {viewMode === 'month' 
              ? "Manage your academic schedule and deadlines." 
              : "Your weekly recurring lectures, labs, and classroom routines."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
            <button
              onClick={() => setViewMode('month')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === 'month'
                  ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              )}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('timetable')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === 'timetable'
                  ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              )}
            >
              Timetable View
            </button>
          </div>

          <button 
            onClick={goToToday}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Today
          </button>
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <button onClick={prevAction} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextAction} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
              <ChevronRight size={18} />
            </button>
          </div>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Tag size={18} /> Categories
          </button>
          <button 
            onClick={() => {
              setEditingEventId(null);
              setNewEvent({ title: '', categoryId: eventCategories[0]?.id || 'other', time: '09:00', isAllDay: false, endDate: format(new Date(), 'yyyy-MM-dd') });
              setIsModalOpen(true);
            }}
            className="px-6 py-2.5 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-200 flex items-center gap-2"
          >
            <Plus size={20} /> Add Event
          </button>
        </div>
      </header>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-800 gap-[1px] border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {calendarDays.map((day, i) => {
          const dayEvents = events.filter(e => {
            const start = startOfDay(parseISO(e.date));
            const end = endOfDay(e.endDate ? parseISO(e.endDate) : start);
            return isWithinInterval(day, { start, end });
          });
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <div
              key={i}
              onClick={() => onDateClick(day)}
              onDoubleClick={() => onDateDoubleClick(day)}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, day)}
              className={cn(
                "min-h-[140px] p-2 transition-all cursor-pointer relative group",
                isCurrentMonth ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600",
                isSelected && "ring-2 ring-inset ring-brand-500 z-10",
                isToday && "bg-brand-50/30 dark:bg-brand-900/10"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isToday ? "bg-brand-500 text-white shadow-lg shadow-brand-200" : 
                  isCurrentMonth ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-slate-600"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[90px] scrollbar-hide">
                {dayEvents.map(event => {
                  const isStart = isSameDay(day, parseISO(event.date));
                  const isEnd = isSameDay(day, event.endDate ? parseISO(event.endDate) : parseISO(event.date));
                  const isMultiDay = event.endDate && !isSameDay(parseISO(event.date), parseISO(event.endDate));
                  
                  return (
                    <div 
                      key={event.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, event.id)}
                      onDragEnd={onDragEnd}
                      onClick={(e) => handleEventClick(e, event)}
                      className={cn(
                        "text-[10px] px-2 py-1 truncate font-bold flex items-center justify-between group/event cursor-grab active:cursor-grabbing",
                        (() => {
                          const cat = eventCategories.find(c => c.id === event.categoryId) || eventCategories.find(c => c.id === event.type) || eventCategories[eventCategories.length - 1];
                          const style = getColorStyle(cat?.color || 'blue');
                          return style.bg;
                        })(),
                        isMultiDay ? (
                          isStart ? "rounded-l-lg rounded-r-none mr-[-5px]" :
                          isEnd ? "rounded-r-lg rounded-l-none ml-[-5px]" :
                          "rounded-none mx-[-5px]"
                        ) : "rounded-lg"
                      )}
                    >
                      <span className="truncate flex items-center gap-1">
                        {!event.isAllDay && (
                          <span className="opacity-60 font-mono shrink-0">
                            {(() => {
                              const date = parseISO(event.date);
                              return format(date, date.getMinutes() === 0 ? 'ha' : 'h:mma').toUpperCase();
                            })()}
                          </span>
                        )}
                        {event.title}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvent(event.id);
                        }}
                        className="opacity-0 group-hover/event:opacity-100 p-0.5 hover:bg-black/10 rounded transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTimetable = () => {
    const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const monToFriDays = Array.from({ length: 5 }, (_, i) => addDays(startOfSelectedWeek, i));
    const startHour = 8;
    const endHour = 18;
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
    const slotHeight = 64; // px

    return (
      <div className="w-full overflow-x-auto rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="min-w-[750px] relative">
          
          {/* Header row */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-3">
            <div />
            {monToFriDays.map((day, i) => {
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedDate(day)}
                  className="text-center cursor-pointer flex flex-col items-center justify-center group"
                >
                  <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {format(day, 'EEEE')}
                  </span>
                  <span className={cn(
                    "text-sm font-extrabold w-8 h-8 flex items-center justify-center rounded-full mt-1.5 transition-all",
                    isToday 
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-200 dark:shadow-none" 
                      : isSelected
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Grid View Canvas */}
          <div 
            className="relative grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] select-none"
            style={{ height: `${(hours.length - 1) * slotHeight}px` }}
          >
            {/* Hour scale (Y axis labels) */}
            <div className="relative h-full border-r border-slate-100 dark:border-slate-800/60">
              {hours.map((hr, idx) => {
                const ampm = hr >= 12 ? 'PM' : 'AM';
                const displayHr = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
                const formattedTime = `${displayHr}:00 ${ampm}`;
                
                return (
                  <div 
                    key={hr} 
                    className="absolute text-right pr-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 font-mono tracking-tight"
                    style={{ 
                      top: `${idx * slotHeight}px`,
                      transform: 'translateY(-50%)',
                      width: '100%'
                    }}
                  >
                    {formattedTime}
                  </div>
                );
              })}
            </div>

            {/* Columns of days (X axis) */}
            {monToFriDays.map((day, dayIdx) => {
              const dayEvents = events.filter(e => {
                const eventDate = parseISO(e.date);
                return isSameDay(eventDate, day) && !e.isAllDay;
              });

              const isTodayColumn = isSameDay(day, new Date());
              const currentHourFraction = currentTime.getHours() + currentTime.getMinutes() / 60;
              const showIndicator = isTodayColumn && (currentHourFraction >= startHour && currentHourFraction <= endHour);
              const indicatorTopPx = (currentHourFraction - startHour) * slotHeight;

              return (
                <div 
                  key={dayIdx} 
                  className="relative h-full border-r border-dashed border-slate-100 dark:border-slate-850/60 last:border-r-0 group/col"
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, day)}
                >
                  {showIndicator && (
                    <div 
                      className="absolute left-0 right-0 border-t pointer-events-none z-30 flex items-center"
                      style={{ top: `${indicatorTopPx}px` }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 dark:bg-red-400 -ml-1.5 shrink-0 shadow-md ring-4 ring-red-100 dark:ring-red-950/40 absolute animate-pulse" />
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 dark:bg-red-400 -ml-1.5 shrink-0 shadow-md ring-4 ring-red-100 dark:ring-red-950/40 relative" />
                      <div className="flex-1 h-[2px] bg-red-500 dark:bg-red-400 opacity-90 shadow-xs" />
                    </div>
                  )}
                  {/* Slots helper for clicking */}
                  {hours.slice(0, -1).map((_, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        const dateWithHour = new Date(day);
                        dateWithHour.setHours(startHour + idx, 0, 0, 0);
                        setSelectedDate(dateWithHour);
                        setEditingEventId(null);
                        setNewEvent({
                          title: '',
                          categoryId: eventCategories[0]?.id || 'other',
                          time: `${String(startHour + idx).padStart(2, '0')}:00`,
                          isAllDay: false,
                          endDate: format(day, 'yyyy-MM-dd')
                        });
                        setIsModalOpen(true);
                      }}
                      className="absolute left-0 w-full border-b border-slate-100/50 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 cursor-pointer transition-colors"
                      style={{ 
                        top: `${idx * slotHeight}px`, 
                        height: `${slotHeight}px` 
                      }}
                      title={`Schedule a class at ${startHour + idx}:00`}
                    />
                  ))}

                  {/* Active absolute positioned events inside this day's column */}
                  {dayEvents.map(event => {
                    const eventDate = parseISO(event.date);
                    const eventEndDate = event.endDate ? parseISO(event.endDate) : new Date(eventDate.getTime() + 60 * 60 * 1000);
                    const eventDurationHour = (eventEndDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60);
                    
                    const eventStartHr = eventDate.getHours() + eventDate.getMinutes() / 60;
                    
                    const displayStart = Math.max(startHour, eventStartHr);
                    const displayEnd = Math.min(endHour, eventStartHr + eventDurationHour);
                    
                    if (displayEnd <= displayStart) return null; // out of range

                    const topPx = (displayStart - startHour) * slotHeight;
                    const heightPx = (displayEnd - displayStart) * slotHeight;

                    const cat = eventCategories.find(c => c.id === event.categoryId) || eventCategories.find(c => c.id === event.type) || eventCategories[eventCategories.length - 1];
                    const style = getColorStyle(cat?.color || 'blue');

                    return (
                      <div
                        key={event.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, event.id)}
                        onDragEnd={onDragEnd}
                        onClick={(e) => handleEventClick(e, event)}
                        className={cn(
                          "absolute left-1.5 right-1.5 p-3 rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xs cursor-grab active:cursor-grabbing hover:shadow-md transition-all group/cell z-20 select-none text-left",
                          style.accent
                        )}
                        style={{ 
                          top: `${topPx + 2}px`, 
                          height: `${heightPx - 4}px` 
                        }}
                      >
                        <div className="min-w-0 flex flex-col h-full justify-between">
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-[11px] font-extrabold font-sans leading-tight line-clamp-2">
                                {event.title}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteEvent(event.id);
                                }}
                                className="opacity-0 group-hover/cell:opacity-100 p-0.5 rounded bg-black/5 hover:bg-black/10 text-current transition-opacity flex items-center justify-center self-start shrink-0"
                              >
                                <X size={10} />
                              </button>
                            </div>
                            
                            <span className="text-[9px] font-bold opacity-75 mt-1 line-clamp-1 flex items-center gap-1">
                              <Clock size={8} />
                              {format(eventDate, 'h:mm')} – {format(eventEndDate, 'h:mm a')}
                            </span>
                          </div>

                          <span className={cn(
                            "text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-lg w-max font-mono mt-1",
                            style.badge
                          )}>
                            {cat.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderHeader()}
      {viewMode === 'month' ? (
        <div className="surface p-6 rounded-[2.5rem]">
          {renderDays()}
          {renderCells()}
        </div>
      ) : (
        renderTimetable()
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingEventId(null);
        }} 
        title={editingEventId ? 'Edit Event' : `Add Event for ${format(selectedDate, 'MMM d, yyyy')}`}
      >
        <form onSubmit={addEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
            <input 
              autoFocus
              type="text" 
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="input-base"
              placeholder="e.g. Data Structures Exam"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="checkbox" 
              id="isAllDay"
              checked={newEvent.isAllDay}
              onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
            />
            <label htmlFor="isAllDay" className="text-sm font-medium text-slate-700 dark:text-slate-300">All Day Event</label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select 
                value={newEvent.categoryId}
                onChange={(e) => setNewEvent({ ...newEvent, categoryId: e.target.value })}
                className="input-base"
              >
                {eventCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {!newEvent.isAllDay && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                <input 
                  type="time" 
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="input-base"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
            <input 
              type="date" 
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              className="input-base"
            />
          </div>
          <div className="flex gap-3 mt-4">
            {editingEventId && (
              <button 
                type="button"
                onClick={() => {
                  deleteEvent(editingEventId);
                  setIsModalOpen(false);
                  setEditingEventId(null);
                }}
                className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Delete
              </button>
            )}
            <button 
              type="submit"
              className={cn(
                "py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200",
                editingEventId ? "flex-[2]" : "w-full"
              )}
            >
              {editingEventId ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isCategoryModalOpen} 
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
          setNewCategory({ name: '', color: 'blue' });
        }} 
        title="Manage Categories"
      >
        <div className="space-y-6">
          <form onSubmit={addCategory} className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category Name</label>
              <input 
                type="text" 
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g. Research"
                className="input-base w-full"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pick a Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, color: c })}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all transform hover:scale-110",
                      `bg-${c}-500`,
                      newCategory.color === c ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 scale-110" : "opacity-80 hover:opacity-100"
                    )}
                  >
                    {newCategory.color === c && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {editingCategory && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCategory({ name: '', color: 'blue' });
                  }}
                  className="flex-1 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit"
                className="flex-[2] py-2 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200"
              >
                {editingCategory ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </form>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Existing Categories</h3>
            <div className="grid grid-cols-1 gap-2">
              {eventCategories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 surface rounded-xl group">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-4 h-4 rounded-full", `bg-${cat.color}-500`)}></div>
                    <span className="font-medium text-slate-900 dark:text-white">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingCategory(cat);
                        setNewCategory({ name: cat.name, color: cat.color });
                      }}
                      className="p-1.5 text-slate-400 hover:text-brand-500 transition-colors"
                    >
                      <Tag size={16} />
                    </button>
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
