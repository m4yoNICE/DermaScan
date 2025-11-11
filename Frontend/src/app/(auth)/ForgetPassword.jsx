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
    <View style={styles.card}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleForgetPassword}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  </View>
  )
}

export default ForgetPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#00cccc", // main background color
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#00cccc", // matches theme
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#00cccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
})