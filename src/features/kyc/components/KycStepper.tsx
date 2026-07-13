import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { Fonts } from '@/src/shared/constants/fonts';
import { Colors } from '@/src/shared/constants/styles';

const steps = ['identity', 'document', 'review'];

interface Step {
  currentStep: 0 | 1 | 2 | 3;
  // Optional override for the default spacing baked into the container.
  style?: StyleProp<ViewStyle>;
}

export default function KycStepper({ currentStep, style }: Step) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.stepper}>
        {steps.map((step, index) => {
          const isActive = Number(currentStep) > index;
          return (
            <React.Fragment key={step}>
              <Pressable
                style={[styles.pressable, isActive && styles.pressableActive]}
              >
                <Text style={[styles.txt, isActive && styles.txtActive]}>
                  {index + 1}
                </Text>
              </Pressable>
              {index + 1 < steps.length && (
                <View
                  style={[
                    styles.line,
                    currentStep > index + 1 && styles.lineActive,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View style={styles.labelRow}>
        {steps.map((step, index) => (
          <Text
            key={step}
            style={[
              styles.stepTxt,
              currentStep > index && { color: Colors.text },
            ]}
          >
            {step}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 40,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressable: {
    borderRadius: 100,
    height: 24,
    width: 24,
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackgroundColor,
    justifyContent: 'center',
  },
  pressableActive: {
    backgroundColor: Colors.green,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.dotInactive,
  },
  lineActive: {
    backgroundColor: Colors.green,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepTxt: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.ash,
    textTransform: 'capitalize',
  },
  txt: {
    color: Colors.textMuted,
    fontFamily: Fonts.bold,
    fontSize: 10,
  },
  txtActive: {
    color: Colors.dark,
  },
});
