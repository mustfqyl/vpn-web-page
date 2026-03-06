"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    mounted: boolean;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

        if (savedTheme) {
            setThemeState(savedTheme);
        } else {
            setThemeState(systemTheme);
        }

        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (theme === "light") {
            document.documentElement.classList.add("light");
            document.body.classList.add("light");
        } else {
            document.documentElement.classList.remove("light");
            document.body.classList.remove("light");
        }
        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, mounted, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
