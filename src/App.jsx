import { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import UserProfile from './components/UserProfile';
import RepoList from './components/RepoList';
import LandingPage from './components/LandingPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const fetchGitHubData = async (username) => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
      const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error('User not found');
        } else if (userRes.status === 403) {
          const errorData = await userRes.json();
          if (errorData && errorData.message && errorData.message.includes('API rate limit exceeded')) {
            throw new Error('GitHub API rate limit exceeded. Please try again later or authenticate.');
          } else {
            throw new Error('Access forbidden by GitHub API.');
          }
        } else {
          throw new Error(`GitHub API error: ${userRes.status} ${userRes.statusText}`);
        }
      }
      const userData = await userRes.json();
      setUser(userData);
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message);
      }
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  async function fetchAllRepos(reposUrl, headers) {
    let allRepos = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(`${reposUrl}?per_page=${perPage}&page=${page}`, { headers });
      const repos = await res.json();
      allRepos = allRepos.concat(repos);
      if (repos.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }
    return allRepos;
  }
  useEffect(() => {
    if (!user) return;
    async function getRepos() {
      const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
      const allRepos = await fetchAllRepos(user.repos_url, headers);
      const topRepos = allRepos
        .filter(repo => !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map(repo => ({
          ...repo,
          lastModified: repo.updated_at
            ? new Date(repo.updated_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
            : "N/A"
        }));
      setRepos(topRepos);
    }
    getRepos();
  }, [user]);
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className={darkMode ? 'dark bg-gray-900 text-white min-h-screen p-2 sm:p-4' : 'bg-gray-100 min-h-screen p-2 sm:p-4'}>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">GitHub User Search</h1>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-800 dark:text-white"
              aria-label="GitHub"
            >
              <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.08.79 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56C20.71 21.45 24 17.12 24 12.02 24 5.74 18.27.5 12 .5z" />
            </svg>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700"
          >
            {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>
        <SearchForm onSearch={fetchGitHubData} />
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <UserProfile user={user} />
        <RepoList repos={repos} />
      </div>
    </div>
  );
}