import React from 'react';
import { useController } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import DisplayError from './display_error';

export default function TextField(props) {
  // Props
  const {
    label,
    errors,
    name,
    type = 'text',
    control,
    direction,
    ...inputProps
  } = props;

  // Form Hook
  const { field } = useController({
    name,
    control,
    rules: { required: true },
  });

  // Handlers
  const onChangeHandler = (value) => {
    if (type === 'number' && value.length !== 0) {
      field.onChange(parseInt(value));
    } else {
      field.onChange(value);
    }
  };

  // Render
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        id={name}
        value={field?.value?.toString()}
        name={field.name}
        onBlur={field.onBlur}
        onChangeText={onChangeHandler}
        ref={field.ref}
        {...inputProps}
      />
      <DisplayError errors={errors} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: moderateScale(12),
    color: '#374151', // gray-700
    marginBottom: verticalScale(4),
  },
  input: {
    width: '100%',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#E5E7EB', // gray-200
    borderRadius: moderateScale(6),
    backgroundColor: 'rgba(244, 244, 245, 0.3)', // zinc-50/30
    fontSize: moderateScale(14),
    marginTop: verticalScale(10),
  },
  inputFocus: {
    borderColor: '#2563EB', // blue-600
  },
});