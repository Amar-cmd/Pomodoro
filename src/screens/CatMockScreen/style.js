import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
  },
  timerContainer: {
    paddingVertical: '10%',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 10,
    backgroundColor: '#fff',
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
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '10%',
    marginVertical: 20,
  },
  cellHeading: {fontSize: 25, color: '#00818E'},
  textValue: {fontSize: 25, color: '#00818E'},
  inputContainer: {
    flexDirection: 'row',
    width: '40%',
    padding: 20,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    borderTopStartRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#FF6B6B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    width: '30%',
    backgroundColor: 'red',
    backgroundColor: '#00818E',
    alignSelf: 'center',

    //   marginHorizontal: '30%',
    // marginBottom:20,
  },
  startButton: {
    fontSize: 20,
    color: '#fff',
    padding: 20,
    alignSelf: 'center',
  },
});

export default styles;
