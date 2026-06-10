import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Fonts } from '../constants/fonts';
import { Colors } from '../constants/styles';

interface SearchProps {
  text: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchMarketCoins({ text, onChangeText }: SearchProps) {
  return (
    <TextInput
      placeholder="Search coin or symbol"
      style={styles.searchField}
      placeholderTextColor={Colors.textMuted}
      value={text}
      onChangeText={(e) => onChangeText(e)}
    />
  );
}

const styles = StyleSheet.create({
  searchField: {
    backgroundColor: Colors.secondaryBackgroundColor,
    paddingHorizontal: 30,
    height: 48,
    borderRadius: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
});
