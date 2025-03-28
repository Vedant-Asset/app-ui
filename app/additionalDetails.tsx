import React, { useState, useRef, type JSX, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { STORAGE_KEYS, getData, saveData } from '../utils/storage';
import Dashboard from "./dashboard";

export default function AdditionalDetails(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [panNumber, setPanNumber] = useState("");
  const [nameAsPerPan, setNameAsPerPan] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [hasNominee, setHasNominee] = useState<boolean | null>(null);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeDob, setNomineeDob] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [nomineeAge, setNomineeAge] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountType, setAccountType] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [bankAddress, setBankAddress] = useState("");

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const animatedBorder = useRef(new Animated.Value(0)).current;

  // Update progress bar when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep / 5) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // Function to start glowing animation on focus
  const startGlowEffect = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedBorder, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedBorder, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  // Function to validate PAN number
  const validatePanNumber = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  // Function to validate inputs
  const validateInputs = () => {
    let newErrors: Record<string, boolean> = {};

    if (currentStep === 1) {
      if (!panNumber || !validatePanNumber(panNumber)) {
        newErrors.panNumber = true;
        Alert.alert('Invalid PAN', 'Please enter a valid PAN number (e.g., ABCDE1234F)');
        return false;
      }
      if (!nameAsPerPan) {
        newErrors.nameAsPerPan = true;
        Alert.alert('Error', 'Please enter your name as per PAN');
        return false;
      }
      if (!dateOfBirth) {
        newErrors.dateOfBirth = true;
        Alert.alert('Error', 'Please enter your date of birth');
        return false;
      }
      if (!email.includes("@")) {
        newErrors.email = true;
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return false;
      }
      if (mobile.length !== 10) {
        newErrors.mobile = true;
        Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit mobile number');
        return false;
      }
      if (!gender) {
        newErrors.gender = true;
        Alert.alert('Error', 'Please select your gender');
        return false;
      }
    } else if (currentStep === 2) {
      if (!addressLine1) {
        newErrors.addressLine1 = true;
        Alert.alert('Error', 'Please enter your address line 1');
        return false;
      }
      if (!pinCode || pinCode.length !== 6) {
        newErrors.pinCode = true;
        Alert.alert('Invalid PIN', 'Please enter a valid 6-digit PIN code');
        return false;
      }
      if (!city) {
        newErrors.city = true;
        Alert.alert('Error', 'Please enter your city');
        return false;
      }
      if (!state) {
        newErrors.state = true;
        Alert.alert('Error', 'Please enter your state');
        return false;
      }
    } else if (currentStep === 3) {
      if (hasNominee === null) {
        Alert.alert('Error', 'Please select whether you want to declare a nominee');
        return false;
      }
      if (hasNominee) {
        if (!nomineeName) {
          newErrors.nomineeName = true;
          Alert.alert('Error', 'Please enter nominee name');
          return false;
        }
        if (!nomineeDob) {
          newErrors.nomineeDob = true;
          Alert.alert('Error', 'Please enter nominee date of birth');
          return false;
        }
        if (!nomineeRelation) {
          newErrors.nomineeRelation = true;
          Alert.alert('Error', 'Please enter relation with nominee');
          return false;
        }
        if (!nomineeAge || isNaN(Number(nomineeAge))) {
          newErrors.nomineeAge = true;
          Alert.alert('Error', 'Please enter valid nominee age');
          return false;
        }
      }
    } else if (currentStep === 4) {
      if (!password || password.length < 8) {
        newErrors.password = true;
        Alert.alert('Invalid Password', 'Password must be at least 8 characters long');
        return false;
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = true;
        Alert.alert('Password Mismatch', 'Passwords do not match');
        return false;
      }
    } else if (currentStep === 5) {
      if (!ifscCode || ifscCode.length !== 11) {
        newErrors.ifscCode = true;
        Alert.alert('Invalid IFSC', 'Please enter a valid 11-digit IFSC code');
        return false;
      }
      if (!accountNo || accountNo.length < 9) {
        newErrors.accountNo = true;
        Alert.alert('Invalid Account', 'Please enter a valid account number');
        return false;
      }
      if (!accountType) {
        newErrors.accountType = true;
        Alert.alert('Error', 'Please select account type');
        return false;
      }
      if (!bankName) {
        newErrors.bankName = true;
        Alert.alert('Error', 'Please enter bank name');
        return false;
      }
      if (!branchName) {
        newErrors.branchName = true;
        Alert.alert('Error', 'Please enter branch name');
        return false;
      }
      if (!bankAddress) {
        newErrors.bankAddress = true;
        Alert.alert('Error', 'Please enter bank address');
        return false;
      }
    }

    setErrors(newErrors);
    return true;
  };

  // Function to handle next step
  const handleNext = () => {
    if (!validateInputs()) {
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to handle signup
  const handleSignup = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!validateInputs()) {
        setIsLoading(false);
        return;
      }

      // Create user data object with all details
      const userData = {
        email,
        name: nameAsPerPan,
        mobile,
        panNumber,
        dateOfBirth,
        gender,
        address: {
          line1: addressLine1,
          line2: addressLine2,
          pinCode,
          city,
          state
        },
        nominee: hasNominee ? {
          name: nomineeName,
          dateOfBirth: nomineeDob,
          relation: nomineeRelation,
          age: nomineeAge
        } : null,
        bankDetails: {
          ifscCode,
          accountNo,
          accountType,
          bankName,
          branchName,
          bankAddress
        },
        createdAt: new Date().toISOString(),
      };

      // Store user data locally
      await saveData(STORAGE_KEYS.USER_DATA, userData);
      
      // Navigate to dashboard after successful submission
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>PAN KYC Check</Text>
            
            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.panNumber ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="PAN Number"
                value={panNumber}
                onChangeText={setPanNumber}
                autoCapitalize="characters"
                maxLength={10}
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.nameAsPerPan ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Name as per PAN"
                value={nameAsPerPan}
                onChangeText={setNameAsPerPan}
                autoCapitalize="words"
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.dateOfBirth ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (DD/MM/YYYY)"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                keyboardType="numeric"
                maxLength={10}
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.email ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.mobile ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="number-pad"
                maxLength={10}
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender:</Text>
              <View style={styles.genderOptions}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'Male' && styles.genderButtonActive
                  ]}
                  onPress={() => setGender('Male')}
                >
                  <Text style={[
                    styles.genderButtonText,
                    gender === 'Male' && styles.genderButtonTextActive
                  ]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'Female' && styles.genderButtonActive
                  ]}
                  onPress={() => setGender('Female')}
                >
                  <Text style={[
                    styles.genderButtonText,
                    gender === 'Female' && styles.genderButtonTextActive
                  ]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Address Details</Text>
            
            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.addressLine1 ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Address Line 1"
                value={addressLine1}
                onChangeText={setAddressLine1}
                autoCapitalize="words"
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Address Line 2 (Optional)"
                value={addressLine2}
                onChangeText={setAddressLine2}
                autoCapitalize="words"
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.pinCode ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="PIN Code"
                value={pinCode}
                onChangeText={setPinCode}
                keyboardType="number-pad"
                maxLength={6}
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.city ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
                autoCapitalize="words"
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.state ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="State"
                value={state}
                onChangeText={setState}
                autoCapitalize="words"
                onFocus={startGlowEffect}
              />
            </Animated.View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                <Text style={[styles.buttonText, { color: "#FFA500" }]}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Nominee Declaration</Text>
            
            <View style={styles.nomineeContainer}>
              <Text style={styles.nomineeQuestion}>Do you want to declare a nominee?</Text>
              <View style={styles.nomineeOptions}>
                <TouchableOpacity
                  style={[
                    styles.nomineeButton,
                    hasNominee === true && styles.nomineeButtonActive
                  ]}
                  onPress={() => setHasNominee(true)}
                >
                  <Text style={[
                    styles.nomineeButtonText,
                    hasNominee === true && styles.nomineeButtonTextActive
                  ]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.nomineeButton,
                    hasNominee === false && styles.nomineeButtonActive
                  ]}
                  onPress={() => setHasNominee(false)}
                >
                  <Text style={[
                    styles.nomineeButtonText,
                    hasNominee === false && styles.nomineeButtonTextActive
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            {hasNominee && (
              <>
                <Animated.View
                  style={[
                    styles.inputContainer,
                    { borderColor: errors.nomineeName ? "red" : animatedBorder.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["#ccc", "#FFA500"]
                      })
                    },
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Nominee Name"
                    value={nomineeName}
                    onChangeText={setNomineeName}
                    autoCapitalize="words"
                    onFocus={startGlowEffect}
                  />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.inputContainer,
                    { borderColor: errors.nomineeDob ? "red" : animatedBorder.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["#ccc", "#FFA500"]
                      })
                    },
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Nominee Date of Birth (DD/MM/YYYY)"
                    value={nomineeDob}
                    onChangeText={setNomineeDob}
                    keyboardType="numeric"
                    maxLength={10}
                    onFocus={startGlowEffect}
                  />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.inputContainer,
                    { borderColor: errors.nomineeRelation ? "red" : animatedBorder.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["#ccc", "#FFA500"]
                      })
                    },
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Relation with Nominee"
                    value={nomineeRelation}
                    onChangeText={setNomineeRelation}
                    autoCapitalize="words"
                    onFocus={startGlowEffect}
                  />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.inputContainer,
                    { borderColor: errors.nomineeAge ? "red" : animatedBorder.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["#ccc", "#FFA500"]
                      })
                    },
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Nominee Age"
                    value={nomineeAge}
                    onChangeText={setNomineeAge}
                    keyboardType="numeric"
                    maxLength={2}
                    onFocus={startGlowEffect}
                  />
                </Animated.View>
              </>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                <Text style={[styles.buttonText, { color: "#FFA500" }]}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Create Your Password</Text>
            <Text style={styles.stepSubtitle}>Atlest 8 chacter or digit</Text>
            
            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.password ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={startGlowEffect}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.inputContainer,
                { borderColor: errors.confirmPassword ? "red" : animatedBorder.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", "#FFA500"]
                  })
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onFocus={startGlowEffect}
              />
            </Animated.View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                <Text style={[styles.buttonText, { color: "#FFA500" }]}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Bank Details & Review</Text>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Bank Details</Text>
              
              <Animated.View
                style={[
                  styles.inputContainer,
                  { borderColor: errors.ifscCode ? "red" : animatedBorder.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["#ccc", "#FFA500"]
                    })
                  },
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="IFSC Code"
                  value={ifscCode}
                  onChangeText={setIfscCode}
                  autoCapitalize="characters"
                  maxLength={11}
                  onFocus={startGlowEffect}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.inputContainer,
                  { borderColor: errors.accountNo ? "red" : animatedBorder.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["#ccc", "#FFA500"]
                    })
                  },
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Account Number"
                  value={accountNo}
                  onChangeText={setAccountNo}
                  keyboardType="numeric"
                  maxLength={20}
                  onFocus={startGlowEffect}
                />
              </Animated.View>

              <View style={styles.accountTypeContainer}>
                <Text style={styles.accountTypeLabel}>Account Type:</Text>
                <View style={styles.accountTypeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.accountTypeButton,
                      accountType === 'Savings' && styles.accountTypeButtonActive
                    ]}
                    onPress={() => setAccountType('Savings')}
                  >
                    <Text style={[
                      styles.accountTypeButtonText,
                      accountType === 'Savings' && styles.accountTypeButtonTextActive
                    ]}>Savings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.accountTypeButton,
                      accountType === 'Current' && styles.accountTypeButtonActive
                    ]}
                    onPress={() => setAccountType('Current')}
                  >
                    <Text style={[
                      styles.accountTypeButtonText,
                      accountType === 'Current' && styles.accountTypeButtonTextActive
                    ]}>Current</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Animated.View
                style={[
                  styles.inputContainer,
                  { borderColor: errors.bankName ? "red" : animatedBorder.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["#ccc", "#FFA500"]
                    })
                  },
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Bank Name"
                  value={bankName}
                  onChangeText={setBankName}
                  autoCapitalize="words"
                  onFocus={startGlowEffect}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.inputContainer,
                  { borderColor: errors.branchName ? "red" : animatedBorder.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["#ccc", "#FFA500"]
                    })
                  },
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Branch Name"
                  value={branchName}
                  onChangeText={setBranchName}
                  autoCapitalize="words"
                  onFocus={startGlowEffect}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.inputContainer,
                  { borderColor: errors.bankAddress ? "red" : animatedBorder.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["#ccc", "#FFA500"]
                    })
                  },
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Bank Address"
                  value={bankAddress}
                  onChangeText={setBankAddress}
                  autoCapitalize="words"
                  multiline
                  numberOfLines={3}
                  onFocus={startGlowEffect}
                />
              </Animated.View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Review All Details</Text>
              
              <View style={styles.reviewSection}>
                <Text style={styles.reviewSubTitle}>Personal Information</Text>
                <Text style={styles.reviewText}>Name: {nameAsPerPan}</Text>
                <Text style={styles.reviewText}>PAN: {panNumber}</Text>
                <Text style={styles.reviewText}>Date of Birth: {dateOfBirth}</Text>
                <Text style={styles.reviewText}>Email: {email}</Text>
                <Text style={styles.reviewText}>Mobile: {mobile}</Text>
                <Text style={styles.reviewText}>Gender: {gender}</Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewSubTitle}>Address Details</Text>
                <Text style={styles.reviewText}>Address Line 1: {addressLine1}</Text>
                <Text style={styles.reviewText}>Address Line 2: {addressLine2 || 'Not provided'}</Text>
                <Text style={styles.reviewText}>PIN Code: {pinCode}</Text>
                <Text style={styles.reviewText}>City: {city}</Text>
                <Text style={styles.reviewText}>State: {state}</Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewSubTitle}>Nominee Details</Text>
                {hasNominee ? (
                  <>
                    <Text style={styles.reviewText}>Nominee Name: {nomineeName}</Text>
                    <Text style={styles.reviewText}>Date of Birth: {nomineeDob}</Text>
                    <Text style={styles.reviewText}>Relation: {nomineeRelation}</Text>
                    <Text style={styles.reviewText}>Age: {nomineeAge}</Text>
                  </>
                ) : (
                  <Text style={styles.reviewText}>No nominee declared</Text>
                )}
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewSubTitle}>Bank Details</Text>
                <Text style={styles.reviewText}>Bank Name: {bankName}</Text>
                <Text style={styles.reviewText}>Branch: {branchName}</Text>
                <Text style={styles.reviewText}>IFSC: {ifscCode}</Text>
                <Text style={styles.reviewText}>Account Type: {accountType}</Text>
                <Text style={styles.reviewText}>Account Number: {accountNo}</Text>
                <Text style={styles.reviewText}>Bank Address: {bankAddress}</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                <Text style={[styles.buttonText, { color: "#FFA500" }]}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.finishButton, isLoading && styles.buttonDisabled]} 
                onPress={handleSignup}
                disabled={isLoading}
              >
                <Text style={styles.finishButtonText}>
                  {isLoading ? "Submitting..." : "Finish"}
                </Text>
              </TouchableOpacity>
            </View>
             <TouchableOpacity onPress={() => router.push("/dashboard")}>
                    <Text style={""}>yourdashboard</Text>
                  </TouchableOpacity>
          </View>
        
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>Step {currentStep} of 5</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {renderStep()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFA500",
  },
  progressContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFA500",
  },
  progressText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  input: {
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  genderContainer: {
    marginBottom: 20,
  },
  genderLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#666",
  },
  genderButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 10,
  },
  nextButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previousButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#FFA500",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reviewContainer: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  reviewText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  nomineeContainer: {
    marginBottom: 20,
  },
  nomineeQuestion: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  nomineeOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  nomineeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFA500",
    backgroundColor: "#fff",
  },
  nomineeButtonActive: {
    backgroundColor: "#FFA500",
  },
  nomineeButtonText: {
    fontSize: 16,
    color: "#FFA500",
    fontWeight: "600",
  },
  nomineeButtonTextActive: {
    color: "#fff",
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  reviewSection: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  reviewSubTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFA500",
    marginBottom: 10,
  },
  accountTypeContainer: {
    marginBottom: 15,
  },
  accountTypeLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  accountTypeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  accountTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFA500",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  accountTypeButtonActive: {
    backgroundColor: "#FFA500",
  },
  accountTypeButtonText: {
    fontSize: 16,
    color: "#FFA500",
    fontWeight: "600",
  },
  accountTypeButtonTextActive: {
    color: "#fff",
  },
  stepSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  finishButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
