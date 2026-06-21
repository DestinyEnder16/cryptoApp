import * as yup from 'yup';
import { nameRule } from './basicFormSchema';

const countryRule = yup
  .string()
  .required('Enter a country')
  .min(2, 'Enter a valid country');

const documentTypeRule = yup.string().required('Select a document type');

const documentNumberRule = yup
  .string()
  .required('Enter a document number')
  .min(4, 'Enter a valid document number');

export const kycIdentitySchema = yup.object({
  name: nameRule,
  country: countryRule,
  documentType: documentTypeRule,
  documentNumber: documentNumberRule,
});
