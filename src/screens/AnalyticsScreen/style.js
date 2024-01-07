import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // height: Dimensions.get('window').height,
    height: '100%',
    backgroundColor: '#fff',
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
  inputContainer: {
    // width: '40%',
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
  heading: {
    color: '#00818E',
    fontSize: 20,
  },
  score: {color: '#FF6B6B', fontSize: 30, marginTop:10, fontWeight:'500'},
});

export default styles;