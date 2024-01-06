import {StyleSheet} from 'react-native';

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
  sectionOne: {
    // backgroundColor: '#9002',
  },
  cell: {
    // backgroundColor: '#a1f791',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
      marginHorizontal: 10,
    marginVertical:5,
  },
  cellHeading: {fontSize: 16, color: '#00818E'},
  textValue: {fontSize: 16, color: '#00818E'},
  inputContainer: {
    flexDirection: 'row',
    width: '30%',
    // height: '30%',
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
  sectionTwo: {
    padding: 10,
    marginTop: 20,
  },
  separator: {
    backgroundColor: '#00818E',
    height: 5,
    width: '20%',
  },
  labelInput: {fontSize: 16, color: '#00818E'},
  letterCount: {
    alignSelf: 'flex-end',
    marginRight: 10,
    fontSize: 14,
    color: '#00818E',
  },
  defaultLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  IndividualDefaultLabels: {
    width: '18%',
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
  defaultLabel: {
    color: '#00818E',
    padding: 10,
  },
  sectionThree: {
    padding: 10,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
      alignItems: 'center',
    paddingVertical:10,
  },
  optionsTitle: {
    color: '#00818E',
    fontSize: 18,
  },
});

export default styles;
