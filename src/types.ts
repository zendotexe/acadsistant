export interface UserProfile {
  name: string;
  age: string;
  major: string;
  onboarded: boolean;
}

export type Priority = 'low' | 'medium' | 'high';

export interface EventCategory {
  id: string;
  name: string;
  color: string; // Tailwind base color name (e.g., 'blue', 'red', 'amber')
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string (start date/time)
  endDate?: string; // ISO string (optional end date/time)
  isAllDay?: boolean;
  categoryId: string;
  type?: 'class' | 'exam' | 'meeting' | 'lab' | 'reminder' | 'other'; // Keeping for backward compatibility if needed, but moving to categoryId
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO string for consistency
  priority: Priority;
  category: string;
}

export interface BacklogItem {
  id: string;
  title: string;
  estimatedHours: number;
  status: 'todo' | 'in-progress' | 'done';
}

export interface Reminder {
  id: string;
  title: string;
  time: Date;
  active: boolean;
}

export interface Alarm {
  id: string;
  time: string; // HH:mm
  days: number[]; // 0-6
  enabled: boolean;
  label: string;
}

export interface Assignment {
  id: string;
  name: string;
  weight: number; // percentage, e.g. 20
  score?: number; // actual score
  maxScore: number; // e.g. 100
}

export interface Course {
  id: string;
  code: string; // e.g. CS101
  name: string;
  credits: number;
  assignments: Assignment[];
  targetGrade?: number;
}

export interface FocusSession {
  id: string;
  date: string; // ISO String
  durationMinutes: number;
  courseId?: string; // Optional linked course
  category: 'work' | 'short-break' | 'long-break';
}
