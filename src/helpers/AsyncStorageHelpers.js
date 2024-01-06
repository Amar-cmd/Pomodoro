// AsyncStorageHelpers.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeSettings = async settings => {
  try {
    const jsonSettings = JSON.stringify(settings);
    await AsyncStorage.setItem('@PomodoroSettings', jsonSettings);
  } catch (e) {
    console.error('Failed to save settings.', e);
  }
};

export const loadSettings = async () => {
  try {
    const jsonSettings = await AsyncStorage.getItem('@PomodoroSettings');
    return jsonSettings != null ? JSON.parse(jsonSettings) : null;
  } catch (e) {
    console.error('Failed to load settings.', e);
  }
};
