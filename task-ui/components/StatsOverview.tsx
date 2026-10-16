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
      textColor: "text-slate-950",
      accentBg: "bg-[#d2f801]/30",
      iconColor: "text-slate-950",
      borderColor: activeFilter === "" ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md" : "border-slate-200/90",
    },
    {
      label: "To Do",
      count: todo,
      value: "todo" as const,
      icon: Clock,
      textColor: "text-sky-700",
      accentBg: "bg-sky-100",
      iconColor: "text-sky-600",
      borderColor: activeFilter === "todo" ? "border-sky-500 ring-2 ring-sky-500/20 shadow-md" : "border-slate-200/90",
    },
    {
      label: "In Progress",
      count: inProgress,
      value: "in_progress" as const,
      icon: TrendingUp,
      textColor: "text-amber-700",
      accentBg: "bg-amber-100",
      iconColor: "text-amber-600",
      borderColor: activeFilter === "in_progress" ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md" : "border-slate-200/90",
    },
    {
      label: "Completed",
      count: done,
      value: "done" as const,
      icon: CheckCircle2,
      textColor: "text-slate-950",
      accentBg: "bg-[#d2f801]/30",
      iconColor: "text-slate-950",
      borderColor: activeFilter === "done" ? "border-[#bfe700] ring-2 ring-[#d2f801]/40 shadow-md" : "border-slate-200/90",
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
              className={`relative overflow-hidden text-left p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50/80 border transition-all duration-200 shadow-sm cursor-pointer ${item.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl ${item.accentBg} ${item.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${item.textColor}`}>
                  {item.count}
                </span>
                {item.value === "done" && total > 0 && (
                  <span className="text-xs font-black text-black bg-[#d2f801] px-2 py-0.5 rounded-full shadow-xs">
                    {completionRate}%
                  </span>
                )}
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d2f801]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sprint Completion Velocity:</span>
            <span className="font-bold text-slate-900">{done} of {total} tasks completed ({completionRate}%)</span>
          </div>
          <div className="w-full sm:w-64 h-2.5 rounded-full bg-slate-100 overflow-hidden flex ring-1 ring-slate-200/60">
            <div
              className="bg-[#d2f801] transition-all duration-500"
              style={{ width: `${completionRate}%` }}
              title={`Done: ${done}`}
            />
            <div
              className="bg-amber-400 transition-all duration-500"
              style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
              title={`In Progress: ${inProgress}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
