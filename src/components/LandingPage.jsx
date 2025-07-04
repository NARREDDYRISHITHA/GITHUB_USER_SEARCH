import React from "react";

export default function LandingPage({ onStart, darkMode, setDarkMode }) {
    return (
        <div className={`flex flex-col items-center justify-center min-h-screen transition-colors ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
                <div className="flex justify-center mb-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
                        <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.08.79 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56C20.71 21.45 24 17.12 24 12.02 24 5.74 18.27.5 12 .5z" />
                    </svg>
                </div>
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm font-semibold"
                    >
                        {darkMode ? 'Light' : 'Dark'} Mode
                    </button>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-300 tracking-tight">GitHub User Search</h1>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                    Discover developers, explore their work, and get inspired.<br />
                    <span className="inline-block mt-2 text-base text-purple-700 dark:text-purple-300 font-semibold">
                        Your window into the open-source world.
                    </span>
                </p>
                <div className="mb-6">
                    <ul className="space-y-2 text-left text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2">
                            <span role="img" aria-label="search">🔍</span>
                            Lightning-fast GitHub username search
                        </li>
                        <li className="flex items-center gap-2">
                            <span role="img" aria-label="profile">👤</span>
                            Detailed user profiles
                        </li>
                        <li className="flex items-center gap-2">
                            <span role="img" aria-label="star">⭐</span>
                            Instantly see top repositories by popularity
                        </li>
                        <li className="flex items-center gap-2">
                            <span role="img" aria-label="palette">🎨</span>
                            Elegant toggle mode & mobile-first design
                        </li>
                    </ul>
                </div>
                <button
                    onClick={onStart}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                >
                    Get Started
                </button>
            </div>
            <footer className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
                <div>
                    <span>© {new Date().getFullYear()} GitHub User Search</span>
                    <span className="mx-2">|</span>
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-black dark:text-white hover:text-blue-700 dark:hover:text-blue-300"
                        style={{ textDecoration: "none" }}
                    >
                        Visit GitHub
                    </a>
                </div>
            </footer>
        </div>
    );
}