import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Alert, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';

const Cell = ({cellHeading}) => {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellHeading}>{cellHeading}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.textValue}>40:00</Text>
      </View>
    </View>
  );
};

const startPress = () => {
  Alert.alert(
    'PLEDGE!',
    'I will not interrupt myself for next 2 hours at any cost.',
    [{text: 'Confirm', onPress: () => console.log('OK Pressed')}],
  );
};
const CatMockScreen = () => {
  return (
    <View style={styles.container}>
      {/*//! Toolbar  */}
      <View style={styles.toolbar}>
        <TouchableOpacity>
          <View style={styles.toolbarIcon}>
            <Ionicons name="arrow-back" size={30} color="#00818E" />
          </View>
        </TouchableOpacity>

        <Text style={styles.toolbarHeading}>CAT MOCK MODE</Text>
        <Text></Text>
      </View>

      <View style={styles.timerContainer}>
        <Cell cellHeading="VARC" />
        <Cell cellHeading="DILR" />
        <Cell cellHeading="QA" />
      </View>

      <View style={styles.start}>
        <TouchableOpacity onPress={startPress}>
          <Text style={styles.startButton}>START</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CatMockScreen;
