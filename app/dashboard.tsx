import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { STORAGE_KEYS, getData } from "../utils/storage";
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = React.useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [documents, setDocuments] = React.useState<{
    pan?: string;
    uidFront?: string;
    uidBack?: string;
  }>({});

  React.useEffect(() => {
    const fetchData = async () => {
      // Fetch user data
      const data = await getData(STORAGE_KEYS.USER_DATA);
      if (data) {
        setUserData(data);
      }

      // Fetch document images
      const [panImage, uidFrontImage, uidBackImage] = await Promise.all([
        getData(STORAGE_KEYS.PAN_IMAGE),
        getData(STORAGE_KEYS.UID_FRONT_IMAGE),
        getData(STORAGE_KEYS.UID_BACK_IMAGE),
      ]);

      setDocuments({
        pan: panImage,
        uidFront: uidFrontImage,
        uidBack: uidBackImage,
      });
    };
    fetchData();
  }, []);

  const MenuItem = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon as any} size={24} color="#333" />
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  const navigateToFundList = (router: any, category: string) => {
    router.push({
      pathname: "/fundlist",
      params: { category }
    });
  };

  const renderStatCard = (title: string, value: string, color: string) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderDocumentSection = () => {
    if (!documents.pan && !documents.uidFront && !documents.uidBack) {
      return null;
    }

    return (
      <View style={styles.documentsSection}>
        <Text style={styles.sectionTitle}>Your Documents</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.documentsScroll}>
          {documents.pan && (
            <View style={styles.documentCard}>
              <Image source={{ uri: documents.pan }} style={styles.documentImage} />
              <Text style={styles.documentLabel}>PAN Card</Text>
            </View>
          )}
          {documents.uidFront && (
            <View style={styles.documentCard}>
              <Image source={{ uri: documents.uidFront }} style={styles.documentImage} />
              <Text style={styles.documentLabel}>UID Front</Text>
            </View>
          )}
          {documents.uidBack && (
            <View style={styles.documentCard}>
              <Image source={{ uri: documents.uidBack }} style={styles.documentImage} />
              <Text style={styles.documentLabel}>UID Back</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.userName}>{userData?.name || "User"}</Text>
        </View>
        <TouchableOpacity style={styles.notificationBadge}>
          <Text style={styles.notificationText}>2</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <View style={styles.menuOverlay}>
          <View style={styles.menu}>
            <View style={styles.menuHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{userData?.name?.[0] || 'U'}</Text>
              </View>
              <Text style={styles.menuUserName}>{userData?.name || 'User'}</Text>
              <Text style={styles.menuUserEmail}>{userData?.email || ''}</Text>
            </View>
            
            <MenuItem
              icon="person-outline"
              label="Account Details"
              onPress={() => {
                setIsMenuOpen(false);
                router.push('../account');
              }}
            />
            <MenuItem
              icon="person-circle-outline"
              label="Profile"
              onPress={() => {
                setIsMenuOpen(false);
                router.push('../profile');
              }}
            />
            <MenuItem
              icon="lock-closed-outline"
              label="Change Password"
              onPress={() => {
                setIsMenuOpen(false);
                router.push('../change-password');
              }}
            />
            <View />
            <MenuItem
              icon="log-out-outline"
              label="Logout"
              onPress={() => {
                setIsMenuOpen(false);
                router.replace('../login');
              }}
            />
          </View>
          <TouchableOpacity 
            style={styles.menuOverlayBackground}
            onPress={() => setIsMenuOpen(false)}
          />
        </View>
      )}

      {/* Rest of the dashboard content */}
      <ScrollView style={styles.content}>
        {/* Quick Stats */}
        {/* <View style={styles.statsContainer}>
          {renderStatCard("", "Large Cap", "#4CAF50")}
          {renderStatCard("", "Mid cap", "#2196F3")}
          {renderStatCard("", "Small Cap", "#FF9800")}
        </View> */}
        <View style={styles.statsContainer}>
          {/* {renderStatCard("", "High return", "#4CAF50")}
          {renderStatCard("", "LongTerm", "#2196F3")}
          {renderStatCard("", "छोटी SIP", "#FF9800")} */}
        </View>

        {/* Recent Activity */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>↑</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Fund Transfer</Text>
                <Text style={styles.activitySubtitle}>To: </Text>
              </View>
              <Text style={styles.activityAmount}>-₹5,00</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: "#4CAF50" }]}>
                <Text style={styles.activityIconText}>↓</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Received</Text>
                <Text style={styles.activitySubtitle}>From:</Text>
              </View>
              <Text style={[styles.activityAmount, { color: "#4CAF50" }]}>+₹9,500</Text>
            </View>
          </View>
        </View> */}

        {/* Investment Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Options</Text>
          <View style={styles.investmentGrid}>
            <TouchableOpacity
              style={styles.investmentCard}
              onPress={() => navigateToFundList(router, "Large Cap")}
            >
              <View style={[styles.investmentIcon, { backgroundColor: "#2196F3" }]}>
                <Text style={styles.investmentIconText}>L</Text>
              </View>
              <Text style={styles.investmentTitle}>Large Cap</Text>
              <Text style={styles.investmentDesc}>Stable, blue-chip companies</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.investmentCard}
              onPress={() => navigateToFundList(router, "Mid Cap")}
            >
              <View style={[styles.investmentIcon, { backgroundColor: "#4CAF50" }]}>
                <Text style={styles.investmentIconText}>M</Text>
              </View>
              <Text style={styles.investmentTitle}>Mid Cap</Text>
              <Text style={styles.investmentDesc}>Growing mid-sized firms</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.investmentCard}
              onPress={() => navigateToFundList(router, "Small Cap")}
            >
              <View style={[styles.investmentIcon, { backgroundColor: "#FF9800" }]}>
                <Text style={styles.investmentIconText}>S</Text>
              </View>
              <Text style={styles.investmentTitle}>Small Cap</Text>
              <Text style={styles.investmentDesc}>High-growth potential</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.investmentCard}
              onPress={() => navigateToFundList(router, "High Return")}
            >
              <View style={[styles.investmentIcon, { backgroundColor: "#E91E63" }]}>
                <Text style={styles.investmentIconText}>H</Text>
              </View>
              <Text style={styles.investmentTitle}>High Return</Text>
              <Text style={styles.investmentDesc}>Best performing funds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.investmentCard}
              onPress={() => navigateToFundList(router, "Small SIP")}
            >
              <View style={[styles.investmentIcon, { backgroundColor: "#9C27B0" }]}>
                <Text style={styles.investmentIconText}>₹</Text>
              </View>
              <Text style={styles.investmentTitle}>Small SIP</Text>
              <Text style={styles.investmentDesc}>Start with ₹100</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.investmentCard}
              onPress={() => navigateToFundList(router, "Mid Cap")}
            >
              <View style={[styles.investmentIcon, { backgroundColor: "#4CAF50" }]}>
                <Text style={styles.investmentIconText}>C</Text>
              </View>
              <Text style={styles.investmentTitle}>Chhoti SIP</Text>
              <Text style={styles.investmentDesc}>Extra small investment</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>↑</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Fund Transfer</Text>
                <Text style={styles.activitySubtitle}>To: </Text>
              </View>
              <Text style={styles.activityAmount}>-₹1,000</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: "#4CAF50" }]}>
                <Text style={styles.activityIconText}>↓</Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Received</Text>
                <Text style={styles.activitySubtitle}>From:</Text>
              </View>
              <Text style={[styles.activityAmount, { color: "#4CAF50" }]}>+₹9,500</Text>
            </View>
          </View>
        </View>

        {/* Account Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Overview</Text>
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>Account Number</Text>
              <Text style={styles.accountValue}>{userData?.bankDetails?.accountNo || "XXXX XXXX XXXX"}</Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>IFSC Code</Text>
              <Text style={styles.accountValue}>{userData?.bankDetails?.ifscCode || "XXXXX0000XXX"}</Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>Branch</Text>
              <Text style={styles.accountValue}>{userData?.bankDetails?.branchName || "Main Branch"}</Text>
            </View>
          </View>
        </View>

        {/* Documents Section - Moved to bottom */}
        {renderDocumentSection()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationBadge: {
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuOverlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#fff',
    zIndex: 1001,
  },
  menuHeader: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  menuUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuUserEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statTitle: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  activityList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    gap: 15,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF5252",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityIconText: {
    color: "#fff",
    fontSize: 18,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  activitySubtitle: {
    fontSize: 14,
    color: "#666",
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF5252",
  },
  documentsSection: {
    padding: 20,
    marginBottom: 20,
  },
  documentsScroll: {
    flexGrow: 0,
  },
  documentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  accountCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  accountInfo: {
    marginBottom: 15,
  },
  accountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  accountValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  investmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
    padding: 5,
  },
  investmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: "47%",
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  investmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  investmentIconText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  investmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  investmentDesc: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});