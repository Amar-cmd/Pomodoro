import {firebase} from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
// import '@react-native-firebase/storage';

const db = firebase.firestore();

export {firebase, db};
