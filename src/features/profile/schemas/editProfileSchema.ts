import * as yup from 'yup';
import { emailRule, nameRule } from '@/src/shared/schemas/basicFormSchema';

const phoneRule = yup
  .string()
  .required('Enter a mobile number')
  .matches(
    /^\+[1-9]\d{7,14}$/,
    'Enter a valid mobile number in international format (e.g. +2348012345678)',
  );

const usernameRule = yup
  .string()
  .required('Choose a username')
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .matches(
    /^[a-zA-Z0-9_]+$/,
    'Only letters, numbers, and underscores allowed',
  );

export const editProfileSchema = yup.object({
  fullName: nameRule,
  username: usernameRule,
  email: emailRule,
  phone: phoneRule,
});
