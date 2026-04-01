'use client';
import { useEffect } from 'react';

export default function ServerPing() {
  useEffect(() => {
    // Ping main server
    const pingServer = async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ping`);
        if (!response.ok) {
          // Silently ignore non-OK statuses to avoid console noise in browsers
          return;
        }
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          // Non-JSON response; ignore
          return;
        }
        const data = await response.json();
        // Optional debug log
        // console.debug("Main server status:", data);
      } catch (error) {
        // Ignore network errors in client console
      }
    };

    // Ping blogs server
    const pingBlogsServer = async () => {
      if (!process.env.NEXT_PUBLIC_API_URL_BLOG) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_BLOG}/api/blogs/ping`
        );
        if (!response.ok) {
          // Silently ignore non-OK statuses to avoid console noise
          return;
        }
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          // Non-JSON response; ignore
          return;
        }
        const data = await response.json();
        // Optional debug log
        // console.debug("Blogs server status:", data);
      } catch (error) {
        // Ignore network errors in client console
      }
    };

    // Execute both pings
    pingServer();
    pingBlogsServer();

    // Optional: Set up interval to ping periodically (every 5 minutes)
    const interval = setInterval(() => {
      pingServer();
      pingBlogsServer();
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything visible
}