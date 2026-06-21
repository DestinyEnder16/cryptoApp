import Ionicons from '@expo/vector-icons/Ionicons';
import type React from 'react';
import type { DocumentTypeValue } from '../types/kyc/types';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export interface DocOption {
  label: string;
  value: DocumentTypeValue;
  description: string;
  icon: IconName;
}

// Single source of truth for the document choices. The UI shows `label`; the
// KYC submit endpoint wants `value`.
export const DOCUMENT_OPTIONS: DocOption[] = [
  {
    label: 'National ID',
    value: 'national_id',
    description: 'Government-issued identity card',
    icon: 'card-outline',
  },
  {
    label: 'Passport',
    value: 'passport',
    description: 'International travel document',
    icon: 'airplane-outline',
  },
  {
    label: 'Drivers License',
    value: 'drivers_license',
    description: 'Valid driving permit',
    icon: 'car-outline',
  },
];

// The slice stores the human label (so it can be displayed); convert it to the
// API enum value at submit time.
export function documentTypeValueFromLabel(
  label: string
): DocumentTypeValue | undefined {
  return DOCUMENT_OPTIONS.find((option) => option.label === label)?.value;
}
