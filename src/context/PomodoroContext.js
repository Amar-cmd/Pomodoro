import React, {createContext, useState, useEffect} from 'react';
import {loadSettings} from '../helpers/AsyncStorageHelpers'; // Adjust the path as necessary

// Create a context with a default value
const PomodoroContext = createContext();

export const usePomodoro = () => React.useContext(PomodoroContext);

// This component will wrap your application and provide the context
export const PomodoroProvider = ({children}) => {
  const defaultSettings = {
    pomodoroTimer: {minutes: '25', seconds: '00'},
    shortBreakTimer: {minutes: '05', seconds: '00'},
    longBreakTimer: {minutes: '15', seconds: '00'},
    isVibrationOn: false,
    isSilentNotificationOn: false,
    isAutomaticBreakOn: false,
    labels: ['DI', 'LR', 'QA', 'QUANT', 'TA'],
  };

  // Initialize state with default settings
  const [settings, setSettings] = useState(defaultSettings);

  // Function to update individual settings
  const updateSettings = (key, value) => {
    setSettings(prev => ({...prev, [key]: value}));
  };

  // Load settings from AsyncStorage when the component mounts
  useEffect(() => {
    const initializeSettings = async () => {
      const savedSettings = await loadSettings();
      if (savedSettings) {
        // If there are saved settings, use them
        setSettings(savedSettings);
      } else {
        // If not, we rely on the default settings
        setSettings(defaultSettings);
      }
    };
    initializeSettings();
  }, []); // The empty array ensures this effect runs once on mount

  return (
    <PomodoroContext.Provider value={{settings, updateSettings}}>
      {children}
    </PomodoroContext.Provider>
  );
};

export default PomodoroContext;
