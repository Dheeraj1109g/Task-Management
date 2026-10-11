"use client";

import React from "react";
import { CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";
import { TaskStats, TaskStatus } from "@/lib/api";

interface StatsOverviewProps {
  stats: TaskStats | null;
  activeFilter: TaskStatus | "";
  onSelectFilter: (status: TaskStatus | "") => void;
}

export function StatsOverview({ stats, activeFilter, onSelectFilter }: StatsOverviewProps) {
  const total = stats?.total ?? 0;
  const todo = stats?.todo ?? 0;
  const inProgress = stats?.in_progress ?? 0;
  const done = stats?.done ?? 0;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const items = [
    {
      label: "Total Tasks",
      count: total,
      value: "" as const,
      icon: ListTodo,
      textColor: "text-slate-100",
      accentBg: "bg-slate-800/60",
      iconColor: "text-indigo-400",
      borderColor: activeFilter === "" ? "border-indigo-500/80 ring-2 ring-indigo-500/20" : "border-slate-800/80",
    },
    {
      label: "To Do",
      count: todo,
      value: "todo" as const,
      icon: Clock,
      textColor: "text-sky-300",
      accentBg: "bg-sky-500/10",
      iconColor: "text-sky-400",
      borderColor: activeFilter === "todo" ? "border-sky-500/80 ring-2 ring-sky-500/20" : "border-slate-800/80",
    },
    {
      label: "In Progress",
      count: inProgress,
      value: "in_progress" as const,
      icon: TrendingUp,
      textColor: "text-amber-300",
      accentBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      borderColor: activeFilter === "in_progress" ? "border-amber-500/80 ring-2 ring-amber-500/20" : "border-slate-800/80",
    },
    {
      label: "Completed",
      count: done,
      value: "done" as const,
      icon: CheckCircle2,
      textColor: "text-emerald-300",
      accentBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      borderColor: activeFilter === "done" ? "border-emerald-500/80 ring-2 ring-emerald-500/20" : "border-slate-800/80",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.value;

          return (
            <button
              key={item.label}
              onClick={() => onSelectFilter(item.value)}
              className={`relative overflow-hidden text-left p-4 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border transition-all duration-200 cursor-pointer ${item.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl ${item.accentBg} ${item.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${item.textColor}`}>
                  {item.count}
                </span>
                {item.value === "done" && total > 0 && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {completionRate}%
                  </span>
                )}
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Overall Progress:</span>
            <span className="font-semibold text-slate-200">{done} of {total} tasks completed</span>
          </div>
          <div className="w-full sm:w-64 h-2 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
              title={`Done: ${done}`}
            />
            <div
              className="bg-amber-500 transition-all duration-500"
              style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
              title={`In Progress: ${inProgress}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
