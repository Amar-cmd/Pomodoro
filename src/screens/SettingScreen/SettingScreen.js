import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, TextInput, Text, TouchableOpacity, Switch, StatusBar} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {usePomodoro} from '../../context/PomodoroContext';

import {storeSettings} from '../../helpers/AsyncStorageHelpers';
import styles from './style';
import Toast from 'react-native-simple-toast'; // Make sure to install this package
const MAX_LABEL_LENGTH = 40;

const Cell = ({cellHeading, onValueChange, keyName}) => {
  const {settings, updateSettings} = usePomodoro();

  // Safely get the timer values, defaulting to '25' and '00' if not found
  const timerValue = settings[keyName] || {minutes: '25', seconds: '00'};

  const [minutes, setMinutes] = useState(timerValue.minutes);
  const [seconds, setSeconds] = useState(timerValue.seconds);

  const minutesInputRef = useRef(null);
  const secondsInputRef = useRef(null);

  const handleFocus = inputRef => {
    inputRef.current.setNativeProps({selection: {start: 0, end: -1}});
  };

  const handleMinutesChange = text => {
    setMinutes(text);
    onValueChange({minutes: text, seconds});
  };

  const handleSecondsChange = text => {
    setSeconds(text);
    onValueChange({minutes, seconds: text});
  };

  const handleMinutesSubmit = () => {
    const newMinutes = minutes || '25';
    setMinutes(newMinutes);
    updateSettings(keyName, {...timerValue, minutes: newMinutes});
  };

  const handleSecondsSubmit = () => {
    const newSeconds = seconds || '00';
    setSeconds(newSeconds);
    updateSettings(keyName, {...timerValue, seconds: newSeconds});
  };

  return (
    <View style={styles.cell}>
      <Text style={styles.cellHeading}>{cellHeading}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          ref={minutesInputRef}
          style={styles.textValue}
          keyboardType="numeric"
          maxLength={2}
          value={minutes}
          onChangeText={handleMinutesChange}
          onFocus={() => handleFocus(minutesInputRef)}
          onEndEditing={handleMinutesSubmit} // Trigger submit when user finishes editing
          onBlur={handleMinutesSubmit} // Also keep it on blur for safety
        />
        <Text style={styles.textValue}>:</Text>
        <TextInput
          ref={secondsInputRef}
          style={styles.textValue}
          keyboardType="numeric"
          maxLength={2}
          value={seconds}
          onChangeText={handleSecondsChange}
          onFocus={() => handleFocus(secondsInputRef)}
          onEndEditing={handleSecondsSubmit} // Trigger submit when user finishes editing
          onBlur={handleSecondsSubmit} // Also keep it on blur for safety
        />
      </View>
    </View>
  );
};

const Option = ({title, onToggle, identifier}) => {
  const {settings, updateSettings} = usePomodoro();
  const value = settings[identifier];

  const handleToggle = newValue => {
    console.log(`${identifier} ${newValue ? 'True' : 'False'}`);
    updateSettings(identifier, newValue);
    if (onToggle) {
      onToggle(newValue); // Call the onToggle prop if it's provided
    }
  };

  return (
    <View style={styles.options}>
      <Text style={styles.optionsTitle}>{title}</Text>
      <Switch
        trackColor={{false: '#767577', true: '#94DFFF'}}
        thumbColor={value ? '#00818E' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleToggle}
        value={value}
      />
    </View>
  );
};

