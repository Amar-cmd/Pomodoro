import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
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
const screenWidth = Dimensions.get('window').width;

const subjectColors = {
  DI: '#F3A683',
  LR: '#F7D794',
  QA: '#778BEB',
  VARC: '#e77f67',
  TA: '#cf6a87',
};

const StatisticsScreen = ({navigation}) => {
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

  const toggleOption = () => {
    setSelectedOption(selectedOption === 'time' ? 'session' : 'time');
  };

  const goBack = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'PomodoroTimer'}],
    });
    // Add your Firestore fetch logic here based on selectedOption
  };

  const {user} = useUser();
  const currentUser = user;
  
  useEffect(() => {
    if (currentUser) {
      // Define the date string for today
      const today = new Date();
      const dateString = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;
      const subjects = ['DI', 'LR', 'QA', 'VARC', 'TA'];

      let newBarData = [...barData.datasets[0].data]; // Copy the current data array for the bar chart
      let newPieData = []; // Array to store the new pie chart data
      let newLineData = [...lineData.datasets[0].data]; // Copy the current data array for the line chart

      subjects.forEach((subject, index) => {
        const subjectRef = firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('aggregates')
          .doc('daily')
          .collection(dateString)
          .doc(subject);

        subjectRef
          .get()
          .then(doc => {
            if (doc.exists) {
              const data = doc.data();
              // Update bar chart data based on the selected option (time or session)
              newBarData[index] =
                selectedOption === 'time' ? data.time : data.session;

              // Update pie chart data with session data only
              newPieData.push({
                name: subject,
                population: data.session, // Always use session data for pie chart
                color: subjectColors[subject], // Use pre-defined color for each segment
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              });

              // Update line chart data with session data
              newLineData[index] = data.session;
            } else {
              // If no data for the subject, set it to 0
              newBarData[index] = 0;
              newPieData.push({
                name: subject,
                population: 0, // Default to 0 if no session data
                color: subjectColors[subject],
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              });
              newLineData[index] = 0; // Set line chart data to 0 as well
            }

            // Update the state only after the last subject data is processed
            if (index === subjects.length - 1) {
              setBarData({
                labels: barData.labels,
                datasets: [{data: newBarData}],
              });
              setPieData(newPieData); // Update pie chart data with new session data
              setLineData({
                labels: lineData.labels,
                datasets: [{data: newLineData}],
              }); // Update line chart data with new session data
            }
          })
          .catch(error => {
            console.error('Error fetching data for subject:', subject, error);
          });
      });
    }
  }, [currentUser, selectedOption]);

  // each value represents a goal ring in Progress chart
  const data = {
    labels: ['DI', 'LR', 'QA', 'VARC', 'TA'], // optional
    data: [0.4, 0.6, 0.7, 0.6, 0.7],
  };

  const formatDate = date => {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const commitsData = [
    {date: '2017-01-02', count: 1},
    {date: '2017-01-03', count: 2},
    {date: '2017-01-04', count: 3},
    {date: '2017-01-05', count: 4},
    {date: '2017-01-06', count: 5},
    {date: '2017-01-30', count: 2},
    {date: '2017-01-31', count: 3},
    {date: '2017-03-01', count: 2},
    {date: '2017-04-02', count: 4},
    {date: '2017-03-05', count: 2},
    {date: '2017-02-30', count: 4},
  ];

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1, index) =>
      subjectColors[barData.labels[index]] || `#00818E`, // Match bar color with the subject
    style: {
      borderRadius: 16,
    },
  };

  // End date is today, start date is 6 months ago
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 6);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={goBack}>
            <View style={styles.toolbarIcon}>
              <Ionicons name="arrow-back" size={30} color="#00818E" />
            </View>
          </TouchableOpacity>

          <Text style={styles.toolbarHeading}>Statistics</Text>
          <Text></Text>
        </View>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Subject-Wise Study Comparison</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleOption}>
            <Text style={styles.toggleText}>{selectedOption}</Text>
          </TouchableOpacity>
        </View>

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

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Subject Distribution</Text>
        </View>

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

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Study Trend Over Time</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleOption}>
            <Text style={styles.toggleText}>{selectedOption}</Text>
          </TouchableOpacity>
        </View>

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

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Test Marks Over Time</Text>
        </View>

        {/* <View style={styles.chart}>
          <LineChart
            data={lineData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        </View> */}

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Consistency Chart</Text>
        </View>
        <ContributionGraph
          values={commitsData}
          endDate={new Date('2024-05-03')}
          numDays={105}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
        />
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Goal Completion</Text>
        </View>
        <ProgressChart
          data={data}
          width={screenWidth}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
        />
      </View>
    </ScrollView>
  );
};

export default StatisticsScreen;
