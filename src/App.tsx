import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Layers, 
  Bell, 
  BellOff, 
  AlarmClock, 
  Settings, 
  Menu, 
  X, 
  Search, 
  User, 
  Plus, 
  Moon, 
  Sun, 
  Timer, 
  GraduationCap, 
  Download, 
  Upload,
  Trash2,
  BookOpen,
  MessageSquare,
  ExternalLink,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, BacklogItem, Reminder, Alarm, CalendarEvent, UserProfile, EventCategory, Course, FocusSession, ClassScheduleItem } from './types';
import { Modal } from './components/Modal';
const coloredLogo = '/logo_colored.png';
const transparentLogo = '/logo_transparent.png';

// Views
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { TasksView } from './components/TasksView';
import { BacklogsView } from './components/BacklogsView';
import { RemindersView } from './components/RemindersView';
import { AlarmsView } from './components/AlarmsView';
import { FocusTimerView } from './components/FocusTimerView';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full p-3 rounded-xl transition-all duration-200 group relative",
      active 
        ? "bg-brand-500 text-white shadow-lg shadow-brand-200" 
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
    )}
  >
    <Icon size={20} className={cn(collapsed ? "mx-auto" : "mr-3")} />
    {!collapsed && <span className="font-medium">{label}</span>}
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (link) {
      link.href = transparentLogo;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = transparentLogo;
      document.head.appendChild(newLink);
    }
  }, []);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useLocalStorage('acadsistant-dark-mode', false);
  const [backupStatus, setBackupStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const exportBackupData = () => {
    try {
      const backup = {
        tasks: JSON.parse(localStorage.getItem('acadsistant-tasks') || '[]'),
        categories: JSON.parse(localStorage.getItem('acadsistant-categories') || '["CS", "Math", "History", "Physics", "Personal"]'),
        events: JSON.parse(localStorage.getItem('acadsistant-events') || '[]'),
        eventCategories: JSON.parse(localStorage.getItem('acadsistant-event-categories') || '[]'),
        backlogs: JSON.parse(localStorage.getItem('acadsistant-backlogs') || '[]'),
        reminders: JSON.parse(localStorage.getItem('acadsistant-reminders') || '[]'),
        alarms: JSON.parse(localStorage.getItem('acadsistant-alarms') || '[]'),
        courses: JSON.parse(localStorage.getItem('acadsistant-courses') || '[]'),
        focusSessions: JSON.parse(localStorage.getItem('acadsistant-focus-sessions') || '[]'),
        classSchedules: JSON.parse(localStorage.getItem('acadsistant-class-schedules') || '[]'),
        profile: JSON.parse(localStorage.getItem('acadsistant-profile') || '{"name":"","age":"","course":"","yearLevel":"","onboarded":false}'),
        darkMode: JSON.parse(localStorage.getItem('acadsistant-dark-mode') || 'false'),
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `academic_planner_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setBackupStatus({ message: 'Backup file exported successfully!', type: 'success' });
    } catch (e) {
      setBackupStatus({ message: 'Failed to generate backup.', type: 'error' });
    }
  };

  const importBackupData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        
        if (
          imported && 
          (Array.isArray(imported.tasks) || 
           Array.isArray(imported.events) || 
           imported.profile || 
           Array.isArray(imported.courses))
        ) {
          if (imported.tasks) localStorage.setItem('acadsistant-tasks', JSON.stringify(imported.tasks));
          if (imported.categories) localStorage.setItem('acadsistant-categories', JSON.stringify(imported.categories));
          if (imported.events) localStorage.setItem('acadsistant-events', JSON.stringify(imported.events));
          if (imported.eventCategories) localStorage.setItem('acadsistant-event-categories', JSON.stringify(imported.eventCategories));
          if (imported.backlogs) localStorage.setItem('acadsistant-backlogs', JSON.stringify(imported.backlogs));
          if (imported.reminders) localStorage.setItem('acadsistant-reminders', JSON.stringify(imported.reminders));
          if (imported.alarms) localStorage.setItem('acadsistant-alarms', JSON.stringify(imported.alarms));
          if (imported.courses) localStorage.setItem('acadsistant-courses', JSON.stringify(imported.courses));
          if (imported.focusSessions) localStorage.setItem('acadsistant-focus-sessions', JSON.stringify(imported.focusSessions));
          if (imported.classSchedules) localStorage.setItem('acadsistant-class-schedules', JSON.stringify(imported.classSchedules));
          if (imported.profile) localStorage.setItem('acadsistant-profile', JSON.stringify(imported.profile));
          if (imported.darkMode !== undefined) localStorage.setItem('acadsistant-dark-mode', JSON.stringify(imported.darkMode));

          setBackupStatus({ message: 'Restore completed successfully! Reloading...', type: 'success' });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setBackupStatus({ message: 'Invalid backup format.', type: 'error' });
        }
      } catch (err) {
        setBackupStatus({ message: 'Failed to read backup database file.', type: 'error' });
      }
    };
    fileReader.readAsText(file);
  };

  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('acadsistant-profile', {
    name: '',
    age: '',
    course: '',
    yearLevel: '',
    onboarded: false
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);
  
  // Weekly class schedules state
  const [classSchedules, setClassSchedules] = useLocalStorage<ClassScheduleItem[]>('acadsistant-class-schedules', []);
  
  // Onboarding wizard states
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardSchedules, setOnboardSchedules] = useState<ClassScheduleItem[]>([]);
  const [onboardSubject, setOnboardSubject] = useState('');
  const [onboardDay, setOnboardDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [onboardStartTime, setOnboardStartTime] = useState('09:00');
  const [onboardEndTime, setOnboardEndTime] = useState('10:30');
  const [onboardRoom, setOnboardRoom] = useState('');

  useEffect(() => {
    setTempProfile(userProfile);
  }, [userProfile, isSettingsOpen]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global State
  const [tasks, setTasks] = useLocalStorage<Task[]>('acadsistant-tasks', []);
  const [categories, setCategories] = useLocalStorage<string[]>('acadsistant-categories', ['CS', 'Math', 'History', 'Physics', 'Personal']);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('acadsistant-events', []);
  const [eventCategories, setEventCategories] = useLocalStorage<EventCategory[]>('acadsistant-event-categories', [
    { id: 'class', name: 'Class', color: 'blue' },
    { id: 'exam', name: 'Exam', color: 'red' },
    { id: 'lab', name: 'Lab', color: 'emerald' },
    { id: 'reminder', name: 'Reminder', color: 'amber' },
    { id: 'meeting', name: 'Meeting', color: 'purple' },
    { id: 'other', name: 'Other', color: 'slate' },
  ]);
  const [backlogs, setBacklogs] = useLocalStorage<BacklogItem[]>('acadsistant-backlogs', []);
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('acadsistant-reminders', []);
  const [alarms, setAlarms] = useLocalStorage<Alarm[]>('acadsistant-alarms', []);
  const [courses, setCourses] = useLocalStorage<Course[]>('acadsistant-courses', []);
  const [focusSessions, setFocusSessions] = useLocalStorage<FocusSession[]>('acadsistant-focus-sessions', []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'tasks', label: 'To-Do List', icon: CheckSquare },
    { id: 'backlogs', label: 'Backlogs', icon: Layers },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'alarms', label: 'Alarms', icon: AlarmClock },
    { id: 'timer', label: 'Focus Timer', icon: Timer },
  ];

  // Alarm System
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = now.getDay();

      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTime && alarm.days.includes(currentDay)) {
          // In a real app, we'd play a sound. Here we'll show an alert or notification.
          // Since it's an iframe, we'll use a custom notification state.
          console.log(`ALARM: ${alarm.label}`);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [alarms]);

  const filteredEvents = searchQuery
    ? events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredTasks = searchQuery
    ? tasks.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredBacklogs = searchQuery
    ? backlogs.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredReminders = searchQuery
    ? reminders.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const hasSearchResults = 
    filteredEvents.length > 0 || 
    filteredTasks.length > 0 || 
    filteredBacklogs.length > 0 || 
    filteredReminders.length > 0;

  const [dismissedNotificationIds, setDismissedNotificationIds] = useLocalStorage<string[]>('acadsistant-dismissed-notifications', []);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Generate dynamic college notifications
  const dynamicNotifications = useMemo(() => {
    const list: Array<{ id: string; title: string; description: string; time: string; type: 'urgent' | 'warning' | 'info' | 'success'; tab?: string }> = [];

    // 1. High-priority tasks that are uncompleted
    tasks.filter(t => !t.completed && t.priority === 'high').forEach(t => {
      list.push({
        id: `task-${t.id}`,
        title: 'High Priority Task Unfinished',
        description: `"${t.title}" is urgent. Focus on completing this assignment today.`,
        time: 'Urgent',
        type: 'urgent',
        tab: 'tasks'
      });
    });

    // 2. Backlogs pending action (todo or doing)
    backlogs.filter(b => b.status !== 'done' && b.priority !== 'low').forEach(b => {
      list.push({
        id: `backlog-${b.id}`,
        title: 'Actionable Backlog Alert',
        description: `"${b.title}" is currently marked as "${b.status === 'in-progress' ? 'doing' : 'to-do'}". Ensure to outline goals for it!`,
        time: 'Pending',
        type: 'warning',
        tab: 'backlogs'
      });
    });

    // 3. Upcoming Calendar Events (Today or Tomorrow)
    const todayStr = new Date().toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toDateString();

    events.forEach(e => {
      const eDate = new Date(e.date);
      const eDateStr = eDate.toDateString();
      if (eDateStr === todayStr) {
        list.push({
          id: `event-${e.id}`,
          title: 'Class/Exam Scheduled Today',
          description: `"${e.title}" is scheduled today. Double-check your daily timetable matrix!`,
          time: 'Today',
          type: 'info',
          tab: 'calendar'
        });
      } else if (eDateStr === tomorrowStr) {
        list.push({
          id: `event-${e.id}`,
          title: 'Upcoming Event Tomorrow',
          description: `"${e.title}" starts tomorrow. Make sure you are prepared!`,
          time: 'Tomorrow',
          type: 'info',
          tab: 'calendar'
        });
      }
    });

    // 4. Reminders
    reminders.filter(r => r.active).forEach(r => {
      list.push({
        id: `reminder-${r.id}`,
        title: 'Active Reminder',
        description: `Reminder for "${r.title}". Click here to view details.`,
        time: 'Now',
        type: 'info',
        tab: 'reminders'
      });
    });

    // 5. Active alarms
    alarms.filter(a => a.enabled).forEach(a => {
      list.push({
        id: `alarm-${a.id}`,
        title: 'Alarms Clock Status',
        description: `Daily study alarm "${a.label || 'Alarm'}" will trigger at ${a.time}.`,
        time: 'Active',
        type: 'success',
        tab: 'alarms'
      });
    });

    return list.filter(n => !dismissedNotificationIds.includes(n.id));
  }, [tasks, backlogs, events, reminders, alarms, dismissedNotificationIds]);

  const renderSearchResultsList = (onItemClick: () => void) => {
    if (!searchQuery) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Search Results</span>
          <button 
            onClick={() => {
              setSearchQuery('');
              onItemClick();
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium"
          >
            Clear
          </button>
        </div>

        {!hasSearchResults && (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
            No matches found for <span className="font-semibold text-slate-800 dark:text-slate-300">"{searchQuery}"</span>
          </div>
        )}

        {filteredEvents.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-extrabold text-blue-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Calendar Events ({filteredEvents.length})
            </h4>
            <div className="space-y-1">
              {filteredEvents.map(event => (
                <button
                  key={event.id}
                  onClick={() => {
                    setActiveTab('calendar');
                    setSearchQuery('');
                    onItemClick();
                  }}
                  className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors flex items-center justify-between pointer-events-auto"
                >
                  <span className="text-sm text-slate-705 dark:text-slate-200 font-medium line-clamp-1">{event.title}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredTasks.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-extrabold text-brand-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
              To-Do List ({filteredTasks.length})
            </h4>
            <div className="space-y-1">
              {filteredTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => {
                    setActiveTab('tasks');
                    setSearchQuery('');
                    onItemClick();
                  }}
                  className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors flex flex-col pointer-events-auto"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={cn(
                      "text-sm font-medium line-clamp-1",
                      task.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-707 dark:text-slate-200"
                    )}>
                      {task.title}
                    </span>
                    <span className={cn(
                      "text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full shrink-0 ml-2",
                      task.priority === 'high' ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400" :
                      task.priority === 'medium' ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450" :
                      "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{task.description}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredBacklogs.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-extrabold text-violet-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              Backlogs ({filteredBacklogs.length})
            </h4>
            <div className="space-y-1">
              {filteredBacklogs.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab('backlogs');
                    setSearchQuery('');
                    onItemClick();
                  }}
                  className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors flex items-center justify-between pointer-events-auto"
                >
                  <span className="text-sm text-slate-707 dark:text-slate-200 font-medium line-clamp-1">{item.title}</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0 ml-2",
                    item.status === 'done' ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" :
                    item.status === 'in-progress' ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" :
                    "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  )}>
                    {item.status === 'in-progress' ? 'doing' : item.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredReminders.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-extrabold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Reminders ({filteredReminders.length})
            </h4>
            <div className="space-y-1">
              {filteredReminders.map(reminder => (
                <button
                  key={reminder.id}
                  onClick={() => {
                    setActiveTab('reminders');
                    setSearchQuery('');
                    onItemClick();
                  }}
                  className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors flex items-center justify-between pointer-events-auto"
                >
                  <span className={cn(
                    "text-sm font-medium line-clamp-1",
                    !reminder.active ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-707 dark:text-slate-200"
                  )}>
                    {reminder.title}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                    {reminder.time ? new Date(reminder.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-500">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out z-30",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <img src={coloredLogo} alt="Acadsistant Logo" className="w-8 h-8 rounded-lg object-contain" referrerPolicy="no-referrer" />
              <span className="text-xl font-display font-bold text-slate-900 dark:text-white">Acadsistant</span>
            </motion.div>
          )}
          {sidebarCollapsed && (
             <img src={coloredLogo} alt="Acadsistant Logo" className="w-8 h-8 rounded-lg object-contain mx-auto" referrerPolicy="no-referrer" />
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {tabs.map((tab) => (
            <SidebarItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <SidebarItem
            icon={Settings}
            label="Settings"
            onClick={() => setIsSettingsOpen(true)}
            collapsed={sidebarCollapsed}
          />
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mt-2 flex items-center w-full p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <Menu size={20} className={cn(sidebarCollapsed ? "mx-auto" : "mr-3")} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <img src={coloredLogo} alt="Acadsistant Logo" className="w-8 h-8 rounded-lg object-contain" referrerPolicy="no-referrer" />
          <span className="text-lg font-display font-bold text-slate-900 dark:text-white">Acadsistant</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-500 dark:text-slate-400">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-white dark:bg-slate-900 z-30 pt-20 px-6 md:hidden flex flex-col"
          >
            {/* Mobile Search input */}
            <div className="relative mb-4 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, events, backlogs..." 
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100 dark:bg-slate-800 border-transparent rounded-xl text-sm outline-none text-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {searchQuery ? (
              <div className="flex-1 overflow-y-auto pb-8 pr-1">
                {renderSearchResultsList(() => setMobileMenuOpen(false))}
              </div>
            ) : (
              <nav className="space-y-4 overflow-y-auto pb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center w-full p-4 rounded-xl text-lg font-medium",
                      activeTab === tab.id ? "bg-brand-500 text-white" : "text-slate-600 dark:text-slate-300"
                    )}
                  >
                    <tab.icon size={24} className="mr-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 md:pt-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 hidden md:flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, events, backlogs, reminders..." 
              className="w-full pl-10 pr-10 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-full text-sm focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            )}

            {/* Desktop Floating Search Results Dropdown */}
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-h-[480px] overflow-y-auto z-50 p-4 space-y-4 shadow-brand-500/5"
                >
                  {renderSearchResultsList(() => {})}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
              >
                <Bell size={20} />
                {dynamicNotifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>
              
              {/* Notification Dropdown Container */}
              <AnimatePresence>
                {isNotificationOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden shadow-brand-500/5"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm dark:text-white">Notifications</h3>
                          {dynamicNotifications.length > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-950/40 text-red-650 dark:text-red-400 text-[10px] font-extrabold rounded-full">
                              {dynamicNotifications.length} New
                            </span>
                          )}
                        </div>
                        {dynamicNotifications.length > 0 && (
                          <button 
                            onClick={() => {
                              const ids = dynamicNotifications.map(n => n.id);
                              setDismissedNotificationIds([...dismissedNotificationIds, ...ids]);
                            }}
                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-bold"
                          >
                            Dismiss All
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850 p-2 space-y-1">
                        {dynamicNotifications.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-2">
                            <BellOff className="text-slate-300 dark:text-slate-700" size={32} />
                            <p className="text-sm font-medium">All caught up!</p>
                            <p className="text-xs max-w-[200px] mx-auto text-slate-400">No new academic alerts or pending tasks needing priority.</p>
                          </div>
                        ) : (
                          dynamicNotifications.map((notif) => (
                            <div 
                              key={notif.id}
                              className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-all relative group flex gap-3 items-start"
                            >
                              <div className="mt-1.5 shrink-0">
                                {notif.type === 'urgent' && <span className="flex w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                                {notif.type === 'warning' && <span className="flex w-2 h-2 rounded-full bg-amber-500" />}
                                {notif.type === 'info' && <span className="flex w-2 h-2 rounded-full bg-blue-500" />}
                                {notif.type === 'success' && <span className="flex w-2 h-2 rounded-full bg-emerald-500" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                    {notif.title}
                                  </p>
                                  <span className="text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded text-right shrink-0">
                                    {notif.time}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                  {notif.description}
                                </p>
                                {notif.tab && (
                                  <button
                                    onClick={() => {
                                      if (notif.tab) {
                                        setActiveTab(notif.tab);
                                      }
                                      setIsNotificationOpen(false);
                                    }}
                                    className="text-[11px] text-brand-500 hover:text-brand-610 font-bold mt-2 inline-flex items-center gap-0.5 hover:underline"
                                  >
                                    View in {tabs.find(t => t.id === notif.tab)?.label} &rarr;
                                  </button>
                                )}
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDismissedNotificationIds([...dismissedNotificationIds, notif.id]);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-opacity rounded absolute right-2 top-2"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">
                  {userProfile.name || 'Alex Student'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {userProfile.course || 'BS Computer Science'}
                  {userProfile.yearLevel ? ` • ${userProfile.yearLevel}` : ' • 3rd Year'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 overflow-hidden">
                <User size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: darkMode ? 1.5 : 1,
                opacity: darkMode ? 0.3 : 0.1,
                x: darkMode ? 50 : 0,
                y: darkMode ? -50 : 0
              }}
              className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500 rounded-full blur-3xl transition-all duration-1000"
            ></motion.div>
            <motion.div 
              animate={{ 
                scale: darkMode ? 1.8 : 1,
                opacity: darkMode ? 0.25 : 0.1,
                x: darkMode ? -100 : 0,
                y: darkMode ? 100 : 0
              }}
              className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500 rounded-full blur-3xl transition-all duration-1000"
            ></motion.div>
            <motion.div 
              animate={{ 
                scale: darkMode ? 2 : 1,
                opacity: darkMode ? 0.2 : 0.1,
                y: darkMode ? -200 : 0
              }}
              className="absolute -bottom-24 left-1/2 w-64 h-64 bg-emerald-500 rounded-full blur-3xl transition-all duration-1000"
            ></motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto relative z-10"
            >
              {activeTab === 'dashboard' && <DashboardView tasks={tasks} reminders={reminders} backlogs={backlogs} events={events} userProfile={userProfile} eventCategories={eventCategories} classSchedules={classSchedules} setClassSchedules={setClassSchedules} onNavigate={setActiveTab} />}
              {activeTab === 'calendar' && <CalendarView events={events} setEvents={setEvents} eventCategories={eventCategories} setEventCategories={setEventCategories} />}
              {activeTab === 'tasks' && <TasksView tasks={tasks} setTasks={setTasks} categories={categories} setCategories={setCategories} />}
              {activeTab === 'backlogs' && <BacklogsView backlogs={backlogs} setBacklogs={setBacklogs} />}
              {activeTab === 'reminders' && <RemindersView reminders={reminders} setReminders={setReminders} events={events} setEvents={setEvents} />}
              {activeTab === 'alarms' && <AlarmsView alarms={alarms} setAlarms={setAlarms} />}
              {activeTab === 'timer' && <FocusTimerView courses={courses} focusSessions={focusSessions} setFocusSessions={setFocusSessions} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Onboarding Modal */}
      <Modal 
        isOpen={!userProfile.onboarded} 
        onClose={() => {}} 
        title={onboardingStep === 1 ? "Welcome to Acadsistant! 👋" : "Set Up Your Class Timetable 🗓️"}
        hideCloseButton
      >
        <div className="space-y-6">
          {onboardingStep === 1 ? (
            <>
              <p className="text-slate-600 dark:text-slate-400">
                Let's get to know you better. Tell us a bit about yourself to personalize your experience.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={tempProfile?.name || ''}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="input-base"
                    placeholder="e.g. Alex Student"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Course</label>
                  <input 
                    type="text" 
                    value={tempProfile?.course || ''}
                    onChange={(e) => setTempProfile({ ...tempProfile, course: e.target.value })}
                    className="input-base"
                    placeholder="e.g. BS Computer Science"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Year Level</label>
                    <select 
                      value={tempProfile?.yearLevel || ''}
                      onChange={(e) => setTempProfile({ ...tempProfile, yearLevel: e.target.value })}
                      className="input-base bg-white dark:bg-slate-900"
                    >
                      <option value="">Select Year Level</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                      <option value="6th Year">6th Year</option>
                      <option value="Irregular">Irregular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Age</label>
                    <input 
                      type="number" 
                      value={tempProfile?.age || ''}
                      onChange={(e) => setTempProfile({ ...tempProfile, age: e.target.value })}
                      className="input-base"
                      placeholder="e.g. 20"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  const nameVal = tempProfile?.name || '';
                  const courseVal = tempProfile?.course || '';
                  if (nameVal.trim() && courseVal.trim()) {
                    setOnboardingStep(2);
                  }
                }}
                disabled={!(tempProfile?.name || '').trim() || !(tempProfile?.course || '').trim()}
                className="w-full py-4 bg-brand-500 disabled:opacity-50 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-200"
              >
                Next: Class Schedule 🗓️
              </button>
            </>
          ) : (
            <>
              <p className="text-slate-600 dark:text-slate-400">
                Plot your classes and courses below to populate your weekly timetable. You can skip and do this at any time!
              </p>
              
              <div className="space-y-4">
                {/* Class Creator Row */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Subject Name or Code</label>
                    <input 
                      type="text" 
                      value={onboardSubject}
                      onChange={(e) => setOnboardSubject(e.target.value)}
                      className="input-base bg-white dark:bg-slate-900"
                      placeholder="e.g. CS101 - Programming"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Day</label>
                      <select 
                        value={onboardDay}
                        onChange={(e) => setOnboardDay(e.target.value as any)}
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
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Room / Venue</label>
                      <input 
                        type="text" 
                        value={onboardRoom}
                        onChange={(e) => setOnboardRoom(e.target.value)}
                        className="input-base bg-white dark:bg-slate-900"
                        placeholder="e.g. Room 302"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Start Time</label>
                      <input 
                        type="time" 
                        value={onboardStartTime}
                        onChange={(e) => setOnboardStartTime(e.target.value)}
                        className="input-base bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">End Time</label>
                      <input 
                        type="time" 
                        value={onboardEndTime}
                        onChange={(e) => setOnboardEndTime(e.target.value)}
                        className="input-base bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (!onboardSubject.trim()) return;
                      const newItem: ClassScheduleItem = {
                        id: Math.random().toString(36).substr(2, 9),
                        subject: onboardSubject.trim(),
                        day: onboardDay,
                        startTime: onboardStartTime,
                        endTime: onboardEndTime,
                        room: onboardRoom.trim() || undefined
                      };
                      setOnboardSchedules([...onboardSchedules, newItem]);
                      setOnboardSubject('');
                      setOnboardRoom('');
                    }}
                    disabled={!onboardSubject.trim()}
                    className="w-full py-2 bg-slate-900 dark:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} /> Add Class To Draft
                  </button>
                </div>

                {/* Draft list preview */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Draft Schedule ({onboardSchedules.length})</span>
                  <div className="max-h-28 overflow-y-auto space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-1.5 pr-1">
                    {onboardSchedules.length > 0 ? (
                      onboardSchedules.map((cls) => (
                        <div key={cls.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-850">
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[180px]">{cls.subject}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {cls.day} • {cls.startTime} - {cls.endTime} {cls.room ? `• ${cls.room}` : ''}
                            </p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setOnboardSchedules(onboardSchedules.filter(s => s.id !== cls.id))}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium py-4 text-center italic">No class routes added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Completing actions */}
              <div className="flex gap-4 items-center pt-2">
                <button 
                  onClick={() => {
                    setUserProfile({ ...tempProfile, onboarded: true });
                    setClassSchedules(onboardSchedules);
                  }}
                  className="px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition whitespace-nowrap"
                >
                  Do It Later
                </button>
                <button 
                  onClick={() => {
                    setUserProfile({ ...tempProfile, onboarded: true });
                    setClassSchedules(onboardSchedules);
                  }}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs transition shadow-md shadow-brand-100 dark:shadow-none"
                >
                  Save & Get Started
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        title="Settings"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={tempProfile?.name || ''}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Course</label>
              <input 
                type="text" 
                value={tempProfile?.course || ''}
                onChange={(e) => setTempProfile({ ...tempProfile, course: e.target.value })}
                className="input-base"
                placeholder="e.g. BS Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Year Level</label>
                <select 
                  value={tempProfile?.yearLevel || ''}
                  onChange={(e) => setTempProfile({ ...tempProfile, yearLevel: e.target.value })}
                  className="input-base bg-white dark:bg-slate-900"
                >
                  <option value="">Select Year Level</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="6th Year">6th Year</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Age</label>
                <input 
                  type="number" 
                  value={tempProfile?.age || ''}
                  onChange={(e) => setTempProfile({ ...tempProfile, age: e.target.value })}
                  className="input-base"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Local Database Backup
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Save your classes, timetable, and study schedules locally, or restore a backup file anytime.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={exportBackupData}
                  className="px-4 py-2.5 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download size={14} /> Export Backup
                </button>
                
                <label className="px-4 py-2.5 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs">
                  <Upload size={14} /> Import Backup
                  <input
                    type="file"
                    accept=".json"
                    onChange={importBackupData}
                    className="hidden"
                  />
                </label>
              </div>

              {backupStatus && (
                <div className={cn(
                  "p-2.5 rounded-xl text-xs font-semibold text-center mt-2 animate-fade-in",
                  backupStatus.type === 'success' 
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30" 
                    : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                )}>
                  {backupStatus.message}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="text-center pb-2">
              <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                Made with <Heart size={10} className="fill-red-500 text-red-500 animate-pulse" /> by{' '}
                <a 
                  href="https://github.com/zendotexe" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-500 hover:text-brand-600 font-semibold inline-flex items-center gap-0.5 hover:underline"
                >
                  Marco Sebastian Senarillos/zen.exe
                  <ExternalLink size={10} />
                </a>
              </p>
            </div>
            <button 
              onClick={() => {
                setUserProfile(tempProfile);
                setIsSettingsOpen(false);
              }}
              className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Persistent, Uncloseable Feedback Pop-Up */}
      <div className="fixed bottom-4 right-4 z-50 w-80 max-w-sm">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex gap-3.5 items-start">
          <div className="p-2.5 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-brand-500 shrink-0">
            <MessageSquare size={20} />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">Feedback & Suggestions</h4>
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              Hello! I built Acadsistant as a solo project to help students stay organized. If you spot any bugs, have suggestions, or want to share comments, please let me know!
            </p>
            <a 
              href="https://forms.gle/2AeYFUpWymuwWz6p6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 py-2 px-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition shadow-xs hover:shadow-md"
            >
              Share Feedback
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