const SettingScreen = ({navigation}) => {
  const {settings, updateSettings} = usePomodoro();

  const labels = ['DI', 'LR', 'VARC', 'QA', 'TA']; // Add or remove labels as necessary
  const [inputLabel, setInputLabel] = useState(
    settings.currentInputLabel || 'DI',
  );

  const [isLabelSelected, setIsLabelSelected] = useState(false);
  const [textLength, setTextLength] = useState(inputLabel.length);

  const [timerValues, setTimerValues] = useState({});
  // Use the global state instead of local state for these
  const [isVibrationOn, setIsVibrationOn] = useState(settings.isVibrationOn);
  const [isSilentNotificationOn, setIsSilentNotificationOn] = useState(
    settings.isSilentNotificationOn,
  );
  const [isAutomaticBreakOn, setIsAutomaticBreakOn] = useState(
    settings.isAutomaticBreakOn,
  );

  const handleCellChange = (key, values) => {
    setTimerValues({...timerValues, [key]: values});
  };

  const saveSettingsButtonPressed = async () => {
    handleLabelSubmit();
    await storeSettings(settings);
    Toast.show('Settings saved!', Toast.LONG);
    navigation.reset({
      index: 0,
      routes: [{name: 'PomodoroTimer'}],
    });
  };

  const goBackButtonPressed = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'PomodoroTimer'}],
    });
  };

  const handleDefaultLabelPress = label => {
    setInputLabel(label); // Set the input text to the label
    setTextLength(label.length); // Update the character count
    setIsLabelSelected(true); // Indicate that a label was just selected
    updateSettings('currentInputLabel', label); // Update globally
    // console.log(label); // Log the label to the console
    Toast.show('Label Set!', Toast.LONG);
  };

  const handleLabelSubmit = () => {
    if (!isLabelSelected) {
      // Only update if it's a custom label
      updateSettings('currentInputLabel', inputLabel);
    }
  };

  // Function to handle text input changes
  const handleInputChange = text => {
    setInputLabel(text); // Update the input label with user input
    setTextLength(text.length); // Update character count when typing

    // If the user starts typing, assume they are not using the default labels
    if (isLabelSelected) {
      setIsLabelSelected(false);
    }
  };

  // Update the global settings when the local timerValues change
  useEffect(() => {
    if (timerValues.pomodoro) {
      updateSettings('pomodoroTimer', timerValues.pomodoro);
    }
    if (timerValues.shortBreak) {
      updateSettings('shortBreakTimer', timerValues.shortBreak);
    }
    if (timerValues.longBreak) {
      updateSettings('longBreakTimer', timerValues.longBreak);
    }
  }, [timerValues]);

  useEffect(() => {
    if (settings.currentInputLabel !== inputLabel) {
      setInputLabel(settings.currentInputLabel || '');
    }
  }, [settings.currentInputLabel]);

  // Update the global state when local states change
  useEffect(() => {
    updateSettings('isVibrationOn', isVibrationOn);
  }, [isVibrationOn]);

  useEffect(() => {
    updateSettings('isSilentNotificationOn', isSilentNotificationOn);
  }, [isSilentNotificationOn]);

  useEffect(() => {
    updateSettings('isAutomaticBreakOn', isAutomaticBreakOn);
    Toast.show('Automatic Break Setting Updated!', Toast.SHORT);
  }, [isAutomaticBreakOn]);

  useEffect(() => {
    console.log('Settings after update: ', settings);
  }, [settings]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Toolbar  */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBackButtonPressed}>
          <View style={styles.toolbarIcon}>
            <Ionicons name="chevron-back-outline" size={30} color="#00818E" />
          </View>
        </TouchableOpacity>

        <Text style={styles.toolbarHeading}>Pomodoro Setting</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={saveSettingsButtonPressed}>
          <View style={styles.toolbarIcon}>
            <Ionicons name="checkmark" size={30} color="#00818E" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Section One  */}
      <View style={styles.sectionOne}>
        <Cell
          cellHeading="Pomodoro Timer"
          onValueChange={values => handleCellChange('pomodoroTimer', values)}
          keyName="pomodoroTimer"
        />
        <Cell
          cellHeading="Break Timer"
          onValueChange={values => handleCellChange('shortBreakTimer', values)}
          keyName="shortBreakTimer"
        />
        {/* <Cell
          cellHeading="Long Break Timer"
          onValueChange={values => handleCellChange('longBreakTimer', values)}
          keyName="longBreakTimer"
        /> */}
      </View>
      {/* Section 2  */}
      <View style={styles.sectionTwo}>
        {/* <View style={styles.separator}></View> */}
        <Text
          style={{
            marginVertical: 10,
            padding: 5,
            fontSize: 20,
            color: '#00818E',
          }}>
          Add Label
        </Text>
        <View style={styles.separator}></View>

        <TextInput
          style={styles.labelInput}
          placeholder="Add Task"
          placeholderTextColor="#aaa"
          maxLength={MAX_LABEL_LENGTH}
          onChangeText={handleInputChange} // Use the updated handleInputChange
          value={inputLabel} // Display the current input label
          onBlur={handleLabelSubmit}
        />
        <Text
          style={
            styles.letterCount
          }>{`${textLength}/${MAX_LABEL_LENGTH}`}</Text>
        <View style={styles.defaultLabelContainer}>
          {labels.map((label, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={index}
              style={styles.IndividualDefaultLabels}
              onPress={() => handleDefaultLabelPress(label)}>
              <Text style={styles.defaultLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Section 3  */}
      <View style={styles.sectionThree}>
        {/* <View style={styles.separator} /> */}
        <Text style={{marginVertical: 10, fontSize: 20, color: '#00818E'}}>
          Settings
        </Text>
        <View style={styles.separator} />

        <Option
          title="Vibration"
          value={isVibrationOn}
          onToggle={setIsVibrationOn}
          identifier="Vibration" // For debugging
        />

        {/* <Option
          title="Silent Notification"
          value={isSilentNotificationOn}
          onToggle={setIsSilentNotificationOn}
          identifier="Silent Notification" // For debugging
        /> */}

        <Option
          title="Automatic Break"
          value={isAutomaticBreakOn}
          onToggle={setIsAutomaticBreakOn}
          identifier="Automatic Break" // For debugging
        />
      </View>
    </View>
  );
};

export default SettingScreen;
