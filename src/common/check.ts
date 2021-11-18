/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as check from './roles';
import { getStoreItem } from '../store';

const store = getStoreItem('store');
const user = store?.user;

// const branch = Object.keys(user.roles)[0];
// const systems = Object.keys(user.roles[branch]);

// console.log("branch", branch);
// console.log("systems", systems);

export const roles = {
  isSuperAdmin: () => check.isSuperAdmin(user),
  isBranchAdmin: () => check.isBranchAdmin(user),
  isEmployee: () => check.isEmployee(user),
  isFinance: () => check.isFinance(user),
  isOperate: () => check.isOperate(user),
  isEditor: () => check.isEditor(user),
  isWriter: () => check.isWriter(user),
  isViewer: () => check.isViewer(user),
};

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
