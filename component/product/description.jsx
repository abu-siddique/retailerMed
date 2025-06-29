import { truncate } from '@/utils';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import useDisclosure from '../hooks/use_disclosure';


const Description = ({ description }) => {
  // State management for showing full description
  const [isShowDesc, showDescHandlers] = useDisclosure();
  const { width } = useWindowDimensions();

  // Prepare truncated HTML for the collapsed view
  const truncatedHtml = isShowDesc ? description : truncate(description, 300);

  return (
    <Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>Description</Text>
        <RenderHtml
            contentWidth={width}
            source={{ html: truncatedHtml }}
            baseStyle={styles.htmlBaseStyle}
            tagsStyles={{
              p: {
                  marginVertical: verticalScale(4),
                  marginBottom: 0,
                  fontSize: moderateScale(14, 0.8),
                  lineHeight: verticalScale(18),
              },
              div: {
                  marginVertical: 0,
              },
              br: {
                  height: verticalScale(8),
              },
              h1: {
                  fontSize: moderateScale(18, 0.8),
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: verticalScale(8),
                  marginTop: verticalScale(4),
              },
              h2: {
                  fontSize: moderateScale(18, 0.8),
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: verticalScale(6),
                  marginTop: verticalScale(4),
              },
              h3: {
                  fontSize: moderateScale(16, 0.8),
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: verticalScale(4),
                  marginTop: verticalScale(4),
              },
              strong: {
                  fontWeight: 'bold',
                  color: '#111827',
              },
              // Fix for lists
              ul: {
                  marginLeft: scale(8), // Pull lists slightly left to adjust alignment
                  paddingLeft: scale(16),
                  marginVertical: verticalScale(4),
              },
              li: {
                  marginBottom: verticalScale(4),
                  fontSize: moderateScale(14, 0.8),
              },
              ol: {
                  marginLeft: scale(8),
                  paddingLeft: scale(16),
                  marginVertical: verticalScale(4),
              },
              // Fix for tables
              table: {
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: scale(4),
                  marginVertical: verticalScale(8),
                  width: '100%',
              },
              tr: {
                  borderBottomWidth: 1,
                  borderColor: '#e5e7eb',
              },
              th: {
                  padding: scale(8),
                  backgroundColor: '#f9fafb',
                  fontSize: moderateScale(14, 0.8),
                  fontWeight: 'bold',
                  color: '#111827',
              },
              td: {
                  padding: scale(8),
                  fontSize: moderateScale(14, 0.8),
                  color: '#374151',
              },
              em: {
                  fontStyle: 'italic',
                  color: '#4b5563',
              }
          }}
        />
        
        {description.length > 300 && (
          <Pressable
            style={styles.toggleButton}
            onPress={showDescHandlers.toggle}
          >
            {isShowDesc ? (
              <Text style={styles.toggleText}>Show Less</Text>
            ) : (
              <>
                <Text style={styles.toggleText}>Read More</Text>
                <AntDesign name="arrowright" 
                  size={scale(24)} 
                  style={styles.toggleIcon} 
                />
              </>
            )}
          </Pressable>
        )}
      </View>
      <View style={styles.divider} />
    </Pressable>
  );
};



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
  },
  title: {
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(16, 0.8),
    fontWeight: '600',
    color: '#111827',
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
  },
  descriptionText: {
    fontSize: moderateScale(14),
    lineHeight: verticalScale(24),
    letterSpacing: scale(0.5),
    color: '#666',
  },
  htmlBaseStyle: {
    fontSize: moderateScale(14, 0.8),
    color: '#111827',
    lineHeight: verticalScale(20),
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: verticalScale(8),
  },
  toggleText: {
    fontSize: moderateScale(14),
    color: '#38bdf8', // sky-400 equivalent
    fontWeight: '500',
  },
  toggleIcon: {
    color: '#38bdf8', // sky-400 equivalent
    marginLeft: scale(4),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb', // gray-200 equivalent
    marginVertical: verticalScale(16),
  },
});

export default Description;