import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firebase, db} from '../../../firebase';

import styles from './style';
const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = useState(''); // Add this line if you want users to set their username during registration

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!email || !password || !username) {
      alert('Please fill all fields');
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
            console.log('User profile created!');
            navigation.navigate('PomodoroTimer'); // Navigate to the main screen after registration
          });
      })
      .catch(error => {
        console.error('Registration error:', error.message);
        alert('Failed to register: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
