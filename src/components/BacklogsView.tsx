import React, { useState } from 'react';
import { Plus, MoreVertical, Trash2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { BacklogItem } from '../types';
import { Modal } from './Modal';

interface BacklogsViewProps {
  backlogs: BacklogItem[];
  setBacklogs: (backlogs: BacklogItem[]) => void;
}

export function BacklogsView({ backlogs, setBacklogs }: BacklogsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', estimatedHours: 0 });

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title) return;

    const item: BacklogItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: newItem.title,
      estimatedHours: newItem.estimatedHours || 0,
      status: 'todo',
    };

    setBacklogs([...backlogs, item]);
    setNewItem({ title: '', estimatedHours: 0 });
    setIsModalOpen(false);
  };

  const deleteItem = (id: string) => {
    setBacklogs(backlogs.filter(item => item.id !== id));
  };

  const updateStatus = (id: string, status: BacklogItem['status']) => {
    setBacklogs(backlogs.map(item => item.id === id ? { ...item, status } : item));
  };

  const columns: { id: BacklogItem['status']; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl dark:text-white font-display font-bold">Backlogs</h1>
          <p className="text-slate-500 dark:text-slate-400">Long-term projects and tasks that need attention eventually.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200 flex items-center gap-2"
        >
          <Plus size={18} /> Add Item
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <div key={column.id} className="bg-slate-100/50 dark:bg-slate-900/50 p-4 rounded-3xl min-h-[500px] flex flex-col border border-transparent">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-slate-600 dark:text-slate-400 uppercase text-xs tracking-widest">{column.label}</h3>
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {backlogs.filter(item => item.status === column.id).length}
              </span>
            </div>
            
            <div className="space-y-4 flex-1">
              {backlogs.filter(item => item.status === column.id).map(item => (
                <div key={item.id} className="surface p-4 rounded-2xl group hover:border-brand-300">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                    <div className="relative group/menu">
                      <button className="p-1 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                        <MoreVertical size={14} />
                      </button>
                      {/* Invisible bridge to prevent hover flicker */}
                      <div className="absolute right-0 top-full h-2 w-full z-20" />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all z-30 p-1">
                        {columns.filter(c => c.id !== item.status).map(c => (
                          <button 
                            key={c.id}
                            onClick={() => updateStatus(item.id, c.id)}
                            className="w-full text-left px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            Move to {c.label}
                          </button>
                        ))}
                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-brand-600 dark:text-brand-400">AS</div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {item.estimatedHours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Backlog Item">
        <form onSubmit={addItem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Title</label>
            <input 
              autoFocus
              type="text" 
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="input-base"
              placeholder="e.g. Research Paper: AI Ethics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estimated Hours</label>
            <input 
              type="number" 
              value={newItem.estimatedHours}
              onChange={(e) => setNewItem({ ...newItem, estimatedHours: parseInt(e.target.value) || 0 })}
              className="input-base"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200 mt-4"
          >
            Add to Backlog
          </button>
        </form>
      </Modal>
    </div>
  );
}
