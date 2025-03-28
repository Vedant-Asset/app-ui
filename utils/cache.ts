import { STORAGE_KEYS, saveData, getData, removeData } from './storage';

type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiry: number;
};

const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};

export class Cache {
  static async set<T>(key: string, data: T, duration: keyof typeof CACHE_DURATION = 'MEDIUM'): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: CACHE_DURATION[duration],
    };
    await saveData(`${STORAGE_KEYS.CACHE}:${key}`, cacheItem);
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cacheItem = await getData<CacheItem<T>>(`${STORAGE_KEYS.CACHE}:${key}`);
      
      if (!cacheItem) return null;

      const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiry;
      if (isExpired) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async remove(key: string): Promise<void> {
    await removeData(`${STORAGE_KEYS.CACHE}:${key}`);
  }

  static async clear(): Promise<void> {
    const keys = await this.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.CACHE));
    await Promise.all(cacheKeys.map(key => removeData(key)));
  }

  static async getAllKeys(): Promise<string[]> {
    // Note: This is a simplified version. In a real app, you might want to implement
    // a more sophisticated way to get all keys from AsyncStorage
    return Object.values(STORAGE_KEYS);
  }

  static async isExpired(key: string): Promise<boolean> {
    const cacheItem = await getData<CacheItem<any>>(`${STORAGE_KEYS.CACHE}:${key}`);
    if (!cacheItem) return true;
    return Date.now() - cacheItem.timestamp > cacheItem.expiry;
  }
} 