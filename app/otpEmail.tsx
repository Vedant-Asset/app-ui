import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { STORAGE_KEYS, getData, saveData } from "../utils/storage"; // Ensure utils exist

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OtpEmail() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    // Simulating OTP verification
    const userData = await getData(STORAGE_KEYS.USER_DATA);
    if (!userData) {
      Alert.alert("Error", "User data not found. Please sign up again.");
      return;
    }

    // Save that email verification is done
    await saveData(STORAGE_KEYS.EMAIL_VERIFIED, true);

    // Navigate to Additional Details page
    router.push("/additionalDetails");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 15, textAlign: "center" },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
