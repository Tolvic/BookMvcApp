// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// Dark Mode Toggle Functionality
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Get saved theme from localStorage or detect system preference
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = this.getSystemTheme();
        const initialTheme = savedTheme || systemTheme;
        
        this.setTheme(initialTheme);
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        // Add event listener for theme toggle button
        document.addEventListener('DOMContentLoaded', () => {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }
        });
    }

    getSystemTheme() {
        // Check if the browser supports prefers-color-scheme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    watchSystemTheme() {
        // Only watch system theme if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            if (window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                mediaQuery.addEventListener('change', (e) => {
                    // Only update if user hasn't manually set a theme
                    if (!localStorage.getItem('theme')) {
                        this.setTheme(e.matches ? 'dark' : 'light', false);
                    }
                });
            }
        }
    }

    setTheme(theme, savePreference = true) {
        const html = document.documentElement;
        const themeToggle = document.getElementById('theme-toggle');
        
        if (theme === 'dark') {
            html.setAttribute('data-bs-theme', 'dark');
            if (themeToggle) {
                themeToggle.innerHTML = '<span class="theme-icon">☀️</span> Light';
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
            }
        } else {
            html.setAttribute('data-bs-theme', 'light');
            if (themeToggle) {
                themeToggle.innerHTML = '<span class="theme-icon">🌙</span> Dark';
                themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
        
        // Save theme preference only when explicitly set by user
        if (savePreference) {
            localStorage.setItem('theme', theme);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme, true); // Always save when user manually toggles
    }

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-bs-theme') || 'light';
    }

    // Method to reset to system preference
    resetToSystemTheme() {
        localStorage.removeItem('theme');
        const systemTheme = this.getSystemTheme();
        this.setTheme(systemTheme, false);
        this.watchSystemTheme(); // Re-enable system theme watching
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();
