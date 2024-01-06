import React, {useState, useRef, useCallback} from 'react';
import {View, TextInput, Text, TouchableOpacity, Switch} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './style';
const MAX_LABEL_LENGTH = 40;

const Cell = ({cellHeading, onValueChange}) => {
  const [minutes, setMinutes] = useState('25');
  const [seconds, setSeconds] = useState('00');
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
    onValueChange({minutes: newMinutes, seconds});
  };

  const handleSecondsSubmit = () => {
    const newSeconds = seconds || '00';
    setSeconds(newSeconds);
    onValueChange({minutes, seconds: newSeconds});
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
          onSubmitEditing={handleMinutesSubmit}
          onBlur={handleMinutesSubmit} // Set default value on blur
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
          onSubmitEditing={handleSecondsSubmit}
          onBlur={handleSecondsSubmit} // Set default value on blur
        />
      </View>
    </View>
  );
};

const Option = ({title, value, onToggle, identifier}) => {
  // Debugging: Log when the value changes
  const handleToggle = newValue => {
    console.log(`${identifier} ${newValue ? 'True' : 'False'}`);
    onToggle(newValue);
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
  const labels = ['DI', 'LR', 'QA', 'QUANT', 'TA']; // Add or remove labels as necessary
  const [textLength, setTextLength] = useState(0);
  const [inputLabel, setInputLabel] = useState('');
  const [isLabelSelected, setIsLabelSelected] = useState(false);

  const [timerValues, setTimerValues] = useState({});
    const [isVibrationOn, setIsVibrationOn] = useState(false);
      const [isSilentNotificationOn, setIsSilentNotificationOn] =
        useState(false);
      const [isAutomaticBreakOn, setIsAutomaticBreakOn] = useState(false);

  const toggleSwitch = () => setIsVibrationOn(previousState => !previousState);

  const handleCellChange = (key, values) => {
    setTimerValues({...timerValues, [key]: values});
  };

  const handleDefaultLabelPress = label => {
    setInputLabel(label); // Set the input text to the label
    setTextLength(label.length); // Update the character count
    setIsLabelSelected(true); // Indicate that a label was just selected
    console.log(label); // Log the label to the console
  };

  // Function to handle text input changes
  const handleInputChange = text => {
    setInputLabel(text);
    setTextLength(text.length); // Update character count when typing

    // If the user starts typing, assume they are not using the default labels
    if (isLabelSelected) {
      setIsLabelSelected(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Toolbar  */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.toolbarIcon}>
            <Ionicons name="chevron-back-outline" size={30} color="#00818E" />
          </View>
        </TouchableOpacity>

        <Text style={styles.toolbarHeading}>Pomodoro Setting</Text>
        <Text></Text>
      </View>

      {/* Section One  */}
      <View style={styles.sectionOne}>
        <Cell
          cellHeading="Pomodoro Timer"
          onValueChange={values => handleCellChange('pomodoro', values)}
        />
        <Cell
          cellHeading="Short Break Timer"
          onValueChange={values => handleCellChange('shortBreak', values)}
        />
        <Cell
          cellHeading="Long Break Timer"
          onValueChange={values => handleCellChange('longBreak', values)}
        />
      </View>
      {/* Section 2  */}
      <View style={styles.sectionTwo}>
        <View style={styles.separator}></View>
        <TextInput
          style={styles.labelInput}
          placeholder="Add Task"
          maxLength={MAX_LABEL_LENGTH}
          onChangeText={handleInputChange} // Use the updated handleInputChange
          value={inputLabel}
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
        <View style={styles.separator} />

        <Option
          title="Vibration"
          value={isVibrationOn}
          onToggle={setIsVibrationOn}
          identifier="Vibration" // For debugging
        />

        <Option
          title="Silent Notification"
          value={isSilentNotificationOn}
          onToggle={setIsSilentNotificationOn}
          identifier="Silent Notification" // For debugging
        />

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
