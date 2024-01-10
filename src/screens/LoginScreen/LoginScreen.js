import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast'; // Make sure to install this package

import styles from './style';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading

  const handleLogin = () => {
    if (!email || !password) {
      Toast.show('Please fill all fields', Toast.SHORT);
      return;
    }

    setLoading(true); 
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Toast.show('Signin Successful!', Toast.SHORT);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/wrong-password') {
          Alert.alert(
            'Login Error',
            'The password is incorrect. Please try again.',
          );
        } else {
          Alert.alert('Login Error', error.message); // Other errors
        }
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {loading ? (
        <ActivityIndicator size="large" color="#00818E" /> // Loading indicator
      ) : (
        <>
          <Text style={styles.title}>Welcome Back</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
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
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.linkText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};


export default LoginScreen;
