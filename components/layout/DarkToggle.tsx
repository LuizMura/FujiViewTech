"use client";
import { useEffect, useState } from "react";

export default function DarkToggle() {
  const [mode, setMode] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [mode]);

  function toggle() {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }
  return (
    <button onClick={toggle} className="px-2 py-1 border rounded">
      {mode === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
