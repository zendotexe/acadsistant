import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Plus, 
  Trash2, 
  ChevronDown, 
  Tag, 
  Clock,
  Filter,
  AlertCircle,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Task, Priority } from '../types';
import { Modal } from './Modal';
import { format, isAfter, parseISO, isBefore, addDays } from 'date-fns';
import { motion } from 'motion/react';

interface TasksViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
}

export function TasksView({ tasks, setTasks, categories, setCategories }: TasksViewProps) {
  const [filter, setFilter] = useState('all');
  const [deadlineFilter, setDeadlineFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    category: categories[0] || 'General', 
    priority: 'medium' as Priority,
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [newCategory, setNewCategory] = useState('');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    
    let finalCategory = newTask.category;
    // If user typed a new category that doesn't exist
    if (newTask.category === 'new' && newCategory) {
      if (!categories.includes(newCategory)) {
        setCategories([...categories, newCategory]);
      }
      finalCategory = newCategory;
    }
    
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      category: finalCategory,
      priority: newTask.priority,
      completed: false,
      dueDate: newTask.dueDate,
    };
    
    setTasks([task, ...tasks]);
    setNewTask({ 
      title: '', 
      category: categories[0] || 'General', 
      priority: 'medium',
      dueDate: format(new Date(), 'yyyy-MM-dd')
    });
    setNewCategory('');
    setIsModalOpen(false);
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || categories.includes(newCategory)) return;
    setCategories([...categories, newCategory]);
    setNewCategory('');
    setIsCategoryModalOpen(false);
  };

  const filteredTasks = tasks.filter(t => {
    // Status filter
    if (filter === 'completed' && !t.completed) return false;
    if (filter === 'active' && t.completed) return false;

    // Deadline filter
    if (deadlineFilter !== 'all' && !t.dueDate) return false;
    if (t.dueDate) {
      const dueDate = parseISO(t.dueDate);
      const now = new Date();
      if (deadlineFilter === 'overdue' && !isBefore(dueDate, now)) return false;
      if (deadlineFilter === 'today' && !isSameDay(dueDate, now)) return false;
      if (deadlineFilter === 'upcoming' && !isAfter(dueDate, now)) return false;
    }

    return true;
  });

  function isSameDay(d1: Date, d2: Date) {
    return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl dark:text-white">To-Do List</h1>
          <p className="text-slate-500 dark:text-slate-400">Keep track of your assignments and daily goals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Tag size={18} /> Categories
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200 flex items-center gap-2"
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {['All', 'Active', 'Completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f.toLowerCase())}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all",
                filter === f.toLowerCase() ? "bg-brand-500 text-white shadow-md shadow-brand-200" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-brand-500 transition-all">
              <Filter size={16} />
              <span>Deadlines: {deadlineFilter.charAt(0).toUpperCase() + deadlineFilter.slice(1)}</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-20 p-2">
              {['All', 'Today', 'Upcoming', 'Overdue'].map(d => (
                <button 
                  key={d}
                  onClick={() => setDeadlineFilter(d.toLowerCase())}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-xl text-sm transition-colors",
                    deadlineFilter === d.toLowerCase() ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <div key={task.id} className={cn(
            "surface p-4 rounded-2xl flex items-center gap-4 transition-all group",
            task.completed ? "opacity-60" : "hover:shadow-md hover:border-brand-200"
          )}>
            <button 
              onClick={() => toggleTask(task.id)}
              className={cn(
                "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-700 hover:border-brand-500"
              )}
            >
              {task.completed && <CheckSquare size={16} />}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={cn("font-semibold text-slate-900 dark:text-white truncate", task.completed && "line-through text-slate-400 dark:text-slate-500")}>{task.title}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                {task.dueDate && (
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 px-2 py-0.5 rounded-full",
                    isBefore(parseISO(task.dueDate), new Date()) && !task.completed
                      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  )}>
                    <Clock size={10} /> {format(parseISO(task.dueDate), 'MMM d')}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full">{task.category}</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  task.priority === 'high' ? "text-red-500" : task.priority === 'medium' ? "text-amber-500" : "text-blue-500"
                )}>
                  {task.priority}
                </span>
              </div>
            </div>
            <button 
              onClick={() => deleteTask(task.id)}
              className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )) : (
          <div className="text-center py-20 surface rounded-[2.5rem] border-dashed">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No tasks found. Time to relax! ☕</p>
          </div>
        )}
      </div>

      {/* New Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={addTask} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Task Title</label>
            <input 
              autoFocus
              type="text" 
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="input-base"
              placeholder="e.g. Study for Midterms"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select 
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className="input-base"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="new">+ Add New Category</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
              <select 
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                className="input-base"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {newTask.category === 'new' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1.5"
            >
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">New Category Name</label>
              <input 
                type="text" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input-base"
                placeholder="Enter category name..."
              />
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Due Date</label>
            <input 
              type="date" 
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="input-base"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-200 mt-4"
          >
            Create Task
          </button>
        </form>
      </Modal>

      {/* Categories Modal */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Manage Categories">
        <div className="space-y-6">
          <form onSubmit={addCategory} className="flex gap-2">
            <input 
              type="text" 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="input-base"
              placeholder="New category name..."
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors"
            >
              Add
            </button>
          </form>
          
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Existing Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                  <button 
                    onClick={() => setCategories(categories.filter(c => c !== cat))}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
