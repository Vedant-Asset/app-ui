import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { STORAGE_KEYS, getData, saveData } from "../utils/storage";

export default function OtpMobile() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);

      // Simulating OTP verification
      const userData = await getData(STORAGE_KEYS.USER_DATA);
      if (!userData) {
        Alert.alert("Error", "User data not found. Please sign up again.");
        router.replace("/signup");
        return;
      }

      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
        // Save that mobile verification is done
        await saveData(STORAGE_KEYS.MOBILE_VERIFIED, true);
        
        // Navigate to Document Verification
        router.push("/documentVerification");
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Mobile OTP</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to your mobile</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleVerifyOtp}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.resendButton}
        onPress={() => Alert.alert("Info", "New OTP sent to your mobile")}
      >
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "#f8f8f8",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendButton: {
    padding: 10,
  },
  resendText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
