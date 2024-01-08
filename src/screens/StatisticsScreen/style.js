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
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  heading: {
    fontSize: 16,
    color: '#00818E',
    // marginTop: 20,
    // marginBottom: 10,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: '#EBFFFE',
  },
  toggleText: {
    fontSize: 16,
    color: '#00818E',
    textTransform: 'capitalize',
  },
  chart: {
    //   backgroundColor: 'red',
      paddingVertical:20,
  },
});

export default styles;
