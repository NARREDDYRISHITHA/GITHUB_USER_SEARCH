import React, { useEffect, useState } from "react";

export default function RepoList({ repos }) {
  const [repoLanguages, setRepoLanguages] = useState({});
  useEffect(() => {
    if (!repos || repos.length === 0) return;
    async function fetchLanguages() {
      const languagesData = {};
      await Promise.all(
        repos.map(async (repo) => {
          try {
            const res = await fetch(repo.languages_url, {
              headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
              },
            });
            const data = await res.json();
            if (data && typeof data === "object" && !Array.isArray(data) && (data.message || data.documentation_url)) {
              languagesData[repo.id] = [];
            } else {
              languagesData[repo.id] = Object.keys(data);
            }
          } catch {
            languagesData[repo.id] = [];
          }
        })
      );
      setRepoLanguages(languagesData);
    }
    fetchLanguages();
  }, [repos]);

  if (!repos || repos.length === 0) return null;
  return (
    <div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Top Repositories</h3>
      <div className="grid sm:grid-cols-2 gap-6">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="p-6 min-h-[210px] border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg bg-white dark:bg-gray-900 transition-all duration-200 relative"
          >
            <div className="flex items-center justify-between">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline text-xl break-words flex-1 text-gray-800 dark:text-gray-200"
              >
                {repo.name}
              </a>
              <span className="ml-3 flex items-center text-sm font-medium">
                <svg width="18" height="18" fill="#FFD700" className="inline mr-1">
                  <path d="M9 14.25l-5.197 2.734 1.001-5.834L.607 6.516l5.857-.851L9 0.75l2.536 4.915 5.857.851-4.197 4.634 1.001 5.834z" />
                </svg>
                {repo.stargazers_count}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base mb-2 mt-1">{repo.description}</p>
            <div className="flex flex-wrap gap-2 text-base mt-2 items-center">
              <span className="font-semibold text-gray-600 dark:text-gray-400">Languages:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {repoLanguages[repo.id]
                  ? repoLanguages[repo.id].length > 0
                    ? repoLanguages[repo.id].join(", ")
                    : "None"
                  : "Loading..."}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-600 dark:text-gray-400">Last Modified:</span>
              <span className="text-gray-500 dark:text-gray-300">{repo.lastModified || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}