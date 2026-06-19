import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Layers, 
  Bell, 
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
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, BacklogItem, Reminder, Alarm, CalendarEvent, UserProfile, EventCategory, Course, FocusSession } from './types';
import { Modal } from './components/Modal';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        profile: JSON.parse(localStorage.getItem('acadsistant-profile') || '{"name":"","age":"","major":"","onboarded":false}'),
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
    major: '',
    onboarded: false
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);

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
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
              <span className="text-xl font-display font-bold text-slate-900 dark:text-white">Acadsistant</span>
            </motion.div>
          )}
          {sidebarCollapsed && (
             <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold mx-auto">A</div>
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
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
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
            className="fixed inset-0 bg-white dark:bg-slate-900 z-30 pt-20 px-6 md:hidden"
          >
            <nav className="space-y-4">
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
              placeholder="Search tasks, events, notes..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-full text-sm focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">
                  {userProfile.name || 'Alex Student'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {userProfile.major || 'Computer Science Major'}
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
              {activeTab === 'dashboard' && <DashboardView tasks={tasks} reminders={reminders} backlogs={backlogs} events={events} userProfile={userProfile} eventCategories={eventCategories} />}
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
        title="Welcome to Acadsistant! 👋"
        hideCloseButton
      >
        <div className="space-y-6">
          <p className="text-slate-600 dark:text-slate-400">
            Let's get to know you better. Tell us a bit about yourself to personalize your experience.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="input-base"
                placeholder="e.g. Alex Student"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Age</label>
                <input 
                  type="number" 
                  value={tempProfile.age}
                  onChange={(e) => setTempProfile({ ...tempProfile, age: e.target.value })}
                  className="input-base"
                  placeholder="e.g. 20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Major</label>
                <input 
                  type="text" 
                  value={tempProfile.major}
                  onChange={(e) => setTempProfile({ ...tempProfile, major: e.target.value })}
                  className="input-base"
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              if (tempProfile.name && tempProfile.major) {
                setUserProfile({ ...tempProfile, onboarded: true });
              }
            }}
            className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-200"
          >
            Get Started
          </button>
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
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="input-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Age</label>
                <input 
                  type="number" 
                  value={tempProfile.age}
                  onChange={(e) => setTempProfile({ ...tempProfile, age: e.target.value })}
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Major</label>
                <input 
                  type="text" 
                  value={tempProfile.major}
                  onChange={(e) => setTempProfile({ ...tempProfile, major: e.target.value })}
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
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
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
    </div>
  );
}

