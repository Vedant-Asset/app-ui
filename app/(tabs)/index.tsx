import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions, 
  ScrollView, 
  Animated 
} from "react-native";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");

const carouselItems = [
  {
    id: "1",
    title: "Welcome to Vedant Asset",
    subtitle: "Your trusted partner in financial success",
    image: require("../../assets/images/one.png"),
  },
  {
    id: "2",
    title: "Professional Services",
    subtitle: "Expert financial guidance and solutions",
    image: require("../../assets/images/two.png"),
  },
  {
    id: "3",
    title: "Join Our Network",
    subtitle: "Become a partner and grow with us",
    image: require("../../assets/images/three.png"),
  },
];

const FrontPage = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % carouselItems.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (screenWidth - 70),
          animated: true,
        });
        return nextIndex;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (screenWidth - 70));
    setActiveIndex(index);
  };

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
          {/* Header with Logo and Partner Button */}
          <View style={styles.header}>
            <Image 
              source={require("../../assets/images/logo_main.png")} 
              style={styles.logo} 
            />
            <TouchableOpacity 
              style={styles.partnerButton} 
              onPress={() => router.push("/signup")}
            >
              <Text style={styles.partnerButtonText}>Become a Partner</Text>
            </TouchableOpacity>
          </View>

          {/* Carousel Section */}
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {carouselItems.map((item) => (
                <View 
                  key={item.id} 
                  style={[styles.carouselItem, { width: screenWidth - 70 }]}
                >
                  <Image 
                    source={item.image} 
                    style={styles.carouselImage} 
                  />
                  <Text style={styles.carouselTitle}>{item.title}</Text>
                  <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
                </View>
              ))}
            </ScrollView>
            
            {/* Pagination Indicators */}
            <View style={styles.paginationDots}>
              {carouselItems.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dot, 
                    { 
                      backgroundColor: index === activeIndex ? "#1A4B8C" : "#E0E0E0",
                      width: index === activeIndex ? 20 : 8
                    }
                  ]} 
                />
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.loginButton]} 
              onPress={() => router.push("/login")}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.signupButton]} 
              onPress={() => router.push("/signup")}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Footer with Terms */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text 
                style={styles.termsLink}
                // onPress={() => router.push("www.google.co.in")}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text 
                style={styles.termsLink}
                // onPress={() => router.push("/privacy")}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootView: { 
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollView: { 
    flex: 1 
  },
  contentContainer: { 
    flexGrow: 1, 
    paddingBottom: 30 
  },
  container: { 
    width: "90%", 
    alignItems: "center",
    alignSelf: 'center'
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
    paddingHorizontal: 20
  },
  logo: { 
    width: 150, 
    height: 40, 
    resizeMode: "contain" 
  },
  partnerButton: { 
    backgroundColor: "#1A4B8C",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  partnerButtonText: { 
    fontSize: 12, 
    fontWeight: "600", 
    color: "#FFF" 
  },
  carouselContainer: { 
    height: 280,
    marginBottom: 30
  },
  carouselItem: { 
    alignItems: "center", 
    justifyContent: "center",
    paddingHorizontal: 20
  },
  carouselImage: { 
    width: 180, 
    height: 100, 
    resizeMode: "contain", 
    marginBottom: 25 
  },
  carouselTitle: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8
  },
  carouselSubtitle: { 
    fontSize: 16, 
    color: "#64748B", 
    textAlign: "center",
    lineHeight: 24
  },
  paginationDots: { 
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: 8
  },
  dot: { 
    height: 8, 
    borderRadius: 4, 
    marginHorizontal: 4,
  },
  buttonsContainer: {
    width: '85%',
    marginTop: 20
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: "#1A4B8C",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1A4B8C',
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#FFF" 
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A4B8C",
  },
  termsContainer: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#1A4B8C",
    fontWeight: "600",
  },
});

export default FrontPage;