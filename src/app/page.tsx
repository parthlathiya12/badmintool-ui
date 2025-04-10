'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }
      
      console.log('Fetching from URL:', `${apiUrl}/user?email=${encodeURIComponent(email)}`);
      const response = await fetch(`${apiUrl}/user?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch user data: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      setUserData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error fetching user data: ${errorMessage}`);
      console.error('Detailed error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Badminton Tool User Lookup</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search User'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      
      {userData && (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">User Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
