import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bizbridge_recently_viewed_v1';
const MAX_ITEMS = 10;

/**
 * Hook to track and retrieve recently viewed services
 * @returns {Object} { recentlyViewed: string[], addRecentlyViewed: (serviceId: string) => void, clearRecentlyViewed: () => void }
 */
const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed.slice(0, MAX_ITEMS));
        }
      }
    } catch (error) {
      console.error('Failed to load recently viewed:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save to localStorage whenever state changes
  const saveToStorage = (items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save recently viewed:', error);
    }
  };

  const addRecentlyViewed = (serviceId) => {
    if (!serviceId || typeof serviceId !== 'string') return;

    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter(id => id !== serviceId);
      // Add to front
      const updated = [serviceId, ...filtered].slice(0, MAX_ITEMS);
      saveToStorage(updated);
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear recently viewed:', error);
    }
  };

  return {
    recentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed
  };
};

export default useRecentlyViewed;
