import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {firebase, db} from '../../../firebase';
import Toast from 'react-native-simple-toast';

import styles from './style';
const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = useState(''); // Add this line if you want users to set their username during registration

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading

  const handleRegister = () => {
    setLoading(true);
    if (!email || !password || !username) {
      Toast.show('Please fill all fields', Toast.SHORT);
      return;
    }

    // Use Firebase Authentication to create a new user
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // User registered
        const user = userCredential.user;
        console.log('Registered with:', user.email);

        // Add username to Firestore
        const userProfile = {
          uid: user.uid,
          email: user.email,
          username: username,
        };

        firestore()
          .collection('users')
          .doc(user.uid)
          .set(userProfile)
          .then(() => {
            Toast.show('User profile created!', Toast.SHORT);
            setLoading(false);

            // navigation.navigate('PomodoroTimer'); // Navigate to the main screen after registration
          });
      })
      .catch(error => {
        alert('Failed to register: ' + error.message);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {loading ? (
        <ActivityIndicator size="large" color="#00818E" /> // Loading indicator
      ) : (
        <>
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#aaa"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default RegisterScreen;
