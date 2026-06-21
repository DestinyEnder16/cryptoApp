import { Pressable, StyleSheet, Text, View } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface DocOption {
  label: string;
  description: string;
  icon: IconName;
}

const OPTIONS: DocOption[] = [
  {
    label: 'National ID',
    description: 'Government-issued identity card',
    icon: 'card-outline',
  },
  {
    label: 'Passport',
    description: 'International travel document',
    icon: 'airplane-outline',
  },
  {
    label: 'Drivers License',
    description: 'Valid driving permit',
    icon: 'car-outline',
  },
];

interface OptionProps {
  option: DocOption;
  id: number;
  setOptionId: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
}

function Option({ option, setOptionId, id, isActive }: OptionProps) {
  return (
    <Pressable
      style={[styles.pressable, isActive && styles.pressableActive]}
      onPress={() => setOptionId(id)}
    >
      <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
        <Ionicons
          name={option.icon}
          size={20}
          color={isActive ? Colors.green : Colors.ash}
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.optionTxt, isActive && styles.optionTxtActive]}>
          {option.label}
        </Text>
        <Text style={styles.descriptionTxt}>{option.description}</Text>
      </View>

      <View style={[styles.radio, isActive && styles.radioActive]}>
        {isActive && (
          <Ionicons name="checkmark" size={14} color={Colors.primaryBackgroundColor} />
        )}
      </View>
    </Pressable>
  );
}

export default function BottomSheetContent() {
  const [selectedOption, setSelectedOption] = useState(0);
  return (
    <View style={{ gap: 24 }}>
      <View style={{ gap: 6 }}>
        <Text style={styles.title}>Select a document</Text>
        <Text style={styles.subtitle}>
          Choose the document you wish to complete the KYC with.
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        {OPTIONS.map((option, index) => (
          <Option
            option={option}
            key={index}
            id={index + 1}
            setOptionId={setSelectedOption}
            isActive={selectedOption === index + 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: Colors.dark,
    minHeight: 64,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    gap: 14,
  },
  pressableActive: {
    borderColor: Colors.green,
    backgroundColor: Colors.lime,
  },
  iconWrap: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: Colors.secondaryBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(94, 213, 168, 0.12)',
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: 18,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  optionTxt: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: 15,
  },
  optionTxtActive: {
    color: Colors.text,
  },
  descriptionTxt: {
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    fontSize: 12,
  },
  radio: {
    height: 24,
    width: 24,
    borderRadius: 1000,
    borderWidth: 1.5,
    borderColor: Colors.ash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.green,
    backgroundColor: Colors.green,
  },
});
