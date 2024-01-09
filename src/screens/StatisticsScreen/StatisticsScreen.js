import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {
  BarChart,
  PieChart,
  LineChart,
  ContributionGraph,
  ProgressChart,
} from 'react-native-chart-kit';
import styles from './style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {useUser} from '../../context/UserContext';
import {usePomodoro} from '../../context/PomodoroContext'; // Import usePomodoro

const screenWidth = Dimensions.get('window').width;

const LABEL_GOALS = {
  DI: 3,
  LR: 3,
  QA: 5,
  VARC: 6,
  TA: 2,
};

const subjectColors = {
  DI: '#F3A683',
  LR: '#F7D794',
  QA: '#778BEB',
  VARC: '#e77f67',
  TA: '#cf6a87',
};

const StatisticsScreen = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Daily');
  const [isLoading, setIsLoading] = useState(false); // State for loading status

  const [selectedOption, setSelectedOption] = useState('time'); // Initial value is 'time'
  const [barData, setBarData] = useState({
    labels: ['DI', 'LR', 'QA', 'VARC', 'TA'],
    datasets: [{data: [0, 0, 0, 0, 0]}],
  });
  const [pieData, setPieData] = useState([]); // State to store pie chart data
  const [lineData, setLineData] = useState({
    labels: ['DI', 'LR', 'QA', 'VARC', 'TA'],
    datasets: [{data: [0, 0, 0, 0, 0]}],
  });
  // const [testMarks, setTestMarks] = useState([]);
  // Initialize testMarks as an object with the expected structure
  const [testMarks, setTestMarks] = useState({
    labels: [],
    datasets: [{data: []}],
  });

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      const userDocRef = firestore().collection('users').doc(currentUser.uid);

      userDocRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            const marks = userData.marks || [];
            // Format the data for the LineChart
            const formattedData = {
              labels: marks.map((_, index) => `${index + 1}`),
              datasets: [{data: marks}],
            };

            setTestMarks(formattedData); // Set the state
            setIsLoading(false);
            console.log(testMarks);
            console.log(testMarks.datasets);
            console.log(testMarks.labels);

          } else {
            console.log('Document does not exist');
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching test marks:', error);
          setIsLoading(false);
        });
    }
  }, [currentUser]);

  const [completionData, setCompletionData] = useState({
    labels: Object.keys(LABEL_GOALS), // Add labels corresponding to the goals
    data: Object.values(LABEL_GOALS).map(() => 0),
  });

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{data: [20, 45, 28, 80, 99, 43]}],
  };

  const toggleOption = () => {
    setSelectedOption(selectedOption === 'time' ? 'session' : 'time');
  };

  // Handle period selection
  const handlePeriodSelection = period => {
    setSelectedPeriod(period);
    setModalVisible(false);
  };

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'PomodoroTimer'}],
    });
  };

  const {user} = useUser();

  const currentUser = user;

  const getWeekRef = date => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
    );
    return `${date.getFullYear()}-W${weekNumber}`;
  };

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      const today = new Date();
      let dateString;
      let collectionPath;

      switch (selectedPeriod) {
        case 'Daily':
          dateString = `${today.getFullYear()}-${
            today.getMonth() + 1
          }-${today.getDate()}`;
          collectionPath = 'daily';
          break;
        case 'Weekly':
          dateString = getWeekRef(today);
          collectionPath = 'weekly';
          break;
        case 'Monthly':
          dateString = `${today.getFullYear()}-${today.getMonth() + 1}`;
          collectionPath = 'monthly';
          break;
        default:
          return; // Exit the useEffect if no period is selected
      }

      const subjects = ['DI', 'LR', 'QA', 'VARC', 'TA'];
      let newBarData = [...barData.datasets[0].data];
      let newPieData = [];
      let newLineData = [...lineData.datasets[0].data];

      subjects.forEach((subject, index) => {
        const subjectRef = firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('aggregates')
          .doc(collectionPath)
          .collection(dateString)
          .doc(subject);

        subjectRef
          .get()
          .then(doc => {
            if (doc.exists) {
              const data = doc.data();
              newBarData[index] =
                selectedOption === 'time' ? data.time : data.session;
              newPieData.push({
                name: subject,
                population: data.session,
                color: subjectColors[subject],
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              });
              newLineData[index] = data.session;
            } else {
              newBarData[index] = 0;
              newPieData.push({
                name: subject,
                population: 0,
                color: subjectColors[subject],
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              });
              newLineData[index] = 0;
            }

            if (index === subjects.length - 1) {
              setBarData({
                labels: barData.labels,
                datasets: [{data: newBarData}],
              });
              setPieData(newPieData);
              setLineData({
                labels: lineData.labels,
                datasets: [{data: newLineData}],
              });
              setIsLoading(false);
            }
          })
          .catch(error => {
            console.error('Error fetching data for subject:', subject, error);
          });
      });
    }
  }, [currentUser, selectedOption, selectedPeriod]);

  useEffect(() => {
    if (currentUser) {
      const today = new Date();
      const dateString = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;

      const newCompletionData = [...completionData.data];

      Object.keys(LABEL_GOALS).forEach((label, index) => {
        const subjectRef = firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('aggregates')
          .doc('daily')
          .collection(dateString)
          .doc(label);

        subjectRef
          .get()
          .then(doc => {
            if (doc.exists) {
              const data = doc.data();
              const sessionsCompleted = data.session || 0;
              const goal = LABEL_GOALS[label];

              // Calculate completion percentage (capped at 1)
              const completionPercentage = Math.min(
                sessionsCompleted / goal,
                1,
              );

              newCompletionData[index] = completionPercentage;
            }

            if (index === Object.keys(LABEL_GOALS).length - 1) {
              setCompletionData({
                labels: Object.keys(LABEL_GOALS),
                data: newCompletionData,
              });
              console.log(newCompletionData);
            }
          })
          .catch(error => {
            console.error('Error fetching data for label:', label, error);
          });
      });
    }
  }, [currentUser, selectedOption]);

  // Set the default period to 'Daily' every time the component mounts
  useEffect(() => {
    setSelectedPeriod('Daily');
  }, []);

  
  // const testMarksData = {
  //   labels: testMarks.map((_, index) => `Test ${index + 1}`),
  //   datasets: [{data: testMarks}],
  // };

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 139, 142, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    // Add this to change the background color of the progress chart
    backgroundGradientFromOpacity: 0, // Transparent background
    fillShadowGradient: '#FF6384', // Pink color for the progress ring
    fillShadowGradientOpacity: 1,
  };

  // End date is today, start date is 6 months ago
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 6);

  const isDataValid =
    completionData.data &&
    Array.isArray(completionData.data) &&
    completionData.data.some(val => val > 0);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={goBack}>
            <View style={styles.toolbarIcon}>
              <Ionicons name="arrow-back" size={30} color="#00818E" />
            </View>
          </TouchableOpacity>

          <Text style={styles.toolbarHeading}>
            Statistics ({selectedPeriod})
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.toolbarIcon}>
              <Ionicons
                name="calendar-clear-outline"
                size={30}
                color="#00818E"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Subject-Wise Study Comparison</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleOption}>
            <Text style={styles.toggleText}>{selectedOption}</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#00818E" /> // Loading indicator
        ) : (
          <View style={styles.chart}>
            <BarChart
              data={barData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero={true}
              segments={5}
              formatYLabel={y =>
                `${y} ${selectedOption === 'time' ? 'min' : 'sess'}`
              }
            />
          </View>
        )}

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Subject Distribution</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#00818E" /> // Loading indicator
        ) : (
          <View style={styles.chart}>
            <PieChart
              data={pieData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              center={[10, 10]}
              absolute
            />
          </View>
        )}

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Study Trend Over Time</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#00818E" /> // Loading indicator
        ) : (
          <LineChart
            data={lineData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            withVerticalLabels
            withInnerLines
            fromZero={true} // Ensure the chart's y-axis starts from 0
            // yAxisSuffix={selectedOption === 'time' ? ' min' : ' sess'}
          />
        )}

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Test Marks Over Time</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#00818E" />
        ) : (
          testMarks.labels.length > 0 &&
          testMarks.datasets[0].data.length > 0 && (
            <View style={styles.chart}>
              <LineChart
                data={testMarks}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                fromZero={true}
              />
            </View>
          )
        )}

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Goal Completion</Text>
        </View>
        {isLoading && (
          <ActivityIndicator size="large" color="#00818E" /> // Loading indicator
        )}
        {!isLoading && isDataValid && (
          <ProgressChart
            key={JSON.stringify(completionData)}
            data={completionData}
            width={screenWidth}
            height={220}
            // strokeWidth={16} // Increased stroke width
            radius={32}
            chartConfig={chartConfig}
          />
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Period</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handlePeriodSelection('Daily')}>
                  <Text style={styles.buttonText}>Daily</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handlePeriodSelection('Weekly')}>
                  <Text style={styles.buttonText}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handlePeriodSelection('Monthly')}>
                  <Text style={styles.buttonText}>Monthly</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default StatisticsScreen;
