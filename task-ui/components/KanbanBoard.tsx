"use client";

import React from "react";
import { Plus, Clock, TrendingUp, CheckCircle2, ArrowRight, ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { Task, TaskStatus } from "@/lib/api";

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateStatus: (id: number, status: TaskStatus) => Promise<void>;
  onEdit: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  onQuickAdd: (status: TaskStatus) => void;
  isBusyId?: number | null;
}

export function KanbanBoard({
  tasks,
  onUpdateStatus,
  onEdit,
  onDeleteRequest,
  onQuickAdd,
  isBusyId = null,
}: KanbanBoardProps) {
  const columns: {
    id: TaskStatus;
    title: string;
    icon: typeof Clock;
    color: string;
    bgHeader: string;
    badgeColor: string;
  }[] = [
    {
      id: "todo",
      title: "To Do",
      icon: Clock,
      color: "text-sky-400",
      bgHeader: "bg-sky-500/10 border-sky-500/20",
      badgeColor: "bg-sky-500/20 text-sky-300",
    },
    {
      id: "in_progress",
      title: "In Progress",
      icon: TrendingUp,
      color: "text-amber-400",
      bgHeader: "bg-amber-500/10 border-amber-500/20",
      badgeColor: "bg-amber-500/20 text-amber-300",
    },
    {
      id: "done",
      title: "Completed",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgHeader: "bg-emerald-500/10 border-emerald-500/20",
      badgeColor: "bg-emerald-500/20 text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl bg-slate-900/30 border border-slate-800/80 p-3.5 min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-xl border ${col.bgHeader} mb-3.5`}>
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${col.color}`} />
                <h3 className="font-semibold text-sm text-slate-200">{col.title}</h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                {colTasks.length}
              </span>
            </div>

            {/* Task list in column */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[70vh] pr-1">
              {colTasks.map((t) => {
                const isBusy = isBusyId === t.id;
                let dueText: string | null = null;
                let isOverdue = false;
                if (t.due_date) {
                  const d = new Date(t.due_date);
                  isOverdue = d.getTime() < Date.now() && t.status !== "done";
                  dueText = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                }

                return (
                  <div
                    key={t.id}
                    className={`group relative rounded-xl border p-3.5 bg-slate-950/70 border-slate-800/90 hover:border-slate-700 transition-all shadow-sm ${
                      isBusy ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm text-slate-100 leading-snug break-words flex-1">
                        {t.title}
                      </h4>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(t)}
                          title="Edit"
                          className="p-1 text-slate-400 hover:text-indigo-300 rounded hover:bg-slate-800 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRequest(t)}
                          title="Delete"
                          className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {t.description && (
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2 break-words">
                        {t.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-900 text-xs text-slate-400">
                      {dueText ? (
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            isOverdue
                              ? "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                              : "bg-slate-800/90 text-slate-300"
                          }`}
                        >
                          {isOverdue ? `Overdue (${dueText})` : `Due ${dueText}`}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-600">No due date</span>
                      )}

                      {/* Directional Shift Buttons */}
                      <div className="flex items-center gap-1">
                        {col.id !== "todo" && (
                          <button
                            disabled={isBusy}
                            onClick={() =>
                              onUpdateStatus(t.id, col.id === "done" ? "in_progress" : "todo")
                            }
                            title="Move left"
                            className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {col.id !== "done" && (
                          <button
                            disabled={isBusy}
                            onClick={() =>
                              onUpdateStatus(t.id, col.id === "todo" ? "in_progress" : "done")
                            }
                            title="Move right"
                            className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="py-8 text-center border-2 border-dashed border-slate-800/60 rounded-xl">
                  <p className="text-xs text-slate-500">No tasks in this lane</p>
                </div>
              )}
            </div>

            {/* Quick add button in column */}
            <button
              onClick={() => onQuickAdd(col.id)}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-dashed border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add task
            </button>
          </div>
        );
      })}
    </div>
  );
}
