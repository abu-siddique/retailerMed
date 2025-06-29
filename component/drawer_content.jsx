import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';

import Logo from '../assets/images/medclavis_logo.png';
import Icons from './common/icons';
import { userLogout } from './store';

// Custom drawer item component to ensure full text display
const CustomDrawerItem = ({ label, icon, onPress, color = "#1A237E" }) => {
  return (
    <TouchableOpacity 
      style={styles.customDrawerItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.drawerIconContainer}>
        {icon}
      </View>
      <Text style={[styles.drawerItemText, { color }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function CustomDrawerContent(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  
  // If on Android, disable SMS retriever to prevent errors
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        // Safely handle any potential SMS retriever module
        const SMS_MODULE = global.SMS_MODULE || {};
        // Clear any listeners or pending operations
        if (SMS_MODULE.removeAllListeners) {
          SMS_MODULE.removeAllListeners();
        }
      } catch (error) {
        console.log('SMS module cleanup error:', error);
      }
    }
  }, []);
  
  const handleLogout = () => {
    dispatch(userLogout());
    router.replace('/(auth)/login');
  };

  const iconSize = moderateScale(22);

  return (
    <View style={styles.container}>
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.drawerContent}
        style={styles.scrollView}
      >
        {/* Header section with logo and user info */}
        <View style={styles.drawerHeader}>
          <Image 
            source={Logo} 
            style={{
              width: moderateScale(150), 
              height: moderateVerticalScale(50), 
              resizeMode: 'contain'
            }} 
          />
          
          {userData ? (
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'G'}
                </Text>
              </View>
              <Text style={styles.userName}>{userData?.name || 'Guest User'}</Text>
              <Text style={styles.userRole}>{userData?.role || 'Pharmacy'}</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.loginButtonText}>Login / Register</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Custom Drawer Items */}
        <View style={styles.drawerItemsContainer}>
          <CustomDrawerItem
            label="Home"
            icon={<Icons.Ionicons name="home-outline" size={iconSize} color="#1A237E" />}
            onPress={() => router.replace('/(main)/(tabs)')}
          />
          
          <CustomDrawerItem
            label="My Orders"
            icon={<Icons.MaterialIcons name="shopping-bag" size={iconSize} color="#1A237E" />}
            onPress={() => router.push('/(main)/(tabs)/order_history')}
          />
          
          <CustomDrawerItem
            label="Inventory"
            icon={<Icons.MaterialIcons name="inventory" size={iconSize} color="#1A237E" />}
            onPress={() => router.push('/inventory')}
          />
          
          <CustomDrawerItem
            label="Prescription Upload"
            icon={<Icons.FontAwesome5 name="prescription" size={iconSize} color="#1A237E" />}
            onPress={() => router.push('/prescription-upload')}
          />
          
          <CustomDrawerItem
            label="Wholesaler Catalog"
            icon={<Icons.Ionicons name="book-outline" size={iconSize} color="#1A237E" />}
            onPress={() => router.push('/catalog')}
          />
          
          <CustomDrawerItem
            label="Returns & Claims"
            icon={<Icons.MaterialIcons name="assignment-return" size={iconSize} color="#1A237E" />}
            onPress={() => router.push('/returns')}
          />
          
          <CustomDrawerItem
            label="Invoices & Bills"
            icon={<Icons.FontAwesome name="file-text-o" size={iconSize} color="#1A237E" />}
            onPress={() => router.push('/invoices')}
          />
          
          <CustomDrawerItem
            label="Support & Help"
            icon={<Icons.Ionicons name="help-circle-outline" size={iconSize} color="#1A237E" />}
            onPress={() => router.push('/support')}
          />
          
          <CustomDrawerItem
            label="Settings"
            icon={<Icons.Ionicons name="settings-outline" size={iconSize} color="#1A237E" />}
            onPress={() => router.push('/settings')}
          />
        </View>
      </DrawerContentScrollView>
      
      {/* Footer with logout button and version info - outside the scroll view */}
      <View style={styles.footer}>
        {/* Divider before logout */}
        <View style={styles.divider} />
        
        {/* Logout Button */}
        {userData && (
          <CustomDrawerItem
            label="Logout"
            icon={<Icons.Ionicons name="log-out-outline" size={iconSize} color="#F44336" />}
            color="#F44336"
            onPress={handleLogout}
          />
        )}
        
        {/* Version info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  drawerContent: {
    flexGrow: 1,
    paddingTop: 0,
  },
  drawerHeader: {
    padding: moderateScale(16),
    backgroundColor: '#F3F4FF',
    alignItems: 'center',
    paddingTop: moderateVerticalScale(40),
    paddingBottom: moderateVerticalScale(20),
  },
  userInfo: {
    alignItems: 'center',
    marginTop: moderateVerticalScale(16),
  },
  userAvatar: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(8),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: moderateScale(24),
    fontWeight: 'bold',
  },
  userName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#1A237E',
  },
  userRole: {
    fontSize: moderateScale(12),
    color: '#64748B',
    marginTop: moderateVerticalScale(2),
  },
  loginButton: {
    backgroundColor: '#1A237E',
    paddingVertical: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(8),
    marginTop: moderateVerticalScale(16),
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: moderateVerticalScale(8),
  },
  drawerItemsContainer: {
    paddingTop: moderateVerticalScale(4),
    paddingHorizontal: moderateScale(12),
    paddingBottom: moderateVerticalScale(8),
  },
  customDrawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginVertical: moderateVerticalScale(2),
  },
  drawerIconContainer: {
    width: moderateScale(24),
    alignItems: 'center',
    marginRight: moderateScale(32),
  },
  drawerItemText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#1A237E',
    flex: 1,
  },
  footer: {
    paddingHorizontal: moderateScale(12),
    paddingBottom: moderateVerticalScale(20),
  },
  versionText: {
    fontSize: moderateScale(12),
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: moderateVerticalScale(16),
  },
});