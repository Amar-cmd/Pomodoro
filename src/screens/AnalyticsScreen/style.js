import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
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
  sessionContainer: {
    width: '90%',
    padding: 10,
    marginVertical: 10,
    marginBottom: 20,
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
  total: {
    fontSize: 30,
    color: '#00818E',
    marginTop: 30,
    borderBottomColor: '#00818E',
    borderBottomWidth: 2,
  },
  heading: {
    color: '#00818E',
    fontSize: 20,
  },
  score: {color: '#FF6B6B', fontSize: 30, marginTop: 10, fontWeight: '500'},
});

export default styles;
