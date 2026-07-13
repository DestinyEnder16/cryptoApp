import * as yup from 'yup';

export const disable2faSchema = yup.object({
  password: yup.string().required('Password is required'),
  code: yup
    .string()
    .required('Authenticator code is required')
    .matches(/^\d{6}$/, 'Enter the 6-digit code'),
});

export type Disable2faFormValues = yup.InferType<typeof disable2faSchema>;
