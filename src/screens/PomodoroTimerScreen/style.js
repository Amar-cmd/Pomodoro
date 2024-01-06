import {StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 10,
  },
  toolbarIcon: {
    backgroundColor: '#EBFFFE',
    padding: 10,
    borderRadius: 50,
  },
  toolbarHeading: {
    fontSize: 20,
    color: '#00818E',
    alignSelf: 'center',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '90%',
  },
  pomodoroInfo: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  label: {
    alignSelf: 'center',
    fontSize: 25,
    color: '#00818E',
  },
  rounds: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#00818E',
  },
  pomodoroTimerContainer: {
    flexDirection: 'row',
    width: '70%',
    height: '30%',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#FF6B6B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minutes: {
    fontSize: 50,
    color: '#FF6B6B',
  },
  colon: {fontSize: 50, paddingHorizontal: 5, color: '#FF6B6B'},
  seconds: {fontSize: 50, color: '#FF6B6B'},
  controls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  pause: {
    backgroundColor: '#FFE2E2',
    padding: 15,
    borderRadius: 10,
    opacity: 1,
  },
  disabledButton: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    opacity: 0.7,
  },
  play: {
    backgroundColor: '#EBFFFE',
    padding: 15,
    borderRadius: 10,
  },
  fullScreenModal: {
    width: '100%',
    height: '100%',
  },
  modalToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom:30,
  },
  closeModalButton: {
    backgroundColor: '#EBFFFE',
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    marginHorizontal: 20,
  },
  optionContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    height: 150,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00818E',
  },
  optionText: {
    color: '#00818E',
    fontSize: 20,
  },
  buttonContainer: {
    width: '50%', // Each button takes up half the width of the container
    padding: 10, // Adjust padding as needed
    // Add any additional styling as needed
  },
});

export default styles;
