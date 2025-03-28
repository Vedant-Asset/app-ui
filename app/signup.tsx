import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { STORAGE_KEYS, saveData } from "../utils/storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function Signup(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Define Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    panCard: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input change
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // Input Validation
  const validateInputs = (): boolean => {
    let newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = "Enter a valid 10-digit number";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panCard))
      newErrors.panCard = "Invalid PAN format (e.g., ABCDE1234F)";
    if (form.password.length < 6) newErrors.password = "Minimum 6 characters required";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Signup Submission
  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      setIsLoading(true);
      await saveData(STORAGE_KEYS.USER_DATA, {
        email: form.email,
        name: form.name,
        mobile: form.mobile,
        createdAt: new Date().toISOString(),
      });

      router.push("/otpMobile");
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable Input Component
  const InputField = ({
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    secureTextEntry = false,
    error,
    icon,
    fieldKey,
  }: {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: "default" | "email-address" | "numeric" | "number-pad" | "phone-pad";
    secureTextEntry?: boolean;
    error?: string;
    icon: string;
    fieldKey: string;
  }) => (
    <View style={styles.inputWrapper}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? "#FF3B30"
              : focusedInput === fieldKey
              ? "#007AFF"
              : "#E5E5EA",
          },
        ]}
      >
        <MaterialIcons
          name={icon as any}
          size={20}
          color={error ? "#FF3B30" : focusedInput === fieldKey ? "#007AFF" : "#8E8E93"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onFocus={() => setFocusedInput(fieldKey)}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to get start</Text>
        </View>

        {/* Input Fields */}
        <InputField placeholder="Full Name" value={form.name} onChangeText={(text) => handleChange("name", text)} error={errors.name} icon="person" fieldKey="name" />
        <InputField placeholder="Email Address" value={form.email} onChangeText={(text) => handleChange("email", text)} keyboardType="email-address" error={errors.email} icon="email" fieldKey="email" />
        <InputField placeholder="Mobile Number" value={form.mobile} onChangeText={(text) => handleChange("mobile", text)} keyboardType="phone-pad" error={errors.mobile} icon="phone" fieldKey="mobile" />
        <InputField placeholder="PAN Card Number" value={form.panCard} onChangeText={(text) => handleChange("panCard", text)} error={errors.panCard} icon="credit-card" fieldKey="panCard" />
        <InputField placeholder="Password" value={form.password} onChangeText={(text) => handleChange("password", text)} secureTextEntry keyboardType="default" error={errors.password} icon="lock" fieldKey="password" />
        <InputField placeholder="Confirm Password" value={form.confirmPassword} onChangeText={(text) => handleChange("confirmPassword", text)} secureTextEntry keyboardType="default" error={errors.confirmPassword} icon="lock-outline" fieldKey="confirmPassword" />

        {/* Signup Button */}
        <TouchableOpacity style={[styles.button, isLoading && styles.button]} onPress={handleSignup} disabled={isLoading} activeOpacity={0.8}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}> Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 48,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    height: "100%",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 16,
  },
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  footerText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  linkText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
});
