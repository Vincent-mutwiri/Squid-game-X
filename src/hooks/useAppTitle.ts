import { useState, useEffect } from 'react';

export function useAppTitle() {
  const [title, setTitle] = useState('Townhall Icebreaker'); // Default fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const settings = await res.json();
          setTitle(settings.appTitle || 'Townhall Icebreaker');
        }
      } catch (error) {
        console.error('Failed to fetch app title:', error);
        // Keep default title on error
      } finally {
        setLoading(false);
      }
    };

    fetchTitle();
  }, []);

  return { title, loading };
}