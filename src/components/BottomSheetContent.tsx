import { Pressable, StyleSheet, Text, View } from 'react-native';

import React, { useState } from 'react';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

const OPTIONS = ['National ID', 'Passport', 'Drivers License'];

interface OptionProps {
  option: string;
  id: number;
  setOptionId: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
}

function Option({ option, setOptionId, id, isActive }: OptionProps) {
  return (
    <Pressable
      style={[styles.pressable, isActive && { borderColor: Colors.green }]}
      onPress={() => setOptionId(id)}
    >
      <View
        style={[
          styles.checkMark,
          isActive && {
            borderColor: Colors.green,
            backgroundColor: Colors.lightGreen,
          },
        ]}
      ></View>
      <Text style={styles.optionTxt}>{option}</Text>
    </Pressable>
  );
}

export default function BottomSheetContent() {
  const [selectedOption, setSelectedOption] = useState(0);
  return (
    <View style={{ gap: 30 }}>
      <Text style={styles.txt}>
        Select a document you wish to complete the KYC
      </Text>

      <View style={{ gap: 20 }}>
        {OPTIONS.map((option, index) => (
          <Option
            option={option}
            key={index}
            id={index}
            setOptionId={setSelectedOption}
            isActive={selectedOption === index}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: Colors.dark,
    height: 52,
    flexDirection: 'row',
    paddingLeft: 10,
    borderRadius: 14,
    borderWidth: 0.7,
    borderColor: Colors.text,
    alignItems: 'center',
    gap: 20,
  },
  checkMark: {
    height: 30,
    width: 30,
    borderColor: Colors.text,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 1000,
  },
  txt: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: 16,
  },
  optionTxt: {
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
});
