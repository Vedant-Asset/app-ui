import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

// Define types for our fund data
type FundInfo = {
  name: string;
  returns: string;
  aum: string;
  minSIP: string;
};

type FundCategories = {
  [key: string]: FundInfo[];
};

// Mock data for different fund categories
const fundData: FundCategories = {
  "Large Cap": [
    { name: "HDFC Top 100 Fund", returns: "15.8%", aum: "₹22,450 Cr", minSIP: "₹500" },
    { name: "Axis Bluechip Fund", returns: "14.5%", aum: "₹18,900 Cr", minSIP: "₹500" },
    { name: "ICICI Pru Bluechip Fund", returns: "13.9%", aum: "₹20,100 Cr", minSIP: "₹100" },
    { name: "SBI Bluechip Fund", returns: "13.2%", aum: "₹16,780 Cr", minSIP: "₹500" },
    { name: "Mirae Asset Large Cap", returns: "14.8%", aum: "₹19,200 Cr", minSIP: "₹1,000" },
  ],
  "Mid Cap": [
    { name: "Kotak Emerging Equity", returns: "18.5%", aum: "₹12,450 Cr", minSIP: "₹1,000" },
    { name: "HDFC Mid-Cap Fund", returns: "17.2%", aum: "₹15,600 Cr", minSIP: "₹500" },
    { name: "Axis Midcap Fund", returns: "16.8%", aum: "₹13,900 Cr", minSIP: "₹500" },
    { name: "DSP Midcap Fund", returns: "16.5%", aum: "₹11,200 Cr", minSIP: "₹500" },
    { name: "L&T Midcap Fund", returns: "17.8%", aum: "₹10,500 Cr", minSIP: "₹500" },
  ],
  "Small Cap": [
    { name: "SBI Small Cap Fund", returns: "21.5%", aum: "₹8,900 Cr", minSIP: "₹500" },
    { name: "Nippon Small Cap Fund", returns: "20.8%", aum: "₹7,600 Cr", minSIP: "₹500" },
    { name: "Axis Small Cap Fund", returns: "19.9%", aum: "₹6,800 Cr", minSIP: "₹500" },
    { name: "HDFC Small Cap Fund", returns: "19.2%", aum: "₹7,200 Cr", minSIP: "₹500" },
    { name: "DSP Small Cap Fund", returns: "20.2%", aum: "₹6,500 Cr", minSIP: "₹500" },
  ],
  "High Return": [
    { name: "Quant Small Cap Fund", returns: "32.5%", aum: "₹4,500 Cr", minSIP: "₹1,000" },
    { name: "PGIM Midcap Fund", returns: "28.8%", aum: "₹5,600 Cr", minSIP: "₹1,000" },
    { name: "Tata Digital India", returns: "27.5%", aum: "₹6,800 Cr", minSIP: "₹500" },
    { name: "Parag Parikh Flexi Cap", returns: "25.2%", aum: "₹8,900 Cr", minSIP: "₹1,000" },
    { name: "Canara Robeco Small Cap", returns: "26.8%", aum: "₹4,200 Cr", minSIP: "₹1,000" },
  ],
  "Small SIP": [
    { name: "UTI Nifty Index Fund", returns: "12.5%", aum: "₹15,600 Cr", minSIP: "₹100" },
    { name: "ICICI Pru Nifty Index", returns: "12.2%", aum: "₹14,800 Cr", minSIP: "₹100" },
    { name: "SBI Nifty Index Fund", returns: "12.4%", aum: "₹13,900 Cr", minSIP: "₹100" },
    { name: "HDFC Index Fund", returns: "12.3%", aum: "₹14,200 Cr", minSIP: "₹100" },
    { name: "Axis Nifty 100 Fund", returns: "12.6%", aum: "₹12,800 Cr", minSIP: "₹100" },
  ],
};

export default function FundList() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [selectedCategory, setSelectedCategory] = useState(category || "Large Cap");

  // Mock graph data points
  const graphPoints = [60, 75, 68, 82, 91, 85, 95, 88, 98];

  const renderGraph = () => (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Performance Trend</Text>
      <View style={styles.graph}>
        {graphPoints.map((point, index) => (
          <View key={index} style={styles.graphPointContainer}>
            <View style={[styles.graphPoint, { height: point }]} />
          </View>
        ))}
      </View>
      <View style={styles.graphLabels}>
        <Text style={styles.graphLabel}>1Y</Text>
        <Text style={styles.graphLabel}>3Y</Text>
        <Text style={styles.graphLabel}>5Y</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mutual Funds</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {Object.keys(fundData).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === cat && styles.categoryTextActive
            ]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderGraph()}

      <View style={styles.fundListContainer}>
        <Text style={styles.sectionTitle}>Top 5 {selectedCategory} Funds</Text>
        {fundData[selectedCategory].map((fund, index) => (
          <TouchableOpacity key={index} style={styles.fundCard}>
            <View style={styles.fundHeader}>
              <Text style={styles.fundName}>{fund.name}</Text>
              <Text style={styles.returns}>Returns: {fund.returns}</Text>
            </View>
            <View style={styles.fundDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>AUM</Text>
                <Text style={styles.detailValue}>{fund.aum}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Min. SIP</Text>
                <Text style={styles.detailValue}>{fund.minSIP}</Text>
              </View>
              <TouchableOpacity style={styles.investButton}>
                <Text style={styles.investButtonText}>Invest Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFA500",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  categoryContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  categoryButtonActive: {
    backgroundColor: "#FFA500",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  graphContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  graph: {
    height: 150,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  graphPointContainer: {
    flex: 1,
    alignItems: "center",
  },
  graphPoint: {
    width: 8,
    backgroundColor: "#FFA500",
    borderRadius: 4,
  },
  graphLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  graphLabel: {
    fontSize: 12,
    color: "#666",
  },
  fundListContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  fundCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  fundName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  returns: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  fundDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  investButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  investButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});