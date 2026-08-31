"use client";

import { useState } from "react";
import { CheckSquare, Square, Plus, Trash2, AlertCircle } from "lucide-react";

export type TaskItem = {
  id: string;
  title: string;
  done: boolean;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
};

export default function TasksWidget({
  tasks,
  setTasks,
}: {
  tasks: TaskItem[];
  setTasks: (t: TaskItem[] | ((prev: TaskItem[]) => TaskItem[])) => void;
}) {
  const [newTitle, setNewTitle] = useState("");

  function toggle(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }
  function add() {
    if (!newTitle.trim()) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title: newTitle.trim(), done: false }]);
    setNewTitle("");
  }

  const pending = tasks.filter((t) => !t.done).length;

  return (
    <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-md mb-6 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-extrabold text-lg text-amber-900 flex items-center gap-2">
          <AlertCircle size={20} className="text-amber-600" />
          משימות לטיפול
          {pending > 0 && (
            <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pending} פתוחות</span>
          )}
        </h2>
        <span className="text-xs text-amber-700 bg-white/80 rounded-full px-2 py-1">דף הבית • בולט</span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <label
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              task.done ? "bg-green-50 border-green-200 opacity-60" : "bg-white border-amber-200 hover:border-amber-400"
            }`}
          >
            <button onClick={() => toggle(task.id)} className="shrink-0">
              {task.done ? <CheckSquare size={20} className="text-green-600" /> : <Square size={20} className="text-amber-500" />}
            </button>
            <span className={`flex-1 text-sm font-medium ${task.done ? "line-through text-gray-500" : "text-gray-800"}`}>
              {task.title}
            </span>
            <button onClick={() => remove(task.id)} className="shrink-0 text-gray-400 hover:text-red-600 p-1">
              <Trash2 size={14} />
            </button>
          </label>
        ))}

        {tasks.length === 0 && <p className="text-sm text-gray-500 text-center py-3">אין משימות פתוחות 🎉</p>}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="הוסיפי משימה חדשה..."
          className="flex-1 border border-amber-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        />
        <button onClick={add} className="btn bg-amber-600 text-white hover:bg-amber-700 rounded-xl px-4 flex items-center gap-1">
          <Plus size={16} /> הוסיפי
        </button>
      </div>
    </div>
  );
}
