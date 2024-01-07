import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';

const SessionInfo = ({heading, score}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

const AnalyticsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity>
          <View style={styles.toolbarIcon}>
            <Ionicons name="chevron-back-outline" size={30} color="#00818E" />
          </View>
        </TouchableOpacity>
        <Text style={styles.toolbarHeading}>Analytics</Text>
        <Text></Text>
      </View>
      <SessionInfo heading="Today's Session" score="08" />
      <SessionInfo heading="Today's Time" score="08:00:00" />
    </View>
  );
};


export default AnalyticsScreen;
