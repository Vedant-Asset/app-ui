import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { STORAGE_KEYS, getData } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

interface DrawerProps {
  navigation: any;
}

export default function DrawerContent({ navigation }: DrawerProps) {
  const router = useRouter();
  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const data = await getData(STORAGE_KEYS.USER_DATA);
      if (data) {
        setUserData(data);
      }
    };
    fetchUserData();
  }, []);

  const DrawerItem = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Ionicons name={icon as any} size={24} color="#333" />
      <Text style={styles.drawerItemText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.drawerContent}>
      <View style={styles.userInfoSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{userData?.name?.[0] || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{userData?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{userData?.email || ''}</Text>
      </View>
      
      <DrawerItem
        icon="person-outline"
        label="Account Details"
        onPress={() => router.push('/account')}
      />
      <DrawerItem
        icon="person-circle-outline"
        label="Profile"
        onPress={() => router.push('/profile')}
      />
      <DrawerItem
        icon="lock-closed-outline"
        label="Change Password"
        onPress={() => router.push('/change-password')}
      />
      <View style={styles.divider} />
      <DrawerItem
        icon="log-out-outline"
        label="Logout"
        onPress={() => {
          // Add logout logic here
          router.replace('/login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userInfoSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
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
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
});
