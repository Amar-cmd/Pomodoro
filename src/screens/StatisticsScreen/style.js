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
    paddingVertical: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff6',
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#00818E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#00818E',
  },
  modalButton: {
    width: '50%',
    backgroundColor: '#00818E',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default styles;
