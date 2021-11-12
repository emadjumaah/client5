import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const phoneRegExp =
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

const catSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required(),
});
export const catResolver = { resolver: yupResolver(catSchema) };

const departSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required(),
  color: yup.string().required(),
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
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required(),
  price: yup.number().min(0).required(),
});
export const itmResolver = { resolver: yupResolver(itmSchema) };

const emplSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required(),
  phone: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required(),
  color: yup.string().required(),
});
export const emppResolver = { resolver: yupResolver(emplSchema) };

const invItemSchema = yup.object().shape({
  price: yup.number().min(0).required(),
  qty: yup.number().min(1).required(),
});
export const invItemResolver = { resolver: yupResolver(invItemSchema) };
