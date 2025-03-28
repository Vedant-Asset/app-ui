import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for different types of data
export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  AUTH_TOKEN: '@auth_token',
  SETTINGS: '@settings',
  CACHE: '@cache',
  MOBILE_VERIFIED: '@mobile_verified', // Added for mobile OTP verification
  EMAIL_VERIFIED: '@email_verified',   // Added for email OTP verification
  DOCUMENTS_VERIFIED: '@documents_verified', // Added for document verification
  PAN_IMAGE: '@pan_image',
  UID_FRONT_IMAGE: '@uid_front_image',
  UID_BACK_IMAGE: '@uid_back_image',
};

// Generic type for stored data
type StoredData<T> = {
  data: T;
  timestamp: number;
};

// Save data
export const saveData = async (key: string, data: any): Promise<void> => {
  try {
    const item = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

// Get data
export const getData = async (key: string): Promise<any> => {
  try {
    const item = await AsyncStorage.getItem(key);
    if (item) {
      const parsedItem = JSON.parse(item);
      return parsedItem.data;
    }
    return null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

// Remove data
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// Check if data exists
export const hasData = async (key: string): Promise<boolean> => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item !== null;
  } catch (error) {
    console.error('Error checking data:', error);
    return false;
  }
};

// Get multiple items
export const getMultipleData = async (keys: string[]): Promise<Record<string, any>> => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    return values.reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = JSON.parse(value);
      }
      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('Error getting multiple data:', error);
    return {};
  }
};

// Save multiple items
export const saveMultipleData = async (items: [string, any][]): Promise<void> => {
  try {
    const stringifiedItems: [string, string][] = items.map(([key, value]) => [
      key,
      JSON.stringify({
        data: value,
        timestamp: Date.now(),
      }),
    ]);
    await AsyncStorage.multiSet(stringifiedItems);
  } catch (error) {
    console.error('Error saving multiple data:', error);
    throw error;
  }
};
