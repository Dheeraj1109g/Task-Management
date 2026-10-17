"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to 'dark' mode as requested by the user
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pulseflow_theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
        if (saved === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        setThemeState("dark");
        document.documentElement.classList.add("dark");
        localStorage.setItem("pulseflow_theme", "dark");
      }
    } catch {
      setThemeState("dark");
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("pulseflow_theme", newTheme);
    } catch {}
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`flex items-center justify-center p-2 rounded-full transition-colors cursor-pointer ${
        theme === "dark"
          ? "bg-[#111724] hover:bg-[#182133] text-amber-300 hover:text-amber-200"
          : "bg-slate-200 hover:bg-slate-300 text-slate-800 hover:text-slate-900"
      } ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 stroke-[2.5]" />
      ) : (
        <Moon className="w-4 h-4 stroke-[2.5]" />
      )}
    </button>
  );
}
