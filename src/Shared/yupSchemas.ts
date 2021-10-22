import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const brandSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required(),
});
export const brandResolver = { resolver: yupResolver(brandSchema) };

const loginSchema = yup.object().shape({
  username: yup.string().required().min(3).max(100),
  password: yup.string().required().min(3).max(100),
});
export const loginResolver = { resolver: yupResolver(loginSchema) };

const addUserSchema = yup.object().shape({
  password: yup.string().required().min(6).max(100),
});
export const addUserResolver = { resolver: yupResolver(addUserSchema) };
const editUserSchema = yup.object().shape({
  username: yup.string(),
});
export const editUserResolver = { resolver: yupResolver(editUserSchema) };

const catSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required().min(3).max(100),
});

export const catResolver = { resolver: yupResolver(catSchema) };
const passSchema = yup.object().shape({
  // password: yup.string().required().min(3).max(100),
  newPassword: yup.string().required().min(3).max(100),
  newPassword2: yup.string().required().min(3).max(100),
});

export const passResolver = { resolver: yupResolver(passSchema) };

const departSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required().min(3).max(100),
  color: yup.string(),
});
export const departResolver = { resolver: yupResolver(departSchema) };

const custSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required(),
  phone: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required(),
  email: yup.string().email(),
});
export const custResolver = { resolver: yupResolver(custSchema) };
const itmSchema = yup.object().shape({
  barcode: yup.string(),
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required(),
  price: yup.number().min(0).required(),
});
export const itmResolver = { resolver: yupResolver(itmSchema) };

const emplSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required().min(3).max(100),
  phone: yup.string(),
});
export const emppResolver = { resolver: yupResolver(emplSchema) };
const depositSchema = yup.object().shape({
  amount: yup.number().min(0).required().positive(),

  disc: yup.string(),
});
export const depositResolver = { resolver: yupResolver(depositSchema) };

const invoeSchema = yup.object().shape({
  customer: yup.string().required(),
  phone: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required(),
});
export const invoiceResolver = { resolver: yupResolver(invoeSchema) };
