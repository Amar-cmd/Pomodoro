import React, {useState, useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../../context/UserContext';
import styles from './style';

const SessionInfo = ({heading, score}) => {
  return (
    <View style={styles.sessionContainer}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

const AnalyticsScreen = ({navigation}) => {
  const {user} = useUser();
  const currentUser = user; // Get the currently signed-in user

  const [todaySessions, setTodaySessions] = useState('00');
  const [todayTime, setTodayTime] = useState('00:00:00');
  const [totalStudySessions, setTotalStudySessions] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'PomodoroTimer'}],
    });
  };
 useEffect(() => {
   if (currentUser) {
     const today = new Date();
     const dailyDateString = `${today.getFullYear()}-${
       today.getMonth() + 1
     }-${today.getDate()}`;
     const monthlyDateString = `${today.getFullYear()}-${today.getMonth() + 1}`;
     const weekNumber = Math.ceil((today.getDate() - today.getDay() + 1) / 7);
     const weeklyDateString = `${today.getFullYear()}-W${weekNumber}`;

     // Reference to the user's daily, weekly, and monthly aggregate documents
     const dailyRef = firestore()
       .collection('users')
       .doc(currentUser.uid)
       .collection('aggregates')
       .doc('daily')
       .collection(dailyDateString)
       .doc('summary');

     const weeklyRef = firestore()
       .collection('users')
       .doc(currentUser.uid)
       .collection('aggregates')
       .doc('weekly')
       .collection(weeklyDateString)
       .doc('summary');

     const monthlyRef = firestore()
       .collection('users')
       .doc(currentUser.uid)
       .collection('aggregates')
       .doc('monthly')
       .collection(monthlyDateString)
       .doc('summary');

     // Fetch the daily data
     dailyRef
       .get()
       .then(doc => {
         if (doc.exists) {
           const data = doc.data();
           setTodaySessions(data.totalSessions.toString());
           setTodayTime(formatTime(data.totalTime));
         } else {
           console.log('No daily data for today');
         }
       })
       .catch(error => {
         console.error('Error fetching daily data: ', error);
       });

     // Fetch overall study sessions and time
     const userRef = firestore().collection('users').doc(currentUser.uid);
     userRef.get().then(doc => {
       if (doc.exists) {
         const data = doc.data();
         setTotalStudySessions(data.overallStudySessions.toString());
         setTotalStudyTime(formatTime(data.overallStudyTime));
       }
     });
     //! Fetch the weekly data
     //  weeklyRef
     //    .get()
     //    .then(doc => {
     //      if (doc.exists) {
     //        const data = doc.data();
     //        // Process weekly data...
     //      } else {
     //        console.log('No weekly data for this week');
     //      }
     //    })
     //    .catch(error => {
     //      console.error('Error fetching weekly data: ', error);
     //    });

     // Fetch the monthly data
     //  monthlyRef
     //    .get()
     //    .then(doc => {
     //      if (doc.exists) {
     //        const data = doc.data();
     //        // Process monthly data...
     //      } else {
     //        console.log('No monthly data for this month');
     //      }
     //    })
     //    .catch(error => {
     //      console.error('Error fetching monthly data: ', error);
     //    });
   }
 }, [currentUser]);


  // Function to format time in HH:MM
  function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  return (
    <>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goBack}>
          <View style={styles.toolbarIcon}>
            <Ionicons name="chevron-back-outline" size={30} color="#00818E" />
          </View>
        </TouchableOpacity>
        <Text style={styles.toolbarHeading}>Analytics</Text>
        <Text style={{padding: 20}}></Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <SessionInfo heading="Today's Sessions" score={todaySessions} />
          <SessionInfo heading="Today's Time" score={todayTime} />
          <Text style={styles.total}>Total</Text>
          <SessionInfo heading="Study Sessions" score={totalStudySessions} />
          <SessionInfo heading="Study Time" score={totalStudyTime} />
          <SessionInfo heading="Break Session" score="100" />
          <SessionInfo heading="Break Time" score="60:00" />
        </View>
      </ScrollView>
    </>
  );
};

export default AnalyticsScreen;
