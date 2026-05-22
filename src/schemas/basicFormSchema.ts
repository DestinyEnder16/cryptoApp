import * as yup from "yup";

export const emailRule = yup
  .string()
  .required("Email is required")
  .email("Enter a valid email address");

const passwordRule = yup
  .string()
  .required("Please put a password")
  .min(8, "Must be at least 8 characters")
  .matches(/[A-Z]/, "Must include an uppercase letter")
  .matches(/\d/, "Must include a number");

const mobileRule = yup
  .string()
  .required("Enter a mobile number")
  .matches(
    /^\+[1-9]\d{7,14}$/,
    "Enter a valid mobile number in international format (e.g. +2348012345678)",
  );
export const nameRule = yup
  .string()
  .required("Enter a name")
  .min(3, "Name must be at least 3 characters");

export const signUpSchema = yup.object({
  email: emailRule,
  password: passwordRule,
  name: nameRule,
});

export const registerMobileSchema = yup.object({
  mobile: mobileRule,
});

export const signInSchema = yup.object({
  email: emailRule,
  password: passwordRule,
  mobile: mobileRule,
});
