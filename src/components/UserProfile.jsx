import React, { useState, useEffect } from "react";

export default function UserProfile({ user }) {
  const [modalType, setModalType] = useState(null);
  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);
  if (!user) return null;
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
      <div className="flex items-center gap-4">
        <img src={user.avatar_url} alt={user.login} className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">@{user.login}</p>
          <p>{user.bio}</p>
          <p>{user.location}</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => handleOpenModal("followers")}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded shadow hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer transition font-semibold"
            >
              Followers: {user.followers}
            </button>
            <button
              onClick={() => handleOpenModal("following")}
              className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded shadow hover:bg-green-200 dark:hover:bg-green-800 cursor-pointer transition font-semibold"
            >
              Following: {user.following}
            </button>
            <button
              onClick={() => handleOpenModal("repos")}
              className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded shadow hover:bg-purple-200 dark:hover:bg-purple-800 cursor-pointer transition font-semibold"
            >
              Repositories: {user.public_repos}
            </button>
          </div>
        </div>
      </div>
      {modalType && (
        <UserListModal
          type={modalType}
          user={user}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
function UserListModal({ type, user, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  async function fetchAllPages(url) {
    let results = [];
    let page = 1;
    let perPage = 100;
    let hasMore = true;
    while (hasMore) {
      const res = await fetch(`${url}?per_page=${perPage}&page=${page}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });
      const data = await res.json();
      results = results.concat(data);
      if (data.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }
    return results;
  }
  useEffect(() => {
    let url = "";
    if (type === "followers") url = user.followers_url;
    else if (type === "following") url = `https://api.github.com/users/${user.login}/following`;
    else if (type === "repos") url = user.repos_url;

    setLoading(true);
    fetchAllPages(url).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, [type, user]);
  let displayItems = items;
  if (type === "repos") {
    displayItems = [...items].sort((a, b) =>
      sortOrder === "desc"
        ? b.stargazers_count - a.stargazers_count
        : a.stargazers_count - b.stargazers_count
    );
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full relative">
        <button className="absolute top-2 right-3 text-lg" onClick={onClose}>✕</button>
        <h3 className="text-xl font-semibold mb-4 capitalize">{type} List</h3>
        {type === "repos" && (
          <button
            className="mb-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          >
            Sort by Stars: {sortOrder === "desc" ? "High → Low" : "Low → High"}
          </button>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="max-h-64 overflow-y-auto">
            {displayItems.length === 0 && <li>No data found.</li>}
            {type === "repos"
              ? displayItems.map(repo => (
                <li key={repo.id} className="mb-2">
                  <div className="flex justify-between items-center px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-800 dark:text-gray-200 truncate">
                      {repo.name}
                    </a>
                    <span className="ml-4 text-yellow-600 dark:text-yellow-400 font-semibold">
                      ⭐ {repo.stargazers_count}
                    </span>
                  </div>
                </li>
              ))
              : displayItems.map(userItem => (
                <li key={userItem.id} className="mb-2 flex items-center">
                  <img src={userItem.avatar_url} alt={userItem.login} className="inline w-6 h-6 rounded-full mr-2" />
                  <a href={userItem.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-800 dark:text-gray-200">
                    {userItem.login}
                  </a>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}