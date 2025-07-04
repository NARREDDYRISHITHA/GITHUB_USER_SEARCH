import { useState } from 'react';
export default function SearchForm({ onSearch }) {
  const [username, setUsername] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Please enter a GitHub username.");
      return;
    }
    onSearch(username.trim());
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="flex-1 p-2 border rounded-md bg-white text-black dark:bg-gray-800 dark:text-white"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}