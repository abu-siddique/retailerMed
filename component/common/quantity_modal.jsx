import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Button from './button';
import Icons from './icons';

const MAX_QUANTITY = 1000;

const QuantityModal = ({
  visible,
  onClose,
  onSave,
  initialQuantity = 1,
  productName,
  maxQuantity = MAX_QUANTITY,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity.toString());
  const [isAnimating, setIsAnimating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current; // Reduced slide distance

  useEffect(() => {
    if (visible) {
      setQuantity(initialQuantity.toString());
      setIsAnimating(true);
      
      // Set initial values to ensure no flash
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      // Animate modal in with a slight delay to ensure proper setup
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250, // Slightly faster animation
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsAnimating(false);
        });
      }, 10);
    } else {
      // Animate out and then reset values
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset animation values when modal closes
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
      });
    }
  }, [visible, initialQuantity]);

  // Rest of the functionality remains the same
  const handleDecrement = () => {
    const currentVal = parseInt(quantity) || 0;
    if (currentVal > 1) {
      setQuantity((currentVal - 1).toString());
    }
  };

  const handleIncrement = () => {
    const currentVal = parseInt(quantity) || 0;
    if (currentVal < maxQuantity) {
      setQuantity((currentVal + 1).toString());
    }
  };

  const handleChangeText = (text) => {
    // Allow only numeric input
    if (/^\d*$/.test(text)) {
      setQuantity(text);
    }
  };

  const handleSave = () => {
    let finalQuantity = parseInt(quantity);
    
    // Validate quantity
    if (isNaN(finalQuantity) || finalQuantity <= 0) {
      finalQuantity = 1;
    } else if (finalQuantity > maxQuantity) {
      finalQuantity = maxQuantity;
    }
    
    onSave(finalQuantity);
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true} // Ensure modal goes under status bar
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.container}>
            <Animated.View 
              style={[
                styles.overlay,
                { opacity: fadeAnim }
              ]} 
            />
            
            <Animated.View 
              style={[
                styles.modalContent,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }] // Only vertical translation
                }
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Set Quantity</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icons.Ionicons name="close" size={moderateScale(24)} color="#555" />
                </TouchableOpacity>
              </View>
              
              {productName && (
                <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                  {productName}
                </Text>
              )}
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  onPress={handleDecrement}
                  style={[
                    styles.quantityButton, 
                    parseInt(quantity) <= 1 && styles.quantityButtonDisabled
                  ]}
                  disabled={parseInt(quantity) <= 1}
                >
                  <Icons.AntDesign 
                    name="minus" 
                    size={moderateScale(20)} 
                    color={parseInt(quantity) <= 1 ? "#BBB" : "#2E7D32"} 
                  />
                </TouchableOpacity>
                
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={handleChangeText}
                  keyboardType="number-pad"
                  maxLength={4}
                  selectTextOnFocus
                  autoFocus={!isAnimating} // Only focus after animation completes
                />
                
                <TouchableOpacity 
                  onPress={handleIncrement}
                  style={[
                    styles.quantityButton,
                    parseInt(quantity) >= maxQuantity && styles.quantityButtonDisabled
                  ]}
                  disabled={parseInt(quantity) >= maxQuantity}
                >
                  <Icons.AntDesign 
                    name="plus" 
                    size={moderateScale(20)} 
                    color={parseInt(quantity) >= maxQuantity ? "#BBB" : "#2E7D32"} 
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.footer}>
                <Button 
                  onPress={onClose}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button 
                  onPress={handleSave}
                  style={styles.saveButton}
                >
                  Confirm
                </Button>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: scale(340),
    backgroundColor: 'white',
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#2E7D32',
  },
  closeButton: {
    padding: moderateScale(4),
  },
  productName: {
    fontSize: moderateScale(16),
    color: '#444',
    marginBottom: verticalScale(20),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(16),
  },
  quantityButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F0F0F0',
    borderColor: '#EEE',
  },
  quantityInput: {
    width: moderateScale(80),
    height: moderateScale(50),
    textAlign: 'center',
    fontSize: moderateScale(24),
    fontWeight: '600',
    marginHorizontal: moderateScale(20),
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: moderateScale(8),
    color: '#2E7D32',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(24),
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: moderateScale(10),
    minWidth: moderateScale(120),
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    marginLeft: moderateScale(10),
    minWidth: moderateScale(120),
  },
});

export default QuantityModal;