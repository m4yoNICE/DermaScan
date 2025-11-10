import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'

/**
 * 
 * Commented block line cause wala nakoy maisip na design kaayo only the intellisence 
 * na nag handle sa design.. but ang logic and stuff is logically input manual og gi review sa sites
 * 
 */

const ForgetPassword = () => {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

    // Handle forget password request
  const handleForgetPassword = async () => {
    if(!email.trim()){
      setMessage('Email is required');
      return;
    }
    setLoading(true);
    setMessage(''); 
    // Trying to send a request to the API (backend part)
    try {
      const response = await fetch('http://192.168.1.2:3000/api/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || 'Please check your email for reset instructions.');
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    }finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ForgetPassword</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgetPassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 18 }}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default ForgetPassword

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  }
})